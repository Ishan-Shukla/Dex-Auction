import React, {useContext} from "react";
import { Link } from "react-router-dom";
import { UserAccount } from "../../App";

export const New = (props) => {
  const Account = useContext(UserAccount);
  const change = (i) => {
      props.status(i);
  }
  return (
    <div className="flex flex-col pt-28 justify-center">
      <p className="text-5xl font-semibold pb-12 self-center">
        Mint Your First Asset
      </p>
      <div className="self-center">
        <Link to="/MyAssets/Mint">
          <button onClick={change} className="px-6 py-2 mr-4 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none">
            Mint
          </button>
        </Link>
      </div>
    </div>
  );
};
