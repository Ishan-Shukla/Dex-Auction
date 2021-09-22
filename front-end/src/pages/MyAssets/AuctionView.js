import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import AUCTION from "../../artifacts/contracts/Auction/AuctionBase.sol/AuctionBase.json";
import ASSET from "../../artifacts/contracts/DexAuction.sol/DeXAuction.json";
import { MetamaskProvider } from "../../App";
import { GoBack } from "../../Components/Buttons/GoBack";
import { OnAuctionViewCard } from "../../Components/Card/OnAuctionViewCard";
import { NFTauctionView } from "./NFTauctionView";

require("dotenv");
const auction = process.env.REACT_APP_AUCTION_BASE;
const asset = process.env.REACT_APP_DEX_AUCTION;

export const NFT = React.createContext();

export const AuctionView = (props) => {
  const [NFTs, setNFTs] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  const provider = useContext(MetamaskProvider);

  useEffect(() => {
    if (loadingState === "not-loaded") {
      loadNFTs();
    }
  }, [loadingState]);

  const changeStatus = () => {
    props.status();
  };

  async function loadNFTs() {
    const signer = await provider.getSigner();
    let contract = new ethers.Contract(auction, AUCTION.abi, signer);
    const data = await contract.assetsOnAuction();
    contract = new ethers.Contract(asset, ASSET.abi, signer);
    let counter = 0;
    let assets = await Promise.all(
      data
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
            index: counter++,
          };
          return asset;
        })
    );
    setNFTs(assets);
    setLoadingState("loaded");
  }

  if (loadingState === "loaded") {
    return (
      <Router>
        <Switch>
          <Route exact path="/MyAssets/AuctionView">
            <div className="flex pt-32 justify-center">
              <GoBack url="/MyAssets" change={changeStatus} />
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-20 pt-4">
                  {NFTs.map((nft) => (
                    <div
                      key={nft.tokenId}
                    >
                      <Link
                        to={`/MyAssets/onAuction/${nft.tokenId}/${nft.index}`}
                        replace
                      >
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
          <NFT.Provider value={NFTs}>
            <Route path="/MyAssets/onAuction/:id/:index">
              <NFTauctionView
                status={() => setLoadingState("not-loaded")}
                viewState={changeStatus}
              />
            </Route>
          </NFT.Provider>
        </Switch>
      </Router>
    );
  }
  return <h1>Loading</h1>;
};
