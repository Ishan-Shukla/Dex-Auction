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
<<<<<<< HEAD
=======
import axios from "axios";
import loading from "../../img/Loading.svg";
import UseTitle from "../../Components/Title/UseTitle";
>>>>>>> Front-End

require("dotenv");
const auction = process.env.REACT_APP_AUCTION_BASE;
const asset = process.env.REACT_APP_DEX_AUCTION;

<<<<<<< HEAD
export const NFT = React.createContext();

=======
>>>>>>> Front-End
export const AuctionView = (props) => {
  const [NFTs, setNFTs] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  const provider = useContext(MetamaskProvider);

<<<<<<< HEAD
=======
  // Set Title
  UseTitle("Auction View");
>>>>>>> Front-End
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
<<<<<<< HEAD
    let counter = 0;
=======
>>>>>>> Front-End
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
            index: counter++,
=======
            image: `http://127.0.0.1:8080/ipfs/${meta.data.NFTHash}`,
            name: meta.data.name,
            description: meta.data.description,
>>>>>>> Front-End
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
<<<<<<< HEAD
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
=======
                    <div key={nft.tokenId}>
                      <Link to={`/MyAssets/onAuction/${nft.tokenId}`} replace>
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
<<<<<<< HEAD
          <NFT.Provider value={NFTs}>
            <Route path="/MyAssets/onAuction/:id/:index">
              <NFTauctionView
                status={() => setLoadingState("not-loaded")}
                viewState={changeStatus}
              />
            </Route>
          </NFT.Provider>
=======
          <Route path="/MyAssets/onAuction/:id">
            <NFTauctionView
              status={() => setLoadingState("not-loaded")}
              viewState={changeStatus}
            />
          </Route>
>>>>>>> Front-End
        </Switch>
      </Router>
    );
  }
<<<<<<< HEAD
  return <h1>Loading</h1>;
=======
  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <img src={loading} alt="Loading" className="h-20" />
    </div>
  );
>>>>>>> Front-End
};
