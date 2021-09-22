// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
pragma experimental ABIEncoderV2;

import "./Asset/AssetBase.sol";
import "hardhat/console.sol";

contract DeXAuction is AssetBase {

    // EVENTS //

    // Contract state events
    event Paused(address by);
    event Unpaused(address by);

    // Administrative events
    event CEOchanged(address NewCEO);
    event CFOchanged(address NewCFO);

    // Financial events
    event OwnerCutWithdrawn(address from, uint256 amount);
    event EthersWithdrawn(uint256 Amount);

    // Mint a new Asset
    function Mint(string memory _ipfsHash)
        external 
        returns(uint256)
    {
        uint256 tokenId = mintAsset(_ipfsHash);
        return tokenId;
    }

    // Burns an Asset
    function Burn(uint256 tokenId)
        external 
    {
        require(!auction.isOnAuction(tokenId),"Burn failed NFT on Auction");
        burnAsset(tokenId);
    }

    // Pause the Contract
    function Pause()
        external 
    {
        pause();
        // Cancel all auction first
        auction._pause();
        emit Paused(msg.sender);
    }

    // Pause the Contract
    function Unpause()
        external 
    {
        unpause();
        auction._unpause();
        emit Unpaused(msg.sender);
    }

    // Sets CEO of the Contract
    function SetCEO(address newCEO)
        external 
    {
        setCEO(newCEO);
        emit CEOchanged(newCEO);
    }

    // Sets CFO of the Contract
    function SetCFO(address newCFO)
        external 
    {
        setCFO(newCFO);
        emit CFOchanged(newCFO);
    }

    // Withdraw Owner Cut from auction contract
    function WithdrawOwnerCut()
        external
        onlyChiefs
    {
        auction.WithdrawBalance();
    }

    // Transfer funds to CFO
    function TransferEthers()
        onlyCFO
        external
    {
        uint256 amount = address(this).balance;
        (bool success, ) = cfoAddress.call{value: amount }("");
        require(success,"Funds Transfer Failed");
        emit EthersWithdrawn(amount);
    }

    // Claim won Asset
    function Claim(uint256 tokenId)
        external
        whenNotPaused
    {
        auction.claim(tokenId,msg.sender);
        address seller = Assets[tokenId].owner;
        Assets[tokenId].owner = msg.sender;
        uint256 sellerBalance = balanceOf(seller)+1;
        for (uint256 i = 1; i <= sellerBalance ; i++) {
            if(ownsToken[seller][i] == tokenId){
                ownsToken[seller][i] = ownsToken[seller][sellerBalance];
                delete ownsToken[seller][sellerBalance];
                break;
            }
        }
        ownsToken[msg.sender][balanceOf(msg.sender)] = tokenId;
    }

    // Get all Assets TokenID owned by owner
    function getOwnerAssets() 
        external
        view
        whenNotPaused
        returns(Asset[] memory)  
    {
        address _Owner = msg.sender;
        
        // Total no. of Assets owned by owner 
        uint256 balance = balanceOf(_Owner);

        // Balance should be more than 0
        // require(balance>0,"No Asset Owned");
        if(balance == 0 ){
            return new Asset[](0);
        }
        Asset[] memory result = new Asset[](balance);

        for (uint256 i = 0; i < balance; i++){
            result[i] = Assets[ownsToken[_Owner][i+1]];
            //console.log(ownsToken[_Owner][i+1]);
        }
        // Return result array that contains all TokenIDs
        return result;
    }

    function getAsset(uint256 tokenId)
    external
    view
    whenNotPaused
    returns(Asset memory){
        return Assets[tokenId];
    }

    function getAllAssets()
        external
        view
        whenNotPaused
        returns(Asset[] memory)
    {
        // Asset[] memory result = new Asset[](Assets.length-1);
        // uint128 burnCount = 1;
        // for (uint256 i = 1; i < Assets.length; i++) {
        //     if(Assets[i].TokenID == 0){
        //         burnCount++;
        //         continue;
        //     }
        //    result[i-burnCount] = Assets[i];
        // }
        // Asset[] memory finalResult = new Asset[](Assets.length - burnCount);
        // for (uint256 i = 0; i < finalResult.length;i++){
        //     finalResult[i] = result[i]; 
        // }
        // return finalResult;
        return Assets;
    }

    // Sets Auction Contract Address
    function SetAuctionAddress(address auctionContract)
        external
        onlyCEO
    {
        auction = AuctionBase(auctionContract);
    }

    receive() payable external {
        emit OwnerCutWithdrawn(msg.sender,msg.value);
    }
}

