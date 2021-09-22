import React from "react";
import { Link } from "react-router-dom";
// import { useHistory } from "react-router";

export const MintButton = () => {
  // const history = useHistory();

  return (
    <div className=" p-4">
      <Link to="/MyAssets/Mint">
        <button className="flex items-center p-4  transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none">
          Mint an Asset
        </button>
      </Link>
    </div>
  );
};
// onClick={()=>history.push("/MyAssets/Mint")}
