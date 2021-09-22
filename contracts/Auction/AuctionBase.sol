// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
pragma experimental ABIEncoderV2;

import "./AuctionCore.sol";
import "./Extension/Pausable.sol";
import "hardhat/console.sol";

contract AuctionBase is AuctionCore, Pausable {

    // Creaters a reference to the NFT ownership contract(NFC).
    constructor(address assetAuctionAddress){
        asset = ERC721(assetAuctionAddress);
        assetBase = AssetBase(assetAuctionAddress);
        setOwner(assetAuctionAddress);
    }

    // Creates and begins a new auction.
    function CreateAuction(
        uint256 _tokenId,
        uint256 _startingPrice,
        uint256 _duration
    )
        external
        whenNotPaused
    {
        require(!_isOnAuction(_tokenId),"Auction already exists");
        require(msg.sender == asset.ownerOf(_tokenId),"NFT query for not owned NFT");
        require(asset.getApproved(_tokenId) == address(this),"NFT not approved for auction");
        // Sanity check that no inputs overflow how many bits we've allocated
        // to store them in the auction struct.
        require(_startingPrice == uint256(uint128(_startingPrice)),"Starting Price not in range");
        require(_duration == uint256(uint64(_duration)),"Duration not in Range");

        // Require that all auctions have a duration of at least 1 hour.

        require(_duration >= 1 minutes,"Duration must be equal or greater than 1 hours");
        
        // NFT is escrowed i.e. kept by the contract.
        _escrow(_tokenId);

        // Temporary auction struct
        Auction memory auction = Auction(
            _tokenId,
            msg.sender,
            uint128(_startingPrice),
            uint128(0),
            address(0),
            uint64(_duration),
            uint64(0),
            true
        );

        // Add's Auction to open Auctions
        _addAuction(_tokenId, auction);
    }

    // Bids on an open auction.
    function BidAuction(uint256 _tokenId)
        external
        payable
        whenNotPaused
    {
        require(_isOnAuction(_tokenId),"NFT not on Auction");
        require(_bid(_tokenId, uint128(msg.value)),"Bid Failed");
        emit BidPlaced(_tokenId, msg.sender, msg.value);
    }

    // Cancel an open Auction.
    function CancelAuction(uint256 _tokenId)
        external 
    {
        require(_isOnAuction(_tokenId),"NFT not on Auction");
        address _seller = Auctions[tokenIdToAuction[_tokenId]].seller;
        require(msg.sender == _seller,"NFT query for not owned NFT");
        _cancelAuction(_tokenId,_seller);
        emit AuctionCancelled(_tokenId);
    }

    function claim(uint256 _tokenId, address claimant) 
        external
        whenNotPaused
    {
        Auction memory auction = Auctions[tokenIdToAuction[_tokenId]];
        require(auction.startAt + auction.duration <= block.timestamp,"Auction is not Over yet");
        require(auction.maxBidder == claimant, "Only Winner can Claim");
        _claim(_tokenId, claimant);
    }
    
    // Withdraw all Ether from the contract i.e Owner's cut
    function WithdrawBalance()
        external 
    {
        require(msg.sender == owner());
        uint256 amount = address(this).balance;
        (bool success, ) = msg.sender.call{value: amount }("");
        require(success,"Withdrawal Failed");
    }

    // checks if NFT is on auction
    function isOnAuction(uint256 _tokenId)
        external
        view
        returns(bool)
    {
        return _isOnAuction(_tokenId);
    }

    // Get all details of NFT on Auction
    function getAuction(uint256 _tokenId)
        external
        view
        returns(Auction memory)
    {
        return Auctions[tokenIdToAuction[_tokenId]];
    }

    // returns all assets on auction owned by the owner
    function assetsOnAuction()
        external
        view
        returns(Auction[] memory)
    {
        uint256 count = onAuctionCount[msg.sender];
        Auction[] memory result = new Auction[](count);
        for (uint256 i = 1 ; i <= count ; i++) {
            result[i-1] = Auctions[tokenIdToAuction[assetOnAuction[msg.sender][i]]];
        }
        return result;
    }

    // returns all auctions to view on marketPlace
    function getAllAuctions()
        external
        view
        returns(Auction[] memory)
    {
        return Auctions;
    }

    // returns balance of msg sender
    function auctionBalance(address account)
        external
        view
        returns(uint256)
    {
        return onAuctionCount[account];
    }

}