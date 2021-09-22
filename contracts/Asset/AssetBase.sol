 // SPDX-License-Identifier: MIT
pragma solidity 0.8.0;
pragma experimental ABIEncoderV2;

import "./AccessControl.sol";
import "../Auction/AuctionBase.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./ERC721/ERC721.sol";


// Base Asset Contract controls all NFT/Asset related Data
contract AssetBase is AccessControl,ERC721 {
    // Counters 
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Reference to AuctionBase Contract
    AuctionBase public auction;
    
    // Asset structure (might change in future)
    struct Asset {
        // string ipfs;
        uint256 TokenID;
        address owner;
    }

    // Assets stored in this array 
    // Primary array that contains all assets tokenid wise
    Asset[] public Assets;

    // All Assets mapped to there original owner
    // Address -> balance -> tokenId
    // Example
    // address => address of Owner (Hulk)
    // balance of Hulk => 4
    // owns Token 2 8 14 52
    //    Hulk--> 1 -> 2
    //      |---> 2 -> 8
    //      |---> 3 -> 14
    //      |---> 4 -> 52
    mapping (address=>mapping(uint256=>uint256)) public ownsToken;

    // Events
    event Minted(address indexed from,uint256 indexed tokenID);
    event Burned(address indexed from,uint256 indexed tokenID);

    // Constructor Initializes ERC721 and sets 0 index of Assets
    // Array to null.
    constructor()ERC721("ASSET","AST"){
        Assets.push(Asset(0,address(this)));
    }
    
    // To allow actions only when contract is paused
    modifier onlyAuction {
        require(msg.sender == address(auction),"Only Auction Contract can access");
        _;
    }

    // Mints Asset and fires Minted Event.
    function mintAsset(string memory _ipfsURI) 
        internal 
        whenNotPaused
        returns(uint256)
    {
        // msg sender will be the owner
        address owner = msg.sender;

        // Increments token ID 
        _tokenIds.increment();

        // New TokenID
        uint256 TokenId = _tokenIds.current();

        // Mints Token for owner/owner of Asset
        _mint(owner, TokenId);

        // Adds TokenURI for the asset
        _setTokenURI(TokenId,_ipfsURI);

        // Adds Asset TokenID to respective owner address;
        ownsToken[owner][balanceOf(owner)] = TokenId;

        // Asset data to be stored
        Asset memory _asset = Asset(
            TokenId,
            owner
        );

        // Push asset in Assets array
        Assets.push(_asset);

        // Fires Minted Event
        emit Minted(owner,TokenId);

        // Return New TokenID
        return TokenId;
    }

    // Burn Asset and Remove traces of corresponding asset
    function burnAsset(uint256 tokenId) 
        internal
        whenNotPaused 
    {
        address owner = msg.sender;

        // Caller should own the token
        require(owner == ownerOf(tokenId),"NFT query for not owned NFT");
        
        // Initial Balance for swaping final token with burned token in mapping 
        uint256 initialBalance = balanceOf(owner);
        
        // Burns token
        _burn(tokenId);
        
        // finalBalance for checking base condition
        uint256 finalBalance = balanceOf(owner);
        
        // delete Asset from Assets
        delete Assets[tokenId];
        
        // Base condition
        if(finalBalance == 0){
            // Deletes token from ownsToken
            delete ownsToken[owner][1];
            
            // Emits Burned
            emit Burned(owner, tokenId);
        } else {
            // Itterate and find token by tokenId
            for (uint256 i = 1; i <= initialBalance; i++) {
                // Token Found
                if(ownsToken[owner][i] == tokenId) {
                    // Swap last token with to be deleted token
                    ownsToken[owner][i] = ownsToken[owner][initialBalance];
                    
                    // delete last token
                    delete ownsToken[owner][initialBalance];
                    
                    // Emits Burned
                    emit Burned(owner, tokenId);
                    
                    // Get out of loop
                    break;
                }
            }
        }
    }

    // Approve Contract to Handle NFT
    function Approve(uint256 _tokenId)
        external
    {
        require(msg.sender == ownerOf(_tokenId));
        
        // Approves auction contract to manage NFT
        approve(address(auction),_tokenId);
    }
    
    // Manage ownsToken mapping
    function Escrowed(uint256 tokenId , address owner)
    onlyAuction
    external
    {
        // finalBalance for checking base condition
        uint256 finalBalance = balanceOf(owner);
        
        // Initial Balance for swaping final token with burned token in mapping 
        uint256 initialBalance = finalBalance + 1 ;
        
        // Base condition
        if(finalBalance == 0){
            // Deletes token from ownsToken
            delete ownsToken[owner][1];
        } else {
            // Itterate and find token by tokenId
            for (uint256 i = 1; i <= initialBalance; i++) {
                // Token Found
                if(ownsToken[owner][i] == tokenId) {
                    
                    // Swap last token with to be deleted token
                    ownsToken[owner][i] = ownsToken[owner][initialBalance];
                    
                    // delete last token
                    delete ownsToken[owner][initialBalance];
                    
                    // Get out of loop
                    break;
                }
            }
        }
    }
    
    function Transfered(uint256 tokenId , address owner)
    onlyAuction
    external
    {
        ownsToken[owner][balanceOf(owner)] = tokenId;
    }

}