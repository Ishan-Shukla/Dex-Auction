import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ASSET from "../../artifacts/contracts/DexAuction.sol/DeXAuction.json";
import { ethers } from "ethers";
import ViewCard from "../../Components/Card/ViewCard";

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
            index: counter++,
          };
          return asset;
        })
    );
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
  );
};
