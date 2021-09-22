import React, { useState, useContext } from "react";
import { ethers } from "ethers";
import { MetamaskProvider } from "../../App";
import ASSET from "../../artifacts/contracts/DexAuction.sol/DeXAuction.json";
import { useHistory } from "react-router";
import { GoBack } from "../../Components/Buttons/GoBack";

require("dotenv");
const asset = process.env.REACT_APP_DEX_AUCTION;

const Mint = (props) => {
  let history = useHistory();

  const changeStatus = () => {
    props.status();
  };

  const [assetInput, updateAssetInput] = useState({
    name: "",
    description: "",
  });

  const provider = useContext(MetamaskProvider);

  async function MintAsset(url) {
    const signer = provider.getSigner();

    /* next, create the item */
    let contract = new ethers.Contract(asset, ASSET.abi, signer);
    let transaction = await contract.Mint(url);
    let tx = await transaction.wait();
    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();
  }

  async function createAsset() {
    const { name, description } = assetInput;
    if (!name || !description) return;

    /* first, upload to IPFS */
    const data = JSON.stringify({
      name,
      description,
    });
    await MintAsset("Test");
    changeStatus();
    history.push("/MyAssets");
  }

  return (
    <div className=" pt-32 min-w-full">
      <GoBack url="/MyAssets" change={changeStatus}/>
      <div className=" w-1/2 mx-auto pt-20 flex flex-col justify-center pb-12">
        <input
          placeholder="Asset Name"
          className="mt-8 border rounded p-4"
          onChange={(e) =>
            updateAssetInput({ ...assetInput, name: e.target.value })
          }
        />
        <textarea
          placeholder="Asset Description"
          className="mt-2 border rounded p-4 resize-none h-52 overflow-y-auto"
          onChange={(e) =>
            updateAssetInput({ ...assetInput, description: e.target.value })
          }
        />
        <button
          onClick={createAsset}
          className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
        >
          Create Digital Asset
        </button>
      </div>
    </div>
  );
};

export default Mint;
