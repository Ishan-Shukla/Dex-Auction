import React from "react";
import placeHolder from "../../img/PlaceHolder.svg";

function ViewCard(props) {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-lg ml-auto mr-auto h-96 w-64 shadow-lg transform transition duration-500 hover:scale-110 hover:shadow-xl">
      <div className="h-4/5">
        <div className="absolute -top-5">
          <img src={placeHolder} alt="PlaceHolder"></img>
        </div>
      </div>
      <div className="z-20 h-1/5 bg-white">
        <div className="flex flex-col h-full w-full justify-center">
          <div className="p-2">ID- {props.tokenId}</div>
          <div className="p-2 pt-0">Asset Name</div>
        </div>
      </div>
    </div>
  );
}

export default ViewCard;
