import React, { useState, useEffect } from "react";
import AUCTION from "../artifacts/contracts/Auction/AuctionBase.sol/AuctionBase.json";
import ASSET from "../artifacts/contracts/DexAuction.sol/DeXAuction.json";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { ethers } from "ethers";
import OnAuctionViewCard from "../Components/Card/OnAuctionViewCard";
import NFTViewMarketPlace from "./Market/NFTViewMarketPlace";
<<<<<<< HEAD
=======
import axios from "axios";
import loading from "../img/Loading.svg";
import UseTitle from "../Components/Title/UseTitle";
>>>>>>> Front-End

require("dotenv");
const asset = process.env.REACT_APP_DEX_AUCTION;
const auction = process.env.REACT_APP_AUCTION_BASE;

export const NFT = React.createContext();

const MarketPlace = () => {
  const [onAuctions, setAuctions] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

<<<<<<< HEAD
=======
  // Set Title
  UseTitle("MarketPlace");
  
>>>>>>> Front-End
  useEffect(() => {
    if (loadingState === "not-loaded") {
      loadNFTs();
    }
  }, [loadingState]);

  const setStatus = () => {
    setLoadingState("not-loaded");
  };

  async function loadNFTs() {
    const Provider = new ethers.providers.JsonRpcProvider();
    let contract = new ethers.Contract(auction, AUCTION.abi, Provider);
    const data = await contract.getAllAuctions();
<<<<<<< HEAD
    console.log(data);
=======
>>>>>>> Front-End
    contract = new ethers.Contract(asset, ASSET.abi, Provider);
    const auctions = await Promise.all(
      data
        .filter((nft) => nft.tokenId.toNumber() !== 0)
        .slice()
        .sort((a, b) =>
          a.tokenId.toNumber() > b.tokenId.toNumber()
            ? 1
            : b.tokenId.toNumber() > a.tokenId.toNumber()
            ? -1
            : 0
        )
        .map(async (NFT) => {
          const tokenURI = await contract.tokenURI(NFT.tokenId);
<<<<<<< HEAD
=======
          const meta = await axios.get(tokenURI);
>>>>>>> Front-End
          let asset = {
            tokenId: NFT.tokenId.toNumber(),
            seller: NFT.seller.toString(),
            reservePrice: NFT.startingPrice.toString(),
            maxBidPrice: NFT.maxBidPrice.toString(),
            maxBidder: NFT.maxBidder.toString(),
            duration: NFT.duration.toNumber(),
            startAt: NFT.startAt.toNumber(),
            status: NFT.auctionStatus.toString(),
<<<<<<< HEAD
            tokenURI,
=======
            image: `http://127.0.0.1:8080/ipfs/${meta.data.NFTHash}`,
            name: meta.data.name,
            description: meta.data.description,
>>>>>>> Front-End
          };
          return asset;
        })
    );
<<<<<<< HEAD
    console.log(auctions);
    setAuctions(auctions);
    setLoadingState("loaded");
  }
=======

    console.log("---MarketPlace---");
    console.log("NFTs Fetched from Blockchain: " + auctions.length);

    setAuctions(auctions);
    setLoadingState("loaded");
  }

>>>>>>> Front-End
  if (loadingState === "loaded" && onAuctions.length)
    return (
      <Router>
        <Route exact path="/Market">
          <div className="flex pt-32 justify-center">
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-20 pt-4">
                {onAuctions.map((nft) => (
<<<<<<< HEAD
                  <div
                    key={nft.tokenId}
                  >
                    <Link to={`/Market/Auction/${nft.tokenId}`}>
                      <OnAuctionViewCard
                        tokenId={nft.tokenId}
                        seller={nft.seller}
                        reservePrice={nft.reservePrice}
                        maxBidPrice={nft.maxBidPrice}
                        maxBidder={nft.maxBidder}
                        duration={nft.duration}
                        startAt={nft.startAt}
                        status={nft.status}
                        tokenURI={nft.tokenURI}
                        index={nft.index}
=======
                  <div key={nft.tokenId}>
                    <Link to={`/Market/Auction/${nft.tokenId}`}>
                      <OnAuctionViewCard
                        tokenId={nft.tokenId}
                        reservePrice={nft.reservePrice}
                        maxBidPrice={nft.maxBidPrice}
                        duration={nft.duration}
                        startAt={nft.startAt}
                        image={nft.image}
                        name={nft.name}
>>>>>>> Front-End
                      />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Route>
        <Route path="/Market/Auction/:id">
          <NFTViewMarketPlace status={setStatus} />
        </Route>
      </Router>
    );

<<<<<<< HEAD
    if (!onAuctions.length) {
      return (
        <div className="mx-auto text-center mt-40 mb-40 text-4xl font-semibold">No Assets on Auction</div>
      );
    }
    return (
      <div className="mx-auto text-center mt-40 mb-40 text-4xl font-semibold">loading</div>
    );
};

export default MarketPlace;

=======
  if (!onAuctions.length) {
    return (
      <div className="mx-auto text-center mt-40 mb-40 text-4xl font-semibold">
        No Assets on Auction
      </div>
    );
  }
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <img src={loading} alt="Loading" className="h-20" />
    </div>
  );
};

export default MarketPlace;
>>>>>>> Front-End
