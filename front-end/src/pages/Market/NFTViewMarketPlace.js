import React, { useContext, useEffect, useState } from "react";
import { GoBack } from "../../Components/Buttons/GoBack";
import AUCTION from "../../artifacts/contracts/Auction/AuctionBase.sol/AuctionBase.json";
import ASSET from "../../artifacts/contracts/DexAuction.sol/DeXAuction.json";
import { MetamaskProvider } from "../../App";
import { UserAccount } from "../../App";
import { ethers } from "ethers";
import { useParams, useHistory } from "react-router";
<<<<<<< HEAD
import placeHolder from "../../img/PlaceHolder.svg";
=======
import { formatEther } from "@ethersproject/units";
import Countdown from "react-countdown";
import axios from "axios";
import loading from "../../img/Loading.svg";
import UseTitle from "../../Components/Title/UseTitle";
>>>>>>> Front-End

require("dotenv");
const asset = process.env.REACT_APP_DEX_AUCTION;
const auction = process.env.REACT_APP_AUCTION_BASE;

export const NFTViewMarketPlace = (props) => {
<<<<<<< HEAD
  const [onAuction, setAuction] = useState();
=======
  const [NFTonAuction, setAuction] = useState();
>>>>>>> Front-End
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [priceInput, updatePriceInput] = useState({
    price: "",
  });
  const [lock, setLock] = useState(false);
  const [claim, setClaim] = useState(false);
<<<<<<< HEAD

=======
  const [countdownTime, setCountdownTime] = useState(0);
>>>>>>> Front-End
  const history = useHistory();
  const provider = useContext(MetamaskProvider);
  const Account = useContext(UserAccount);
  const { id } = useParams();

<<<<<<< HEAD
=======
  // Set Title
  UseTitle(`Auction NFT ${id}`);

>>>>>>> Front-End
  useEffect(() => {
    if (loadingState === "not-loaded") {
      loadNFTs();
    }
  }, [loadingState]);

  const changeState = () => {
    props.status();
  };

  const isSeller = (seller) => {
    const address = ethers.utils.getAddress(Account.toString());
    return seller.localeCompare(address) === 0;
  };

  async function loadNFTs() {
    const Provider = new ethers.providers.JsonRpcProvider();
    let contract = new ethers.Contract(auction, AUCTION.abi, Provider);
<<<<<<< HEAD
    const data = await contract.getAuction(id);
    contract = new ethers.Contract(asset, ASSET.abi, Provider);
    const URI = await contract.tokenURI(id);
    const auc = {
      tokenId: data.tokenId.toNumber(),
      seller: data.seller.toString(),
      reservePrice: data.startingPrice.toString(),
      maxBidPrice: data.maxBidPrice.toString(),
=======

    const data = await contract.getAuction(id);

    contract = new ethers.Contract(asset, ASSET.abi, Provider);

    const tokenURI = await contract.tokenURI(id);
    const meta = await axios.get(tokenURI);

    const auctionNFT = {
      tokenId: data.tokenId.toNumber(),
      seller: data.seller.toString(),
      reservePrice: formatEther(data.startingPrice.toString()),
      maxBidPrice: formatEther(data.maxBidPrice.toString()),
>>>>>>> Front-End
      maxBidder: data.maxBidder.toString(),
      duration: data.duration.toNumber(),
      startAt: data.startAt.toNumber(),
      status: data.auctionStatus.toString(),
<<<<<<< HEAD
      tokenURI: URI,
    };
    const address = ethers.utils.getAddress(Account.toString());
    if (isSeller(auc.seller)) {
      setLock(true);
    }
    const blockno = await provider.getBlockNumber();
    const block = await provider.getBlock(blockno);
    console.log(block.timestamp);
    if (auc.startAt !== 0) {
      if (auc.startAt + auc.duration < block.timestamp) {
        setClaim(true);
        setLock(true);
      }
    }
    setAuction(auc);
=======
      image: `http://127.0.0.1:8080/ipfs/${meta.data.NFTHash}`,
      name: meta.data.name,
      description: meta.data.description,
    };

    if (isSeller(auctionNFT.seller)) {
      setLock(true);
    }

    const getBlockchainTime = async () => {
      const block = await provider.getBlockNumber();
      const received = await provider.getBlock(block);
      return received.timestamp;
    };
    const time = await getBlockchainTime();
    const auctionPeriod = auctionNFT.startAt + auctionNFT.duration;

    // console.log(time);

    if (auctionNFT.startAt !== 0) {
      if (auctionPeriod < time) {
        const address = ethers.utils.getAddress(Account.toString());
        if (auctionNFT.maxBidder === address) {
          setClaim(true);
        }
        setLock(true);
      } else {
        setCountdownTime(auctionPeriod - time);
      }
    }
    setAuction(auctionNFT);
>>>>>>> Front-End
    setLoadingState("loaded");
  }

  async function placeBid() {
    const { price } = priceInput;
    if (!price) {
      return;
    }
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(auction, AUCTION.abi, signer);
    const amount = ethers.utils.parseUnits(price, "ether");
    const transaction = await contract.BidAuction(id, {
      value: amount,
    });
    await transaction.wait();
    history.push("/Market");
    changeState();
  }

  async function claimNFT() {
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(asset, ASSET.abi, signer);
    const transaction = await contract.Claim(id);
    const tx = await transaction.wait();
    history.push("/Market");
    changeState();
  }

  if (loadingState === "loaded")
    return (
      <div>
        <GoBack change={changeState} url="/Market" />
<<<<<<< HEAD
        <div className="flex pt-36 pl-32 pr-32 pb-14 min-h-screen justify-center">
          <div className="w-full flex justify-center border h-max p-4">
            <img src={placeHolder} alt="PlaceHolder"></img>
          </div>
          <div className="p-4 w-full border">
            <div className="flex w-full h-full flex-col border items-center ">
              <div className="pb-5 pt-5 text-2xl border">Asset Name</div>
              <div className="self-start pl-5 mb-4 border">
                Token ID- {onAuction.tokenId}
              </div>
              <div className="self-start pl-5 w-full h-1/5 border">
                Asset description
              </div>
              {!isSeller(onAuction.seller) ? (
                <div className="p-2 w-full border">
                  Seller- {onAuction.seller}
                </div>
              ) : null}
              {onAuction.startAt === 0 ? (
                <div className="p-2 w-full border">
                  Reserve Price- {onAuction.reservePrice}
                </div>
              ) : (
                <>
                  <div className="p-2 w-full border">
                    maxBidder- {onAuction.maxBidder}
                  </div>
                  <div className="p-2 w-full border">
                    Current Price- {onAuction.maxBidPrice}
                  </div>
                  <div className="w-full border">
                    Duration- Left Timer will be here
                  </div>
                </>
              )}
              <div>
=======
        <div className="flex pt-36 pl-32 pr-32 pb-14 h-screen justify-center">
          <div className="w-full flex justify-center h-max p-4 border-r-2">
            <img src={NFTonAuction.image} alt="PlaceHolder"></img>
          </div>
          <div className="p-4 w-full cursor-default">
            <div className="flex w-full h-full flex-col font-semibold">
              <div className="flex border-b-2">
                <div className="text-5xl font-Hanseif pb-1 mr-5">
                  #{NFTonAuction.tokenId}
                </div>
                <div className="text-5xl font-Hanseif pb-1 flex-1">
                  {NFTonAuction.name}
                </div>
              </div>
              <div className="p-2">"{NFTonAuction.description}"</div>
              <div className="p-2">
                <div>Owner</div>
                <div className="pl-4">{NFTonAuction.seller}</div>
              </div>
              {!isSeller(NFTonAuction.seller) ? (
                <div className="p-2">Seller- {NFTonAuction.seller}</div>
              ) : null}
              {NFTonAuction.startAt === 0 ? (
                <div className="p-2">
                  Reserve Price- {NFTonAuction.reservePrice} ETH
                </div>
              ) : (
                <>
                  <div className="p-2">Bidder- {NFTonAuction.maxBidder}</div>
                  <div className="p-2">
                    Current Price- {NFTonAuction.maxBidPrice} ETH
                  </div>
                  <div className="p-2">
                    Time Left-
                    <Countdown
                      date={Date.now() + countdownTime * 1000}
                      className="font-bold"
                    />
                  </div>
                </>
              )}
              <div className="mt-auto">
>>>>>>> Front-End
                {lock ? null : (
                  <div className="flex">
                    <input
                      placeholder="Price"
                      className="mt-2 border rounded p-4"
                      onChange={(e) =>
                        updatePriceInput({
                          ...priceInput,
                          price: e.target.value,
                        })
                      }
                    />

                    <button
                      className="flex items-center justify-center p-4 m-2 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none"
                      onClick={placeBid}
                    >
                      Place Bid
                    </button>
                  </div>
                )}
                {claim ? <button onClick={claimNFT}>Claim NFT</button> : null}
              </div>
            </div>
          </div>
        </div>
      </div>
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

export default NFTViewMarketPlace;
