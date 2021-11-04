import React, { useContext, useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import { ethers } from "ethers";
import ASSET from "../../artifacts/contracts/DexAuction.sol/DeXAuction.json";
import { MetamaskProvider } from "../../App";
import ViewCard from "../../Components/Card/ViewCard";
import { GoBack } from "../../Components/Buttons/GoBack";
import { NFTassetView } from "./NFTassetView";
<<<<<<< HEAD
=======
import axios from "axios";
import loading from "../../img/Loading.svg";
import UseTitle from "../../Components/Title/UseTitle";
>>>>>>> Front-End

require("dotenv");
const asset = process.env.REACT_APP_DEX_AUCTION;

export const NFT = React.createContext();

export const AssetView = (props) => {
  const [NFTs, setNFTs] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  const provider = useContext(MetamaskProvider);

<<<<<<< HEAD
=======
  // Set Title
  UseTitle("AssetView");
  
>>>>>>> Front-End
  useEffect(() => {
    if (loadingState === "not-loaded") {
      loadNFTs();
    }
  }, [loadingState]);

  const changeStatus = () => {
    props.status("not-loaded");
  };

  async function loadNFTs() {
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(asset, ASSET.abi, signer);
    const data = await contract.getOwnerAssets();
    const finalData = data
      .slice()
      .sort((a, b) =>
<<<<<<< HEAD
        a.TokenID.toNumber() > b.TokenID.toNumber()
          ? 1
          : b.TokenID.toNumber() > a.TokenID.toNumber()
=======
        a.tokenId.toNumber() > b.tokenId.toNumber()
          ? 1
          : b.tokenId.toNumber() > a.tokenId.toNumber()
>>>>>>> Front-End
          ? -1
          : 0
      );
    let counter = 0;
    let assets = await Promise.all(
      finalData.map(async (NFT) => {
<<<<<<< HEAD
        const tokenURI = await contract.tokenURI(NFT.TokenID);
        let asset = {
          tokenId: NFT.TokenID.toNumber(),
          owner: NFT.owner.toString(),
          tokenURI,
=======
        const tokenURI = await contract.tokenURI(NFT.tokenId);
        const meta = await axios.get(tokenURI);

        let asset = {
          tokenId: NFT.tokenId.toNumber(),
          owner: NFT.owner.toString(),
          image: `http://127.0.0.1:8080/ipfs/${meta.data.NFTHash}`,
          name: meta.data.name,
          description: meta.data.description,
>>>>>>> Front-End
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
          <Route exact path="/MyAssets/AssetView">
            <div className="flex pt-32 justify-center">
<<<<<<< HEAD
              <GoBack change={changeStatus} url="/MyAssets"/>
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-20 pt-4">
                  {NFTs.map((nft) => (
                    <div
                      key={nft.tokenId}
                    >
                      <Link
                        to={`/MyAssets/Asset/${nft.tokenId}/${nft.index}`}
                        
                      >
                        <ViewCard tokenId={nft.tokenId}/>
=======
              <GoBack change={changeStatus} url="/MyAssets" />
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-20 pt-4">
                  {NFTs.map((nft) => (
                    <div key={nft.tokenId}>
                      <Link to={`/MyAssets/Asset/${nft.tokenId}/${nft.index}`}>
                        <ViewCard
                          tokenId={nft.tokenId}
                          name={nft.name}
                          image={nft.image}
                        />
>>>>>>> Front-End
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Route>
          <NFT.Provider value={NFTs}>
            <Route path="/MyAssets/Asset/:id/:index">
<<<<<<< HEAD
              <NFTassetView status={changeStatus} viewState={()=>setLoadingState("not-loaded")} />
=======
              <NFTassetView
                status={changeStatus}
                viewState={() => setLoadingState("not-loaded")}
              />
>>>>>>> Front-End
            </Route>
          </NFT.Provider>
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
