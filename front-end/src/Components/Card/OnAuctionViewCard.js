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
    </div>
  );
};
export default OnAuctionViewCard;
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
