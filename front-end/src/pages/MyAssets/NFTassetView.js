import React, { useContext, useState } from "react";
import { useParams, useHistory } from "react-router";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { NFT } from "./AssetView";
import { GoBack } from "../../Components/Buttons/GoBack";
import AUCTION from "../../artifacts/contracts/Auction/AuctionBase.sol/AuctionBase.json";
import ASSET from "../../artifacts/contracts/DexAuction.sol/DeXAuction.json";
import { ethers } from "ethers";
import { MetamaskProvider } from "../../App";
import { UserAccount } from "../../App";
import placeHolder from "../../img/PlaceHolder.svg";

require("dotenv");
const asset = process.env.REACT_APP_DEX_AUCTION;
const auction = process.env.REACT_APP_AUCTION_BASE;

export const NFTassetView = (props) => {
  const history = useHistory();

  const nfts = useContext(NFT);

  const { id, index } = useParams();

  const provider = useContext(MetamaskProvider);
  const Account = useContext(UserAccount);

  const [auctionInput, updateAuctionInput] = useState({
    price: "",
    duration: "",
  });

  const changeStatus = () => {
    props.status();
  };

  async function BurnAsset() {
    const signer = provider.getSigner();

    /* next, create the item */
    const contract = new ethers.Contract(asset, ASSET.abi, signer);
    const transaction = await contract.Burn(id);
    const tx = await transaction.wait();
    const balance = await contract.balanceOf(Account.toString());
    if (balance.toNumber() === 0) {
      history.push("/MyAssets");
      changeStatus();
    } else {
      history.push("/MyAssets/AssetView");
      props.viewState();
    }
  }

  async function approveAsset(tokenId) {
    const signer = provider.getSigner();

    let contract = new ethers.Contract(asset, ASSET.abi, signer);
    let transaction = await contract.Approve(tokenId);
    let tx = await transaction.wait();
  }

  async function createAuction(tokenId, price, duration) {
    const signer = provider.getSigner();
    // console.log(parseInt(duration));
    let contract = new ethers.Contract(auction, AUCTION.abi, signer);
    let transaction = await contract.CreateAuction(
      tokenId,
      ethers.utils.parseEther(price),
      parseInt(duration)
    );
    let tx = await transaction.wait();
  }

  async function approveAndCreate() {
    const { price, duration } = auctionInput;
    if (!price || !duration) {
      return;
    }

    await approveAsset(nfts[index].tokenId);
    await createAuction(nfts[index].tokenId, price, duration);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(asset, ASSET.abi, signer);
    const balance = await contract.balanceOf(Account.toString());
    if (balance.toNumber() === 0) {
      history.push("/MyAssets");
      changeStatus();
    } else {
      history.push("/MyAssets/AssetView");
      props.viewState();
    }
  }

  return (
    <Router>
      <GoBack change={() => props.viewState()} url={"/MyAssets/AssetView"} />
      <Route exact path={`/MyAssets/Asset/${id}/${index}`}>
        <div className="flex pt-36 pl-32 pr-32 pb-14 min-h-screen justify-center">
          <div className="w-full flex justify-center border h-max p-4">
            <img src={placeHolder} alt="PlaceHolder"></img>
          </div>
          <div className="p-4 w-full border">
            <div className="flex w-full h-full flex-col border items-center ">
              <div className="pt-10 pb-10 text-2xl">Asset Name</div>
              <div className="self-start pl-5 mb-4 border">Asset Id- {nfts[index].tokenId}</div>
              <div className="self-start pl-5 w-full h-2/5 border">Asset description</div>
              <div className="flex justify-evenly w-full mt-14 pl-8 pr-8 border">
                <button
                  onClick={BurnAsset}
                  className="flex items-center p-2 pl-4 pr-4  transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none"
                >
                  Burn Asset
                </button>
                <Link to={`/MyAssets/Asset/Create/${id}/${index}`}>
                  <button className="flex items-center p-2 pl-4 pr-4  transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none">
                    Create Auction
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Route>
      <Route path="/MyAssets/Asset/Create/:id/:index">
        <div className="min-w-full">
          <div className=" w-1/2 mx-auto pt-20 flex flex-col justify-center pb-12">
            <input
              placeholder="Auction Price"
              className="mt-8 border rounded p-4"
              onChange={(e) =>
                updateAuctionInput({ ...auctionInput, price: e.target.value })
              }
            />
            <textarea
              placeholder="Auction Duration"
              className="mt-2 border rounded p-4 resize-none h-52 overflow-y-auto"
              onChange={(e) =>
                updateAuctionInput({
                  ...auctionInput,
                  duration: e.target.value,
                })
              }
            />
            <button
              onClick={approveAndCreate}
              className="flex items-center p-4  transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none"
            >
              Create Auction
            </button>
          </div>
        </div>
      </Route>
    </Router>
  );
};
