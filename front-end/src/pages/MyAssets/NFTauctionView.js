<<<<<<< HEAD
import React, { useContext } from "react";
import { useParams, useHistory } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import { NFT } from "./AuctionView";
import { GoBack } from "../../Components/Buttons/GoBack";
=======
import React, { useContext, useEffect, useState, Fragment } from "react";
import { useParams, useHistory } from "react-router";
import { BrowserRouter as Router } from "react-router-dom";
import { Dialog, Transition } from "@headlessui/react";
import { GoBack } from "../../Components/Buttons/GoBack";
import ASSET from "../../artifacts/contracts/DexAuction.sol/DeXAuction.json";
>>>>>>> Front-End
import AUCTION from "../../artifacts/contracts/Auction/AuctionBase.sol/AuctionBase.json";
import { ethers } from "ethers";
import { MetamaskProvider } from "../../App";
import { UserAccount } from "../../App";
<<<<<<< HEAD
import placeHolder from "../../img/PlaceHolder.svg";

require("dotenv");
const auction = process.env.REACT_APP_AUCTION_BASE;

export const NFTauctionView = (props) => {
  const history = useHistory();
  const nfts = useContext(NFT);
  const provider = useContext(MetamaskProvider);
  const Account = useContext(UserAccount);
  const { id, index } = useParams();

=======
import { formatEther } from "@ethersproject/units";
import axios from "axios";
import loading from "../../img/Loading.svg";
import UseTitle from "../../Components/Title/UseTitle";

require("dotenv");
const auction = process.env.REACT_APP_AUCTION_BASE;
const asset = process.env.REACT_APP_DEX_AUCTION;

export const NFTauctionView = (props) => {
  const history = useHistory();
  const provider = useContext(MetamaskProvider);
  const Account = useContext(UserAccount);
  const { id } = useParams();
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [NFTs, setNFTs] = useState([]);
  const [status, setStatus] = useState("");
  const [isCancelModalOpen, setCancelConfirmation] = useState(false);
  const [isErrorModalOpen, setErrorModal] = useState(false);
  const [errorcode, setErrorcode] = useState(0);
>>>>>>> Front-End
  const changeStatus = () => {
    props.status("not-loaded");
  };

<<<<<<< HEAD
  async function cancelAuction() {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(auction, AUCTION.abi, signer);
    let transaction = await contract.CancelAuction(nfts[index].tokenId);
    let tx = await transaction.wait();
    const balance = await contract.auctionBalance(Account.toString());
    console.log(balance.toNumber());
=======
  // Set Title
  UseTitle(`NFT ${id}`);
  
  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const signer = await provider.getSigner();
    let contract = new ethers.Contract(auction, AUCTION.abi, signer);
    const data = await contract.getAuction(id);
    contract = new ethers.Contract(asset, ASSET.abi, signer);
    const tokenURI = await contract.tokenURI(data.tokenId);
    const meta = await axios.get(tokenURI);
    let auctionNFT = {
      tokenId: data.tokenId.toNumber(),
      seller: data.seller.toString(),
      reservePrice: formatEther(data.startingPrice.toString()),
      maxBidPrice: formatEther(data.maxBidPrice.toString()),
      maxBidder: data.maxBidder.toString(),
      duration: data.duration.toNumber(),
      startAt: data.startAt.toNumber(),
      status: data.auctionStatus.toString(),
      image: `http://127.0.0.1:8080/ipfs/${meta.data.NFTHash}`,
      name: meta.data.name,
      description: meta.data.description,
    };

    console.log("---NFT View (Auction MyAssets)---");
    console.log("Viewing NFT (TokenId): " + auctionNFT.tokenId);

    setNFTs(auctionNFT);

    if (auctionNFT.startAt === 0) {
      setStatus("Inactive");
    } else {
      const getBlockchainTime = async () => {
        const block = await provider.getBlockNumber();
        const received = await provider.getBlock(block);
        return received.timestamp;
      };
      const time = await getBlockchainTime();
      const auctionPeriod = auctionNFT.startAt + auctionNFT.duration;
      if (time < auctionPeriod) {
        setStatus("Active");
      } else if (time < auctionPeriod + 86400) {
        setStatus("Over");
      } else {
        setStatus("Un-Claimed");
      }
    }
    setLoadingState("loaded");
  }

  async function cancelAuction() {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(auction, AUCTION.abi, signer);
    let transaction = await contract.CancelAuction(NFTs.tokenId);
    let tx = await transaction.wait();

    console.log("---Auction Cancelled---");
    console.log("Token ID: " + tx.events[2].args[0].toNumber());
    console.log("Block no.: " + tx.blockNumber);

    const balance = await contract.auctionBalance(Account.toString());
>>>>>>> Front-End

    if (balance.toNumber() === 0) {
      history.push("/MyAssets");
      props.viewState();
    } else {
      history.push("/MyAssets/AuctionView");
      changeStatus();
    }
  }

<<<<<<< HEAD
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
=======
  const closeErrorModal = () => {
    setErrorModal(false);
  };

  const closeCancelModal = () => {
    setCancelConfirmation(false);
  };

  const closeAndCancel = async () => {
    try {
      await cancelAuction();
    } catch (error) {
      setErrorcode(error.code);
      setErrorModal(true);
    }
    setCancelConfirmation(false);
  };

  const openCancelModal = () => {
    setCancelConfirmation(true);
  };

  if (loadingState === "loaded") {
    return (
      <Router>
        <GoBack url="/MyAssets/AuctionView" change={changeStatus} />
        <div className="flex pt-36 pl-32 pr-32 pb-14 h-screen justify-center">
          <div className="w-full flex justify-center h-max p-4 border-r-2">
            <img src={NFTs.image} alt="PlaceHolder"></img>
          </div>
          <div className="p-4 w-full cursor-default">
            <div className="flex w-full h-full flex-col font-semibold">
              <div className="flex border-b-2">
                <div className="text-5xl font-Hanseif pb-1 mr-5">
                  #{NFTs.tokenId}
                </div>
                <div className="text-5xl font-Hanseif pb-1 flex-1">
                  {NFTs.name}
                </div>
                <div className="flex-none place-self-end text-blue-400 animate-pulse">
                  &#8226;{status}
                </div>
              </div>

              <div className="p-2">
                <div>Owner</div>
                <div className="pl-4">{NFTs.seller}</div>
              </div>
              <div className="p-2">Reserve Price- {NFTs.reservePrice} ETH</div>
              <div className="p-2">maxBidPrice- {NFTs.maxBidPrice} ETH</div>
              <div className="p-2">maxBidder- {NFTs.maxBidder}</div>
              <div className="p-2">Duration- {NFTs.duration / 3600} Hrs</div>
              <div className="p-2">Start At- {NFTs.startAt}</div>
              <div className="p-2">Status- {NFTs.status}</div>
              <button
                onClick={openCancelModal}
                className="p-4 mt-auto transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none"
              >
                Cancel Auction
              </button>
            </div>
          </div>
        </div>
        <Transition appear show={isErrorModalOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            onClose={closeErrorModal}
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            <div className="min-h-screen px-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0" />
              </Transition.Child>

              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-medium leading-6 text-gray-900"
                  >
                    {errorcode === 4001
                      ? "Transaction Denied"
                      : errorcode === -32603
                      ? "Nonce Too High"
                      : "Opps an unexpected Error occurred"}
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {errorcode === 4001
                        ? `Looks like You denied transaction signature. Cancelling NFT is not free and requires Ether.`
                        : errorcode === -32603
                        ? "This can be easily resolved by reseting your Metamask Account. Go to Settings > Advanced > Reset Account to reset your account. NO, Your Ether won't be lost only account settings will reset."
                        : `${errorcode}: An Unknown error Occurred and has been reported. Sorry for inconvinience.`}
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                      onClick={closeErrorModal}
                    >
                      OK
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
        <Transition appear show={isCancelModalOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            onClose={closeCancelModal}
          >
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
            <div className="min-h-screen px-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Dialog.Overlay className="fixed inset-0" />
              </Transition.Child>

              <span
                className="inline-block h-screen align-middle"
                aria-hidden="true"
              >
                &#8203;
              </span>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                  <Dialog.Title
                    as="h3"
                    className="text-xl font-medium leading-6 text-gray-900"
                  >
                    Cancel Auction
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      {status === "Inactive"
                        ? `On cancellation your NFT will be transferred back to You.`
                        : status === "Active"
                        ? "Auction is Live and accepting Bids. On cancellation only NFT will be transferred back."
                        : "NFT has not been claimed by the winning bidder. On cancellation NFT + 25% bid will be transferred."}
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                      onClick={closeAndCancel}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition>
      </Router>
    );
  } else {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <img src={loading} alt="Loading" className="h-20" />
      </div>
    );
  }
>>>>>>> Front-End
};
