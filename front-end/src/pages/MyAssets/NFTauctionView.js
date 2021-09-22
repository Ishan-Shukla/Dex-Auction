import React, { useContext } from "react";
import { useParams, useHistory } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import { NFT } from "./AuctionView";
import { GoBack } from "../../Components/Buttons/GoBack";
import AUCTION from "../../artifacts/contracts/Auction/AuctionBase.sol/AuctionBase.json";
import { ethers } from "ethers";
import { MetamaskProvider } from "../../App";
import { UserAccount } from "../../App";
import placeHolder from "../../img/PlaceHolder.svg";

require("dotenv");
const auction = process.env.REACT_APP_AUCTION_BASE;

export const NFTauctionView = (props) => {
  const history = useHistory();
  const nfts = useContext(NFT);
  const provider = useContext(MetamaskProvider);
  const Account = useContext(UserAccount);
  const { id, index } = useParams();

  const changeStatus = () => {
    props.status("not-loaded");
  };

  async function cancelAuction() {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(auction, AUCTION.abi, signer);
    let transaction = await contract.CancelAuction(nfts[index].tokenId);
    let tx = await transaction.wait();
    const balance = await contract.auctionBalance(Account.toString());
    console.log(balance.toNumber());

    if (balance.toNumber() === 0) {
      history.push("/MyAssets");
      props.viewState();
    } else {
      history.push("/MyAssets/AuctionView");
      changeStatus();
    }
  }

  return (
    <Router>
      <GoBack url="/MyAssets/AuctionView" change={changeStatus} />
      <div className="flex pt-36 pl-32 pr-32 pb-14 min-h-screen justify-center">
        <div className="w-full flex justify-center border h-max p-4">
          <img src={placeHolder} alt="PlaceHolder"></img>
        </div>
        <div className="p-4 w-full border">
          <div className="flex w-full h-full flex-col border items-center ">
            <div>Token ID- {nfts[index].tokenId}</div>
            <div>Seller- {nfts[index].seller}</div>
            <div>Reserve Price- {nfts[index].reservePrice}</div>
            <div>maxBidPrice- {nfts[index].maxBidPrice}</div>
            <div>maxBidder- {nfts[index].maxBidder}</div>
            <div>Duration- {nfts[index].duration}</div>
            <div>Start At- {nfts[index].startAt}</div>
            <div>Status- {nfts[index].status}</div>
            <div>tokenURI- {nfts[index].tokenURI}</div>
            <button
              onClick={cancelAuction}
              className="flex items-center p-4  transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none"
            >
              Cancel Auction
            </button>
          </div>
        </div>
      </div>
    </Router>
  );
};
