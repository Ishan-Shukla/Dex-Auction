<<<<<<< HEAD
import React from "react";
import placeHolder from "../../img/PlaceHolder.svg"

export const OnAuctionViewCard = (props) => {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-lg ml-auto mr-auto h-96 w-64 shadow-lg transform transition duration-500 hover:scale-110">
      <div className="h-4/5">
        <div className="absolute -top-5">
          <img src={placeHolder} alt="PlaceHolder"></img>
        </div>
      </div>
      <div className="z-20 h-2/6 bg-white">
        <div className="flex flex-col h-full w-full justify-evenly">
          <div className="pl-2">Asset Name</div>
          <div className="pl-2">Reserve Price-{props.reservePrice}</div>
        </div>
      </div>
=======
import { formatEther } from "@ethersproject/units";
import React, { useEffect, useState } from "react";
import Countdown from "react-countdown";
import { ethers } from "ethers";

export const OnAuctionViewCard = (props) => {
  const [countdownTime, setCountdownTime] = useState(0);
  const [isActive, setAuctionStatus] = useState(0); // 0-inactive 1-active 2-claim
  const Provider = new ethers.providers.JsonRpcProvider();

  const getBlockchainTime = async () => {
    const block = await Provider.getBlockNumber();
    const received = await Provider.getBlock(block);
    return received.timestamp;
  };

  useEffect(() => {
    const calculate = async () => {
      if (props.startAt !== 0) {
        const time = await getBlockchainTime();
        const auctionPeriod = props.startAt + props.duration;
        if (auctionPeriod < time) {
          setAuctionStatus(2);
        } else {
          setAuctionStatus(1);
          setCountdownTime(auctionPeriod - time);
        }
      }
    };
    calculate();
  }, []);

  return (
    <div className="relative flex flex-col overflow-hidden rounded-lg ml-auto mr-auto h-96 w-64 shadow-lg transform transition duration-500 hover:scale-110">
      <div className="h-4/5">
        <div className="absolute h-full">
          <img
            src={props.image}
            alt="NFTimage"
            className="object-cover min-h-full"
          ></img>
        </div>
        <div className="z-20 absolute top-0 h-full w-full bg-white opacity-0 transition-opacity duration-500 hover:opacity-50">
          <div className="flex flex-col h-4/5 w-full justify-center items-center">
            <div className="flex-1 p-4 text-5xl font-Hanseif place-self-start">
              {props.tokenId}.
            </div>
            <div className="p-2 mb-10 text-4xl font-Hanseif"> {props.name}</div>
          </div>
        </div>
      </div>
      <div
        className={`z-20 h-1/5 ${
          isActive === 0 ? "bg-white text-black" : "bg-black text-white"
        }`}
      >
        {isActive === 0 ? (
          <div className="flex flex-col h-full w-full justify-center font-semibold">
            <div className="pl-3 text-sm">Reserve price</div>
            <div className="pl-3 text-lg">
              {formatEther(props.reservePrice)} ETH
            </div>
          </div>
        ) : isActive === 1 ? (
          <div className="flex h-full w-full items-center font-semibold">
            <div className="flex-1">
              <div className="pl-3 text-sm">Current price</div>
              <div className="pl-3 text-lg">
                {formatEther(props.maxBidPrice)} ETH
              </div>
            </div>
            <div className="flex-1 flex flex-col">
              <div className="pr-3 text-sm place-self-end">Ending in</div>
              <div className="pr-3 text-base place-self-end">
                <Countdown
                  date={Date.now() + countdownTime * 1000}
                  key={countdownTime}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full w-full justify-center font-semibold">
            <div className="pl-3 text-sm">Winning price</div>
            <div className="pl-3 text-lg">
              {formatEther(props.maxBidPrice)} ETH
            </div>
          </div>
        )}
      </div>
>>>>>>> Front-End
    </div>
  );
};
export default OnAuctionViewCard;
<<<<<<< HEAD
// <div className="flex flex-col overflow-hidden shadow-lg rounded-lg h-96 h- w-72 mt-8 ml-auto mr-auto cursor-pointer">
//   <div className="border h-4/5">
//     <p>NFT Display Here!</p>
//   </div>
//   <div className="border h-1/5">
//     TokenId- {props.tokenId} <br />
//     {/* Seller-{props.seller} <br /> */}
//     Reserve Price-{props.reservePrice} <br />
//     {/* maxBidPrice-{props.maxBidPrice} <br /> */}
//     {/* maxBidder-{props.maxBidder} <br /> */}
//     {/* duration-{props.duration} <br /> */}
//     {/* startAt-{props.startAt} <br /> */}
//     {/* status-{props.status} <br /> */}
//     {/* tokenURI-{props.tokenURI} <br /> */}
//     {/* index-{props.index} <br /> */}
//   </div>
// </div>
=======
>>>>>>> Front-End
