import React, { useState, useEffect, useContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { ethers } from "ethers";
import Address from "../Components/Header/Address";
import { MetamaskProvider } from "../App";
import { UserAccount } from "../App";
import Mint from "./MyAssets/Mint";
import ASSET from "../artifacts/contracts/DexAuction.sol/DeXAuction.json";
import AUCTION from "../artifacts/contracts/Auction/AuctionBase.sol/AuctionBase.json";
import { AssetView } from "./MyAssets/AssetView";
import { MintButton } from "../Components/Buttons/MintButton";
import { AssetButton } from "../Components/Buttons/AssetButton";
import { AuctionButton } from "../Components/Buttons/AuctionButton";
import { AuctionView } from "./MyAssets/AuctionView";
<<<<<<< HEAD
=======
import loading from "../img/Loading.svg";
import UseTitle from "../Components/Title/UseTitle";
>>>>>>> Front-End

require("dotenv");
const asset = process.env.REACT_APP_DEX_AUCTION;
const auction = process.env.REACT_APP_AUCTION_BASE;

export const CHECK = React.createContext();

const MyAssets = () => {
<<<<<<< HEAD
  
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [load, setLoad] = useState(0);
=======
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [loadButtons, setLoadButtons] = useState(0);
>>>>>>> Front-End

  const provider = useContext(MetamaskProvider);
  const Account = useContext(UserAccount);

<<<<<<< HEAD
  useEffect(() => {
    if (loadingState === "not-loaded") {
      console.log("Checking Status");
=======
  // Set Title
  UseTitle("My Assets");

  useEffect(() => {
    if (loadingState === "not-loaded") {
>>>>>>> Front-End
      checkAsset();
    }
  }, [loadingState]);

  async function checkAsset() {
<<<<<<< HEAD
    console.log(Account.toString());
=======
    console.log("---My Assets---");
    console.log("Account No.: " + Account.toString());

>>>>>>> Front-End
    const assetContract = new ethers.Contract(asset, ASSET.abi, provider);
    const auctionContract = new ethers.Contract(auction, AUCTION.abi, provider);
    const assetbalance = await assetContract.balanceOf(Account.toString());
    const auctionbalance = await auctionContract.auctionBalance(
      Account.toString()
    );
<<<<<<< HEAD
    console.log("Asset Balance:");
    console.log(assetbalance.toNumber());
    console.log("Auction Balance:");
    console.log(auctionbalance.toNumber());
=======

    console.log("Asset Balance: " + assetbalance.toNumber());
    console.log("Auction Balance: " + auctionbalance.toNumber());
>>>>>>> Front-End

    // 0 -> no asset and auction owned
    // 1 -> has only asset owned
    // 2 -> has only auction owned
    // 3 -> owns both asset and auction
    let check = 0;
<<<<<<< HEAD

=======
>>>>>>> Front-End
    if (assetbalance.toNumber() > 0) {
      check = 1;
    }
    if (auctionbalance.toNumber() > 0) {
      if (check === 1) {
        check = 3;
      } else {
        check = 2;
      }
    }
<<<<<<< HEAD
    console.log("Check:");
    console.log(check);
    setLoad(check);
=======

    setLoadButtons(check);
>>>>>>> Front-End
    setLoadingState("loaded");
  }

  const setStatus = () => {
    setLoadingState("not-loaded");
  };

  if (loadingState === "loaded")
    return (
      <Router>
        <Switch>
          <Route exact path="/MyAssets">
            <Address address={Account} />
<<<<<<< HEAD
            <div className="flex flex-col mt-10 my-auto mx-auto items-center">
              {load === 0 ? (
                <p className="text-5xl font-semibold pb-10 ">
                  Mint Your First Asset
                </p>
              ) : null}
              <MintButton />
              {load === 1 || load === 3 ? <AssetButton /> : null}
              {load === 2 || load === 3 ? <AuctionButton /> : null}
=======
            <div className="flex items-center h-96">
              <div className="flex flex-col mt-24 my-auto mx-auto items-center">
                {loadButtons === 0 ? (
                  <p className="text-5xl font-semibold pb-10 ">
                    Mint Your First Asset
                  </p>
                ) : null}
                <MintButton />
                {loadButtons === 1 || loadButtons === 3 ? (
                  <AssetButton />
                ) : null}
                {loadButtons === 2 || loadButtons === 3 ? (
                  <AuctionButton />
                ) : null}
              </div>
>>>>>>> Front-End
            </div>
          </Route>
          <Route path="/MyAssets/Mint">
            <Mint status={setStatus} />
          </Route>
          <Route path="/MyAssets/AssetView">
<<<<<<< HEAD
              <AssetView status={setStatus} />
=======
            <AssetView status={setStatus} />
>>>>>>> Front-End
          </Route>
          <Route path="/MyAssets/AuctionView">
            <AuctionView status={setStatus} />
          </Route>
        </Switch>
      </Router>
    );

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
export default MyAssets;
