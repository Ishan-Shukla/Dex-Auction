import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { GoBack } from "../../Components/Buttons/GoBack";
import ASSET from "../../artifacts/contracts/DexAuction.sol/DeXAuction.json";
import { ethers } from "ethers";
import placeHolder from "../../img/PlaceHolder.svg"

require("dotenv");
const asset = process.env.REACT_APP_DEX_AUCTION;

export const NFTsView = () => {
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [NFT, setNFT] = useState();

  const { id } = useParams();

  useEffect(() => {
    if (loadingState === "not-loaded") {
      loadNFTs();
    }
  }, [loadingState]);

  async function loadNFTs() {
    const Provider = new ethers.providers.JsonRpcProvider();
    const contract = new ethers.Contract(asset, ASSET.abi, Provider);
    const data = await contract.getAsset(id);
    console.log(data);
    const URI = await contract.tokenURI(id);
    const nft = {
      tokenId: data.TokenID.toNumber(),
      owner: data.owner,
      URI
    };
    console.log(nft);
    setNFT(nft);
    setLoadingState("loaded");
  }

  if (loadingState === "loaded")
    return (
      <div>
        <GoBack url="/"/>
        <div className="flex pt-36 pl-32 pr-32 pb-14 min-h-screen justify-center">
          <div className="w-full flex justify-center border h-max p-4">
            <img src={placeHolder} alt="PlaceHolder"></img>
          </div>
          <div className="p-4 w-full border">
            <div className="flex w-full h-full flex-col border items-center ">
              <div className="pt-10 pb-10 text-2xl">Asset Name</div>
              <div className="self-start pl-5 mb-4 border">Owner- {NFT.owner}</div>
              <div className="self-start pl-5 w-full h-2/5 border">Asset description</div>
            </div>
          </div>
        </div>
      </div>
    );
  return <h1>Loading</h1>;
};
