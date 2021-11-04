import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ASSET from "../../artifacts/contracts/DexAuction.sol/DeXAuction.json";
import { ethers } from "ethers";
import ViewCard from "../../Components/Card/ViewCard";
<<<<<<< HEAD

require("dotenv");
const asset = process.env.REACT_APP_DEX_AUCTION;

export const NFT = React.createContext();

export const NFTHome = (props) => {
  const [NFTs, setNFTs] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    if (loadingState === "not-loaded") {
      loadNFTs();
    }
  }, [loadingState]);

  async function loadNFTs() {
    const Provider = new ethers.providers.JsonRpcProvider();
    const contract = new ethers.Contract(asset, ASSET.abi, Provider);
    const data = await contract.getAllAssets();
    const blackHole = "0x0000000000000000000000000000000000000000";
    let counter = 0;
    let assets = await Promise.all(
      data
        .filter((nft) => nft.TokenID.toNumber() !== 0)
        .filter((nft) => blackHole.localeCompare(nft.owner.toString()) !== 0)
        .map(async (NFT) => {
          const tokenURI = await contract.tokenURI(NFT.TokenID);
          let asset = {
            tokenId: NFT.TokenID.toNumber(),
            owner: NFT.owner,
            tokenURI,
=======
import axios from "axios";

// ABI import
require("dotenv");
const asset = process.env.REACT_APP_DEX_AUCTION;

export const NFTHome = () => {
  const [NFTs, setNFTs] = useState([]); // Fetched NFTs (All NFTs Minted)
  const [loadingState, setLoadingState] = useState("not-loaded"); // Loading state for main return

  // useEffect + loadingState
  useEffect(() => {
    let continueLoading = true;
    if (loadingState === "not-loaded") {
      loadNFTs().then((assets) => {
        if (continueLoading) {
          setNFTs(assets);
          setLoadingState("loaded");
        }
      });
    }
    return () => {
      continueLoading = false;
    };
  }, [loadingState]);

  // Fetch NFTs from Blockchain
  async function loadNFTs() {
    const Provider = new ethers.providers.JsonRpcProvider(); // JsonRpcProvider
    const contract = new ethers.Contract(asset, ASSET.abi, Provider);
    const data = await contract.getAllAssets(); // Fetched data from blockchain
    const blackHole = "0x0000000000000000000000000000000000000000"; // BlackHole Address
    let counter = 0; // Index Counter

    // Organized data
    let assets = await Promise.all(
      data
        .filter((nft) => nft.tokenId.toNumber() !== 0)
        .filter((nft) => blackHole.localeCompare(nft.owner.toString()) !== 0)
        .map(async (NFT) => {
          const tokenURI = await contract.tokenURI(NFT.tokenId);
          const meta = await axios.get(tokenURI);
          let asset = {
            tokenId: NFT.tokenId.toNumber(),
            owner: NFT.owner,
            image: `http://127.0.0.1:8080/ipfs/${meta.data.NFTHash}`,
            name: meta.data.name,
            description: meta.data.description,
>>>>>>> Front-End
            index: counter++,
          };
          return asset;
        })
    );
<<<<<<< HEAD
    console.log(assets);
    setNFTs(assets);
    setLoadingState("loaded");
  }
  if (loadingState === "loaded" && NFTs.length) {
    return (
            <div className="flex mt-20 mb-20 justify-center">
              <div className="p-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-20 pt-4">
                  {NFTs.map((nft) => (
                    <div
                      key={nft.tokenId}
              
                    >
                      <Link to={`/NFT/${nft.tokenId}`}>
                        <ViewCard tokenId={nft.tokenId} owner={nft.owner} />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
    );
  }
  return (
    <div className="mx-auto text-center mt-40 mb-40 text-4xl font-semibold">No NFT to Display</div>
=======

    console.log("---HOME---");
    console.log("NFTs Fetched from Blockchain: " + assets.length);
    return assets;
  }

  if (loadingState === "loaded" && NFTs.length) {
    return (
      <div className="flex pt-24 pb-40 justify-center ">
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-20 pt-4">
            {NFTs.map((nft) => (
              <div key={nft.tokenId}>
                <Link to={`/NFT/${nft.tokenId}`}>
                  <ViewCard
                    tokenId={nft.tokenId}
                    name={nft.name}
                    image={nft.image}
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="mx-auto text-center h-screen pt-96 text-4xl font-semibold">
      No NFT to Display
    </div>
>>>>>>> Front-End
  );
};
