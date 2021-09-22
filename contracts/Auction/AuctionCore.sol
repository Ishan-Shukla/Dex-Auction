// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
pragma experimental ABIEncoderV2;

import "../Asset/AssetBase.sol";
import "../Asset/ERC721/ERC721.sol";
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract AuctionCore {
    using Counters for Counters.Counter;
    Counters.Counter private auctionIndex;
    // Reference to AssetAuction for comunicating with NFC
    ERC721 public asset;
    
    AssetBase public assetBase;

    // status for providing re-entracy guard 
    // True- inside Function
    // False- outside Function
    bool private _status;

    // fixed claiming Period for winners
    uint64 constant ClaimingPeriod = 1 days;

    // EVENTS
    event AuctionCreated(uint256 tokenId,uint256 startingPrice, uint256 duration);
    event AuctionCancelled(uint256 tokenId);
    event BidPlaced(uint256 tokenId, address bidder, uint256 bidAmount);
    event AuctionSuccessful(uint256 tokenId, uint256 salePrice, address winner);

    // initially sets _status to false
    constructor() {
        _status = false;
        Auction memory legend = Auction(
            0,
            address(0),
            0,
            0,
            address(0),
            0,
            0,
            false
        );
        Auctions.push(legend);
    }

    // Represents an auction of an asset(NFT)
    struct Auction {
        uint256 tokenId;
        address seller;//    Current owner of NFT.
        uint128 startingPrice;//     Price at begining of auction in wei
        // Note: starting price must be more than 0.
        uint128 maxBidPrice;//       Highest bid placed in the Auction.
        address maxBidder;//         Address of highest Bidder.
        uint64 duration;//           Duration of Auctions in seconds.
        uint64 startAt;//            Time when auction started.
        // Note: 0 if the auction has not received any bid.
        bool auctionStatus;//        True if auction is live.
    }

    // Stores All Auctions
    Auction[] public Auctions;
    // Map TokenID to their respective auction
    mapping(uint256 => uint256) public tokenIdToAuction;

    // Map all assets on auction of an address
    mapping(address=>mapping(uint256=>uint256)) public assetOnAuction;

    // Keep count of total no. of NFT put on auction by an address
    mapping(address=>uint256) public onAuctionCount;
    
    // Modifier for Re-entracy lock
    // Working- Initially status is false so entry is allowed.
    //          Once entered status is set to true.
    //          Then if attacker tries for re-entracy it will
    //          be prohibited as status == true.
    modifier reentracyGuard() {
        require(_status != true, "Re-entracy Prohibited");
        _status = true;
        _;
        _status = false;
    }
    
    //
    // SUPPORTING FUNCTIONS
    // 

    // Checks if Claimant owns the token
    function _owns(address _claimant, uint256 _tokenId) 
        internal
        view 
        returns(bool)
    {
        return(asset.ownerOf(_tokenId) == _claimant);
    }

    // Escrows the asset(NFT), assigning ownership to this contract
    function _escrow(uint256 _tokenId)
        internal
    {
        asset.transferFrom(msg.sender, address(this), _tokenId);
        assetBase.Escrowed(_tokenId, msg.sender);
    }

    // Transfers an asset(NFT) owned by this contract to another address
    function Transfer(address _receiver, uint256 _tokenId)
        internal 
    {
        asset.transferFrom(address(this), _receiver, _tokenId);
        assetBase.Transfered(_tokenId, _receiver);
    }

    // Removes an auction from the list of open auctions.
    function _removeAuction(uint256 _tokenId)
        internal
        reentracyGuard
    {

        // Temporary auction struct.
        Auction memory auction = Auctions[tokenIdToAuction[_tokenId]];

        // If startAt == 0 means no bid received & auction 
        // has not started countdown.
        if(auction.startAt == 0){
            _arrangeAuctions(_tokenId);
        }else 
        // Check if auction is not over.
        if(auction.startAt + auction.duration > block.timestamp){
            // Refunding Highest Bidder's Bid.
            (bool success, ) = auction.maxBidder.call{value: auction.maxBidPrice}("");
            require(success);
            _arrangeAuctions(_tokenId);
        }else
        // Auction Claiming Period is over but NFT not claimed.
        if(auction.startAt + auction.duration + ClaimingPeriod <= block.timestamp){
            // Compute cut for seller and owner.
            uint256 cut = _computeCut(auction.maxBidPrice, false);
             
            // Send seller's cut.
            (bool success, ) = auction.seller.call{value: cut}("");
            require(success);
            
            // Refund 50% Bid of the Bidder.
            (success, ) = auction.maxBidder.call{value: cut * 2}("");
            require(success);
            _arrangeAuctions(_tokenId);
        }else{
            // If auction is tried to remove after it's Over.
            // But Claiming Period is not Over yet.
            revert("Claiming Period is not Over yet");
        }
    }

    // Returns true if the NFT is on auction.
    function _isOnAuction(uint256 _tokenId) 
        internal 
        view 
        returns(bool)
    {
        uint256 index = uint256(tokenIdToAuction[_tokenId]);
        if(index == 0){
            return false;
        }
        return Auctions[index].auctionStatus;
    }

    // Computes owner's cut from an auction's sale.
    function _computeCut(uint256 _price,bool claimSuccess)
        internal 
        pure 
        returns(uint256)
    {
        if(claimSuccess){
            return (_price * 2 / 100);
        }else{
            return (_price / 4);
        }
    }

    function _arrangeAuctions(uint256 tokenId)
        internal
    {
        Auction memory auction = Auctions[tokenIdToAuction[tokenId]];
        uint256 count = onAuctionCount[auction.seller]--;
        for(uint256 i = 1; i <= count; i++){
            if(assetOnAuction[auction.seller][i] == tokenId){
                assetOnAuction[auction.seller][i] = assetOnAuction[auction.seller][count];
                delete assetOnAuction[auction.seller][count];
                break;
            }
        }
        auction = Auctions[auctionIndex.current()];
        uint256 pos = tokenIdToAuction[tokenId];
        Auctions[pos] = auction;
        Auctions.pop();
        auctionIndex.decrement();
        tokenIdToAuction[auction.tokenId] = pos;
        delete tokenIdToAuction[tokenId];
    }

    //
    // AUCTION FEATURES FROM HERE
    //

    // Adds an auction to the list of open auctions.
    function _addAuction(uint256 tokenId, Auction memory auction)
        internal 
    {
        auctionIndex.increment();
        // Adds NFT TokenID to open Auction.
        Auctions.push(auction);
        tokenIdToAuction[tokenId] = auctionIndex.current();
        uint256 count = ++onAuctionCount[msg.sender];
        assetOnAuction[msg.sender][count] = tokenId;
        emit AuctionCreated(tokenId, auction.startingPrice, auction.duration);
    }

    // Cancels an auction if some conditions are met.
    //   1. If the Auction is not yet started.
    //   2. If the Auction has started but not over.
    //      Then it firsts refund Bidder price.
    function _cancelAuction(uint256 _tokenId, address _seller)
        internal 
    {
        // Remove auction from open auction
        // and return highest bid to bidder if any.
        _removeAuction(_tokenId);
        // Transfer escrowed NFT back to seller.
        Transfer(_seller, _tokenId);
        emit AuctionCancelled(_tokenId);
    }

    // Bid Function where Bidder can place Bid.
    // Working: 
    // 1. If auction has not started yet.
    //    i.e. a Bid is not received.
    //    1.1 Checks if bidAmount >= starting price.
    //      1.1.1 Declare Starting Time
    //      1.1.2 MaxBidPrice => BidPrice
    //      1.1.3 MaxBidder => Bidder
    //    1.2 If Bid Amount is less.
    //      1.2.1 Return FALSE
    // 2. If the auction has started.
    //    2.1 If the auction is over.
    //      2.1.1 auctionStatus => FALSE
    //      2.1.2 Return FALSE
    //    2.2 If the auction is live.
    //      2.2.1 If the Bid Price >= current Bid + 10%.
    //        2.2.1.1 Refund Previous Bid to it's bidder.
    //        2.2.1.2 MaxBidPrice => BidPrice
    //        2.2.1.3 MaxBidder => Bidder
    //        2.2.1.4 Return True
    //      2.2.2 If the Bid Price is less.
    //        2.2.2.1 Return False
    function _bid(uint256 tokenId, uint128 bidAmount)
        internal 
        reentracyGuard
        returns(bool)
    {
        Auction storage auction = Auctions[tokenIdToAuction[tokenId]];
        address bidder = msg.sender;
        require(bidder != auction.seller,"Seller can't Bid");
        if(auction.startAt == 0){
            if(bidAmount >= auction.startingPrice){
                auction.startAt = uint64(block.timestamp);
                auction.maxBidPrice = bidAmount;
                auction.maxBidder = bidder;
                return true;
            }else{
                return false;
            }
        }else{
            if(auction.startAt + auction.duration <= block.timestamp){
                auction.auctionStatus = false;
                return false;
            }else{
                if((auction.maxBidPrice * 11 / 10) <= bidAmount){
                    (bool success, ) = auction.maxBidder.call{value: auction.maxBidPrice}("");
                    require(success);
                    auction.maxBidder = bidder;
                    auction.maxBidPrice = bidAmount;
                    return true;
                }else{
                    return false;
                }
            }
        }
    }

    // Claim Function Winner can claim Won NFT.
    function _claim(uint256 _tokenId, address claimant)
        internal 
        reentracyGuard 
    {
        // address claimant = msg.sender;
        // Auction with tokenID.
        Auction memory auction = Auctions[tokenIdToAuction[_tokenId]];
        // require(auction.maxBidder == claimant );

        // Owner Cut's of the Auction.
        uint256 ownerCut = _computeCut(auction.maxBidPrice,true);

        // Seller Share of the Auction.
        uint256 sellerCut = auction.maxBidPrice - ownerCut;

        // Send Seller it's Share.
        (bool success, ) = auction.seller.call{value: sellerCut}("");
        require(success);

        // Transfer Winner the NFT.
        Transfer(claimant, _tokenId);
        
        _arrangeAuctions(_tokenId);
        // To emit Auction Successful.
        emit AuctionSuccessful(_tokenId, auction.maxBidPrice, auction.maxBidder);
    }
}