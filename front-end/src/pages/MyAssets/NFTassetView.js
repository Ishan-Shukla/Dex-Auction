<<<<<<< HEAD
import React, { useContext, useState } from "react";
=======
import React, { useContext, useState, useEffect, Fragment } from "react";
>>>>>>> Front-End
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
<<<<<<< HEAD
=======
import { Dialog, Transition } from "@headlessui/react";
import axios from "axios";
import loading from "../../img/Loading.svg";
import UseTitle from "../../Components/Title/UseTitle";
>>>>>>> Front-End

require("dotenv");
const asset = process.env.REACT_APP_DEX_AUCTION;
const auction = process.env.REACT_APP_AUCTION_BASE;

export const NFTassetView = (props) => {
  const history = useHistory();
<<<<<<< HEAD

  const nfts = useContext(NFT);

  const { id, index } = useParams();

  const provider = useContext(MetamaskProvider);
  const Account = useContext(UserAccount);

  const [auctionInput, updateAuctionInput] = useState({
    price: "",
    duration: "",
  });

=======
  const nfts = useContext(NFT);
  const { id, index } = useParams();

  // Set Title
  UseTitle(`NFT ${id}`)
  
  const provider = useContext(MetamaskProvider);
  const Account = useContext(UserAccount);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [NFTs, setNFTs] = useState([]);

  const [auctionInput, updateAuctionInput] = useState({
    price: "",
    duration: 0,
    days: 0,
    hours: 0,
  });

  const [check, setCheck] = useState(0);

  const Bvalid = "border-gray-200 placeholder-gray-600";
  const Binvalid = "border-red-600 placeholder-red-600";
  const Ovalid = "ring-black";
  const Oinvalid = "ring-red-400";

  const [isApprovalOpen, setApprovalModal] = useState(false);
  const [isCreateOpen, setCreateModal] = useState(false);
  const [isScrollActive, setScroll] = useState(false);
  const [isBurnOpen, setBurnModal] = useState(false);
  const [isErrorModalOpen, setErrorModal] = useState(false);
  const [errorcode, setErrorcode] = useState(0);

>>>>>>> Front-End
  const changeStatus = () => {
    props.status();
  };

<<<<<<< HEAD
  async function BurnAsset() {
    const signer = provider.getSigner();

    /* next, create the item */
    const contract = new ethers.Contract(asset, ASSET.abi, signer);
    const transaction = await contract.Burn(id);
    const tx = await transaction.wait();
=======
  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(asset, ASSET.abi, signer);

    const data = await contract.getAsset(id);

    const tokenURI = await contract.tokenURI(data.tokenId);
    const meta = await axios.get(tokenURI);

    const assetNFT = {
      tokenId: data.tokenId.toNumber(),
      owner: data.owner.toString(),
      image: `http://127.0.0.1:8080/ipfs/${meta.data.NFTHash}`,
      name: meta.data.name,
      description: meta.data.description,
    };

    console.log("---NFT View (MyAssets)---");
    console.log("Viewing NFT (TokenId): " + assetNFT.tokenId);

    setNFTs(assetNFT);
    setLoadingState("loaded");
  }

  const closeModal = () => {
    setErrorModal(false);
  };

  const openModal = () => {
    setErrorModal(true);
  };

  const activateScroll = () => {
    setScroll(true);
  };

  const deactivateScroll = () => {
    setScroll(false);
  };

  const openApproval = () => {
    setApprovalModal(true);
  };

  const closeApproval = () => {
    setApprovalModal(false);
  };

  const closeAndApprove = async () => {
    await approveAsset(nfts[index].tokenId);

    setApprovalModal(false);
    setCreateModal(true);
  };

  const closeCreate = () => {
    return;
  };

  const incrementDay = () => {
    if (auctionInput.duration === 720) {
      return;
    } else {
      updateAuctionInput((prevState) => ({
        price: prevState.price,
        duration: prevState.duration + 24,
        days: prevState.days + 1,
        hours: prevState.hours,
      }));
    }
  };

  const decrementDay = () => {
    if (auctionInput.days === 0) {
      return;
    } else if (auctionInput.duration === 24) {
      updateAuctionInput((prevState) => ({
        price: prevState.price,
        duration: prevState.duration - 23,
        days: prevState.days - 1,
        hours: prevState.hours + 1,
      }));
    } else {
      updateAuctionInput((prevState) => ({
        price: prevState.price,
        duration: prevState.duration - 24,
        days: prevState.days - 1,
        hours: prevState.hours,
      }));
    }
  };

  const incrementHour = () => {
    if (auctionInput.duration === 720) {
      return;
    } else if (auctionInput.hours === 23) {
      updateAuctionInput((prevState) => ({
        price: prevState.price,
        duration: prevState.duration + 1,
        days: prevState.days + 1,
        hours: 0,
      }));
    } else {
      updateAuctionInput((prevState) => ({
        price: prevState.price,
        duration: prevState.duration + 1,
        days: prevState.days,
        hours: prevState.hours + 1,
      }));
    }
  };

  const decrementHour = () => {
    if (auctionInput.hours === 0 || auctionInput.duration === 1) {
      return;
    } else {
      updateAuctionInput((prevState) => ({
        price: prevState.price,
        duration: prevState.duration - 1,
        days: prevState.days,
        hours: prevState.hours - 1,
      }));
    }
  };

  const openBurn = () => {
    setBurnModal(true);
  };

  const CloseBurn = () => {
    setBurnModal(false);
  };

  const CloseAndBurn = async () => {
    try {
      await BurnAsset();
    } catch (error) {
      setErrorcode(error.code);
      openModal(true);
      return;
    }
    setBurnModal(false);
  };

  // error handling below
  const closeAndCreate = async () => {
    const { price, duration: total } = auctionInput;
    await createAuction(nfts[index].tokenId, price, total * 3600);
    setCreateModal(false);
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
  };

  async function BurnAsset() {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(asset, ASSET.abi, signer);

    const transaction = await contract.Burn(id);
    const tx = await transaction.wait();

    console.log("---Burn---");
    console.log("Burn Successful");
    console.log("Token ID: " + tx.events[0].args[2].toNumber());
    console.log("Block no.: " + tx.blockNumber);

>>>>>>> Front-End
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
<<<<<<< HEAD

    let contract = new ethers.Contract(asset, ASSET.abi, signer);
    let transaction = await contract.Approve(tokenId);
    let tx = await transaction.wait();
=======
    let contract = new ethers.Contract(asset, ASSET.abi, signer);
    let transaction = await contract.Approve(tokenId);
    let tx = await transaction.wait();

    console.log("---Approved---");
    console.log(
      "TokenID: " + tx.events[0].args[2].toNumber() + " Approved Successful"
    );
>>>>>>> Front-End
  }

  async function createAuction(tokenId, price, duration) {
    const signer = provider.getSigner();
<<<<<<< HEAD
    // console.log(parseInt(duration));
=======
>>>>>>> Front-End
    let contract = new ethers.Contract(auction, AUCTION.abi, signer);
    let transaction = await contract.CreateAuction(
      tokenId,
      ethers.utils.parseEther(price),
      parseInt(duration)
    );
    let tx = await transaction.wait();
<<<<<<< HEAD
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
=======

    console.log("---Auction Created---");
    console.log("Token ID: " + tx.events[2].args[0].toNumber());
    console.log("Block no.: " + tx.blockNumber);
  }

  async function approveAndCreate() {
    const { price, duration: total } = auctionInput;
    if (!price || total === 0) {
      if (!price && total === 0) {
        setCheck(3);
      } else if (!price) {
        setCheck(1);
      } else {
        setCheck(2);
      }
      return;
    }
    const signer = provider.getSigner();
    let contract = new ethers.Contract(asset, ASSET.abi, signer);
    if ((await contract.getApproved(nfts[index].tokenId)) === auction) {
      setCreateModal(true);
    } else openApproval();
  }

  if (loadingState === "loaded") {
    return (
      <Router>
        <GoBack change={() => props.viewState()} url={"/MyAssets/AssetView"} />
        <Route exact path={`/MyAssets/Asset/${id}/${index}`}>
          <div className="flex pt-36 pl-32 pr-32 pb-14 h-screen justify-center">
            <div className="w-full flex justify-center h-max p-4 border-r-2">
              <img src={NFTs.image} alt="PlaceHolder"></img>
            </div>
            <div className="p-4 w-full cursor-default">
              <div className="flex w-full h-full flex-col font-semibold">
                <div className="flex border-b-2">
                  <div className="text-5xl font-Hanseif pb-1">
                    #{NFTs.tokenId}
                  </div>
                  <div className="text-4xl font-Hanseif p-1 place-self-end ml-4">
                    {NFTs.name}
                  </div>
                </div>
                <div className="p-2">"{NFTs.description}"</div>
                <div className="flex justify-evenly w-full mt-auto p-4">
                  <button
                    onClick={openBurn}
                    className="flex items-center p-2 pl-4 pr-4  transition ease-in duration-200 uppercase rounded-full hover:bg-red-600 hover:text-white border-2 border-gray-900 hover:border-red-600 focus:outline-none"
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
          <Transition appear show={isBurnOpen} as={Fragment}>
            <Dialog
              as="div"
              className="fixed inset-0 z-10 overflow-y-auto"
              onClose={CloseBurn}
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
                      Burn
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure You want to burn the NFT?
                      </p>
                    </div>

                    <div className=" flex mt-4">
                      <div className="flex-1  flex justify-center">
                        <button
                          type="button"
                          className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                          onClick={CloseAndBurn}
                        >
                          Yes
                        </button>
                      </div>
                      <div className="flex-1 flex justify-center">
                        <button
                          type="button"
                          className="px-4 py-2 text-sm font-medium text-white bg-green-500 border border-transparent rounded-md hover:bg-green-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                          onClick={CloseBurn}
                        >
                          No
                        </button>
                      </div>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition>
        </Route>
        <Route path="/MyAssets/Asset/Create/:id/:index">
          <div className="pt-10 min-w-full h-screen">
            <div className=" w-1/2 mx-auto pt-20 flex flex-col justify-center pb-12">
              <input
                placeholder="Auction Price (ETH)"
                value={auctionInput.price}
                className={`mt-8 border select-none ${
                  check === 0 || check === 2 ? Bvalid : Binvalid
                } rounded p-4 placeholder-opacity-100 focus:placeholder-opacity-70 focus:border-opacity-0 focus:outline-none focus:ring-2 focus:${
                  check === 1 || check === 3 ? Oinvalid : Ovalid
                } font-semibold`}
                onChange={(e) => {
                  if (!isNaN(+e.target.value)) {
                    const temp = e.target.value.indexOf(".");
                    if (temp) {
                      if (e.target.value.substring(temp + 1).length <= 18) {
                        updateAuctionInput({
                          ...auctionInput,
                          price: e.target.value,
                        });
                      }
                    } else {
                      updateAuctionInput({
                        ...auctionInput,
                        price: e.target.value,
                      });
                    }
                  } else {
                    return;
                  }
                  if (
                    auctionInput.price.length === 1 &&
                    e.nativeEvent.data === null
                  ) {
                    setCheck(check === 2 ? 3 : 1);
                  }
                  if (!auctionInput.price) {
                    setCheck(check === 3 ? 2 : 0);
                  }
                }}
              />
              <div
                className={`mt-2 border border-gray-200 rounded p-4 pt-2`}
                onMouseEnter={activateScroll}
                onMouseLeave={deactivateScroll}
              >
                <p
                  className={`select-none ${
                    check === 0 || check === 1
                      ? "text-gray-600"
                      : "text-red-600"
                  } font-semibold`}
                >
                  Auction Duration
                </p>
                <div className="flex p-4 pt-1">
                  <div className="flex-1 flex flex-col">
                    <div className="text-2xl text-gray-600 font-semibold ml-auto mr-auto mb-2 select-none">
                      Days
                    </div>
                    <div className="flex justify-arround items-center">
                      <div
                        className={`h-10 w-10 ml-20 mr-auto ${
                          isScrollActive
                            ? "transform transition-all hover:scale-90 delay-100 duration-400 ease-in opacity-100"
                            : "transition-all delay-100 ease-out opacity-0"
                        }`}
                        onClick={incrementDay}
                      >
                        <svg viewBox="0 0 32 32" aria-hidden="true">
                          <path d="M15.997 13.374l-7.081 7.081L7 18.54l8.997-8.998 9.003 9-1.916 1.916z" />
                        </svg>
                      </div>
                      <div className="text-6xl w-24 text-center text-gray-600 font-semibold ml-auto mr-auto pb-1 select-none">
                        {auctionInput.days}
                      </div>
                      <div
                        className={`h-10 w-10 ml-auto mr-20 ${
                          isScrollActive
                            ? "transform transition-all hover:scale-90 delay-100 duration-400 ease-in opacity-100"
                            : "transition-all delay-100 ease-out opacity-0"
                        }`}
                        onClick={decrementDay}
                      >
                        <svg viewBox="0 0 32 32" aria-hidden="true">
                          <path d="M16.003 18.626l7.081-7.081L25 13.46l-8.997 8.998-9.003-9 1.917-1.916z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="text-2xl text-gray-600 font-semibold ml-auto mr-auto mb-2 select-none">
                      Hours
                    </div>
                    <div className="flex justify-arround items-center">
                      <div
                        className={`h-10 w-10 ml-20 mr-auto ${
                          isScrollActive
                            ? "transform transition-all hover:scale-90 delay-100 duration-400 ease-in opacity-100"
                            : "transition-all delay-100 ease-out opacity-0"
                        }`}
                        onClick={incrementHour}
                      >
                        <svg viewBox="0 0 32 32" aria-hidden="true">
                          <path d="M15.997 13.374l-7.081 7.081L7 18.54l8.997-8.998 9.003 9-1.916 1.916z" />
                        </svg>
                      </div>
                      <div className="text-6xl w-24 text-center text-gray-600 font-semibold ml-auto mr-auto pb-1 select-none">
                        {auctionInput.hours}
                      </div>
                      <div
                        className={`h-10 w-10 ml-auto mr-20 ${
                          isScrollActive
                            ? "transform transition-all hover:scale-90 delay-100 duration-400 ease-in opacity-100"
                            : "transition-all delay-100 ease-out opacity-0"
                        }`}
                        onClick={decrementHour}
                      >
                        <svg viewBox="0 0 32 32" aria-hidden="true">
                          <path d="M16.003 18.626l7.081-7.081L25 13.46l-8.997 8.998-9.003-9 1.917-1.916z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <button
                onClick={approveAndCreate}
                className="font-bold relative top-64 p-4 select-none shadow-lg transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none"
              >
                Approve And Create Auction
              </button>
            </div>
          </div>
          <Transition appear show={isApprovalOpen} as={Fragment}>
            <Dialog
              as="div"
              className="fixed inset-0 z-10 overflow-y-auto"
              onClose={closeApproval}
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
                      Approve NFT
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Terms and conditions:
                        <br />
                        1. NFT will be escrowed till the end of auction.
                        <br />
                        2. Auction will be started as soon as it receives first
                        bid.
                        <br />
                        3. DexAuction's cut is the 2% of winning bid.
                        <br />
                        4. No charges if auction cancelled before it is over.
                        <br />
                        5. If auction cancelled NFT will be returned.
                        <br />
                        6. Seller's cut will be transferred as soon as NFT is
                        Claimed.
                        <br />
                        7. If NFT is not claimed within the claiming period. NFT
                        can be reclaimed by seller, with 25% bid amount as
                        compensation.
                      </p>
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                        onClick={closeAndApprove}
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition>
          <Transition appear show={isCreateOpen} as={Fragment}>
            <Dialog
              as="div"
              className="fixed inset-0 z-10 overflow-y-auto"
              onClose={closeCreate}
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

                {/* This element is to trick the browser into centering the modal contents. */}
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
                      NFT Approved Successfully
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Continue to Create Auction
                      </p>
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        className="px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                        onClick={closeAndCreate}
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                </Transition.Child>
              </div>
            </Dialog>
          </Transition>
        </Route>
        <Transition appear show={isErrorModalOpen} as={Fragment}>
          <Dialog
            as="div"
            className="fixed inset-0 z-10 overflow-y-auto"
            onClose={closeModal}
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
                        ? `Looks like You denied transaction signature. Burning NFT is not free and requires Ether.`
                        : errorcode === -32603
                        ? "This can be easily resolved by reseting your Metamask Account. Go to Settings > Advanced > Reset Account to reset your account. NO, Your Ether won't be lost only account settings will reset."
                        : `${errorcode}: An Unknown error Occurred and has been reported. Sorry for inconvinience.`}
                    </p>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 border border-transparent rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-500"
                      onClick={closeModal}
                    >
                      OK
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
