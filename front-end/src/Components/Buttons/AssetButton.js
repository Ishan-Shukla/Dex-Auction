import React from "react";
import { Link } from "react-router-dom";

export const AssetButton = () => {
  return (
    <div className=" p-4">
      <Link to="/MyAssets/AssetView">
        <button className="flex items-center p-4  transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none">
          Owned Assets
        </button>
      </Link>
    </div>
  );
};