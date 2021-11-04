import React from "react";
<<<<<<< HEAD
import placeHolder from "../../img/PlaceHolder.svg";
=======
>>>>>>> Front-End

function ViewCard(props) {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-lg ml-auto mr-auto h-96 w-64 shadow-lg transform transition duration-500 hover:scale-110 hover:shadow-xl">
<<<<<<< HEAD
      <div className="h-4/5">
        <div className="absolute -top-5">
          <img src={placeHolder} alt="PlaceHolder"></img>
        </div>
      </div>
      <div className="z-20 h-1/5 bg-white">
        <div className="flex flex-col h-full w-full justify-center">
          <div className="p-2">ID- {props.tokenId}</div>
          <div className="p-2 pt-0">Asset Name</div>
=======
      <div className="h-full">
        <div className="absolute h-full">
          <img src={props.image} alt="NFTimage" className="object-cover min-h-full"></img>
        </div>
      </div>
      <div className="z-20 absolute top-0 h-full w-full bg-white opacity-0 transition-opacity duration-500 hover:opacity-50">
        <div className="flex flex-col h-full w-full justify-center items-center">
          <div className="flex-1 p-4 text-5xl font-Hanseif place-self-start">{props.tokenId}.</div>
          <div className="p-2 mb-10 text-4xl font-Hanseif"> {props.name}</div>
>>>>>>> Front-End
        </div>
      </div>
    </div>
  );
}

export default ViewCard;