// // Seller of NFT on auction.
    // mapping(uint256 => address) private AuctionSeller;

    // // all assets on auction of an address
    // mapping(address=>mapping(uint256=>uint256)) internal assetOnAuction;
    // mapping(address=>uint256) internal onAuctionCount;

    // // EVENTS
    // event AuctionCreated(uint256 indexed tokenId,uint256 indexed startingPrice, uint256 indexed duration);
    // event AuctionCancelled(uint256 indexed tokenId);
    // event BidPlaced(address indexed bidder, uint256 indexed bidAmount);
    // event AuctionSuccessful(uint256 indexed tokenId, uint256 indexed salePrice, address indexed winner);

    // // Approve Contract to Handle NFT
    // function Approve(uint256 _tokenId)
    //     external
    // {
    //     require(msg.sender == ownerOf(_tokenId));
    //     AuctionSeller[_tokenId] = msg.sender;
    //     // Approves this contract to manage NFT
    //     approve(address(auction),_tokenId);
    // }

    // // Create a new Auction
    // function CreateAuction(
    //     uint256 _tokenId,
    //     uint256 _startingPrice,
    //     uint256 _duration
    // )
    //     external 
    // {
    //     require(!auction.isOnAuction(_tokenId),"Auction already exists");
    //     require(getApproved(_tokenId) == address(auction),"NFT not approved for auction");
    //     require(AuctionSeller[_tokenId] == msg.sender,"Only Owner of token can create Auction");
    //     bool success = auction.createAuction(msg.sender, _tokenId, _startingPrice, _duration);
    //     require(success,"Oop's can't create Auction");
    //     onAuctionCount[msg.sender] +=1;
    //     uint256 count = onAuctionCount[msg.sender];
    //     // console.log(onAuctionCount[msg.sender]);
    //     assetOnAuction[msg.sender][count] = _tokenId;
    //     //console.log(assetOnAuction[msg.sender][count]);
    //     emit AuctionCreated(_tokenId, _startingPrice, _duration);
    // }

    // // Bid on Auction
    // function BidAuction(uint256 _tokenId)
    //     external 
    //     payable 
    // {
    //     require(msg.sender != AuctionSeller[_tokenId]);
    //     uint256 bidAmount = msg.value;
    //     bool success = auction.bid{value: msg.value}(_tokenId, msg.sender);
    //     require(success,"Bid Cancelled");
    //     emit BidPlaced(msg.sender, bidAmount);
    // }

    // // Claim Auction
    // function Claim(uint256 _tokenId)
    //     external 
    // {
    //     uint256 salePrice = auction.claim(_tokenId, msg.sender);
    //     emit AuctionSuccessful(_tokenId, salePrice, msg.sender);
    //     address seller = AuctionSeller[_tokenId];
    //     delete AuctionSeller[_tokenId];
    //     uint256 count = onAuctionCount[seller]--;
    //     // console.log(count);
    //     // console.log(onAuctionCount[seller]);
    //     for(uint256 i = 1; i <= count; i++){
    //     // console.log(assetOnAuction[seller][i]);
    //         if(assetOnAuction[seller][i] == _tokenId){
    //             delete assetOnAuction[seller][i];
    //             break;
    //         }
    //     }
    // }

    // // Cancel an auction
    // function CancelAuction(uint256 _tokenId)
    //     external 
    // {
    //     // Emit AuctionCancelled.
    //     require(msg.sender == AuctionSeller[_tokenId]);
    //     bool success = auction.cancelAuction(_tokenId, msg.sender);
    //     require(success,"Oop's can't Cancel Auction");
    //     emit AuctionCancelled(_tokenId);
    //     address seller = AuctionSeller[_tokenId];
    //     delete AuctionSeller[_tokenId];
    //     uint256 count = onAuctionCount[seller]--;
    //     // console.log(count);
    //     // console.log(onAuctionCount[seller]);
    //     for(uint256 i = 1; i <= count; i++){
    //     // console.log(assetOnAuction[seller][i]);
    //         if(assetOnAuction[seller][i] == _tokenId){
    //             delete assetOnAuction[seller][i];
    //             break;
    //         }
    //     }
    // }
    // function assetsOnAuction()
    //     external
    //     view
    //     whenNotPaused
    //     returns(Auction[] memory)
    // {
    //     uint256 count = onAuctionCount[msg.sender];
    //     Auction[] memory result = new Auction[](count);
    //     for(uint256 i = 1; i <= count; i++){
    //         // result[i-1] = auction.getAuction(assetOnAuction[msg.sender][i]);
    //     }
        
    // }