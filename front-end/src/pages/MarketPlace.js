import React, { useState, useEffect } from "react";
import AUCTION from "../artifacts/contracts/Auction/AuctionBase.sol/AuctionBase.json";
import ASSET from "../artifacts/contracts/DexAuction.sol/DeXAuction.json";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { ethers } from "ethers";
import OnAuctionViewCard from "../Components/Card/OnAuctionViewCard";
import NFTViewMarketPlace from "./Market/NFTViewMarketPlace";

require("dotenv");
const asset = process.env.REACT_APP_DEX_AUCTION;
const auction = process.env.REACT_APP_AUCTION_BASE;

export const NFT = React.createContext();

const MarketPlace = () => {
  const [onAuctions, setAuctions] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

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
    console.log(data);
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
          let asset = {
            tokenId: NFT.tokenId.toNumber(),
            seller: NFT.seller.toString(),
            reservePrice: NFT.startingPrice.toString(),
            maxBidPrice: NFT.maxBidPrice.toString(),
            maxBidder: NFT.maxBidder.toString(),
            duration: NFT.duration.toNumber(),
            startAt: NFT.startAt.toNumber(),
            status: NFT.auctionStatus.toString(),
            tokenURI,
          };
          return asset;
        })
    );
    console.log(auctions);
    setAuctions(auctions);
    setLoadingState("loaded");
  }
  if (loadingState === "loaded" && onAuctions.length)
    return (
      <Router>
        <Route exact path="/Market">
          <div className="flex pt-32 justify-center">
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-20 pt-4">
                {onAuctions.map((nft) => (
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

