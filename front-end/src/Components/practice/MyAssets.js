import React, { useState } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import TopBar from "../Components/Header/TopBar";
import Navbar from "../Components/NavBar/NavBar";
import ASSET from "../artifacts/contracts/DexAuction.sol/DeXAuction.json";
import AUCTION from "../artifacts/contracts/Auction/AuctionBase.sol/AuctionBase.json";
require("dotenv");
const asset = process.env.REACT_APP_DEX_AUCTION;
const auction = process.env.REACT_APP_AUCTION_BASE;

function MyAssets() {
  const [assetInput, updateAssetInput] = useState({
    name: "",
    description: "",
  });
  const [auctionInput, updateAuctionInput] = useState({
    tokenId: "",
    price: "",
    duration: "",
  });

  const [connected, setStatus] = useState(false);
  const [provider, setProvider] = useState();
  const [Account, setAccount] = useState();
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  // useEffect(() => {
  //   Connect()
  //   loadNFTs()
  // }, [])
  const requestAccount = async () =>
    await window.ethereum.request({ method: "eth_requestAccounts" });
  const web3modal = new Web3Modal({ cacheProvider: true });

  let web3;
  //   let provider;

  async function createAsset() {
    const { name, description } = assetInput;
    if (!name || !description) return;
    /* first, upload to IPFS */
    const data = JSON.stringify({
      name,
      description,
    });
    console.log(data);
    MintAsset("Test URL");
  };

  async function createAuction() {
    const { tokenId , price , duration  } = auctionInput;
    if (!tokenId || !price || !duration) return;
    const signer = provider.getSigner();

    let contract = new ethers.Contract(asset, ASSET.abi, signer);
    let transaction = await contract.Approve(tokenId);
    let tx = await transaction.wait();
    contract = new ethers.Contract(auction, AUCTION.abi, signer);
    console.log(tx);
    transaction = await contract.CreateAuction(
      tokenId,
      ethers.utils.parseEther(price),
      duration
    );
    tx = await transaction.wait();
    console.log(tx);
  };

  async function MintAsset(url) {
    console.log(provider);
    const signer = provider.getSigner();
    /* next, create the item */
    let contract = new ethers.Contract(asset, ASSET.abi, signer);
    let transaction = await contract.Mint(url);
    let tx = await transaction.wait();
    let event = tx.events[0];
    let value = event.args[2];
    let tokenId = value.toNumber();
    // const price = ethers.utils.parseUnits(formInput.price, "ether");

    console.log(event);
    console.log(value);
    console.log(tokenId);
    // console.log(price);

    // /* then list the item for sale on the marketplace */
    // contract = new ethers.Contract(auction, AUCTION.abi, signer)
    // let listingPrice = await contract.getListingPrice()
    // listingPrice = listingPrice.toString()

    // transaction = await contract.createMarketItem(asset, tokenId, price, { value: listingPrice })
    // await transaction.wait()
  };

  async function loadNFTs() {
    const signer = provider.getSigner();
    const contract = new ethers.Contract(asset, ASSET.abi, signer);
    const data = await contract.getOwnerAssets();
    let assets = await Promise.all(
      data.map(async (i) => {
        const tokenURI = await contract.tokenURI(i.TokenID);
        let asset = {
          tokenId: i.TokenID.toString(),
          owner: i.owner,
          tokenURI,
        };
        return asset;
      })
    );
    console.log(assets);
    setNfts(assets);
    setLoadingState("loaded");
  };

  const Connect = async () => {
    // console.log(window.ethereum);
    // console.log(typeof window.ethereum);
    // console.log(parseInt(window.ethereum.chainId));
    // console.log(window.ethereum.isMetaMask);
    // console.log(web3modal);
    web3 = await web3modal.connect();
    // console.log(web3);
    // provider = new ethers.providers.Web3Provider(web3);
    setProvider(() => new ethers.providers.Web3Provider(web3));
    setAccount(await requestAccount());
    console.log({ web3 });
    // console.log(await (await provider.getNetwork()).chainId);
    // selectedAccount = await window.ethereum.request({
    //   method: "eth_requestAccounts",
    // });
    // console.log(selectedAccount);

    // Subscribe to accounts change
    web3.on("accountsChanged", (accounts) => {
      // console.log(accounts);
      setAccount(accounts[0]);
      console.log(Account);
      // selectedAccount = accounts
    });

    // Subscribe to chainId change
    web3.on("chainChanged", (chainId) => {
      console.log(parseInt(chainId));
    });

    // Subscribe to disconect
    web3.on("disconnect", (err) => {
      console.log(err);
    });
  };

  const Disconnect = async () => {
    const clear = await web3modal.clearCachedProvider();
    console.log(clear);
  };

  const Metamask = async () => {
    if (connected) {
      Disconnect();
      setStatus(false);
    } else {
      Connect();
      setStatus(true);
    }
  };

  return (
    <>
      <TopBar ConnectMe={Metamask} />
      <Navbar />
      <div className="flex mt-36 justify-center">
        <div className="w-1/2 flex flex-col pb-12">
          <h1>{Account}</h1>
          <input
            placeholder="Asset Name"
            className="mt-8 border rounded p-4"
            onChange={(e) =>
              updateAssetInput({ ...assetInput, name: e.target.value })
            }
          />
          <textarea
            placeholder="Asset Description"
            className="mt-2 border rounded p-4"
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
          <button
            onClick={loadNFTs}
            className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
          >
            Load Assets
          </button>
        </div>
      </div>
      <div className="flex justify-center">
        <div className="p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
            {nfts.map((nft) => (
              <div
                key={nft.tokenId}
                className="border shadow rounded-xl overflow-hidden"
              >
                <div className="p-4 bg-black">
                  <p className="text-2xl font-bold text-white">
                    TokenId- {nft.tokenId} <br />
                    Owner-{nft.owner} <br />
                    tokenURI- {nft.tokenURI}{" "}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex mt-36 justify-center">
        <div className="w-1/2 flex flex-col pb-12">
          <input
            placeholder="TokenID"
            className="mt-8 border rounded p-4"
            onChange={(e) =>
              updateAuctionInput({ ...auctionInput, tokenId: e.target.value })
            }
          />
          <input
            placeholder="Price"
            className="mt-8 border rounded p-4"
            onChange={(e) =>
              updateAuctionInput({ ...auctionInput, price: e.target.value })
            }
          />
          <input
            placeholder="Duration"
            className="mt-8 border rounded p-4"
            onChange={(e) =>
              updateAuctionInput({ ...auctionInput, duration: e.target.value })
            }
          />
          
          <button
            onClick={createAuction}
            className="font-bold mt-4 bg-pink-500 text-white rounded p-4 shadow-lg"
          >
            Create Auction
          </button>
        </div>
      </div>
    </>
  );
}

export default MyAssets;


// import React, { useState, useEffect } from "react";
// import Web3Modal from "web3modal";
// import { ethers } from "ethers";
// import TopBar from "../Components/Header/TopBar";
// import Navbar from "../Components/NavBar/NavBar";

// import ASSET from "../artifacts/contracts/DexAuction.sol/DeXAuction.json";
// import AUCTION from "../artifacts/contracts/Auction/AuctionBase.sol/AuctionBase.json";
// require("dotenv");
// const asset = process.env.REACT_APP_DEX_AUCTION;
// const auction = process.env.REACT_APP_AUCTION_BASE;

// function MyAssets() {
//   const [connected, setStatus] = useState(false);
//   // const [provider, setProvider] = useState();
//   // const [Account, setAccount] = useState();
//   const [nfts, setNfts] = useState([]);
//   const [loadingState, setLoadingState] = useState("not-loaded");

//   let provider;
//   let web3;
//   let Account;

//   useEffect(() => {
//     // loadNFTs();
//     Connect().then(loadNFTs);
//   }, []);

//   const web3modal = new Web3Modal({});

//   const requestAccount = async () => {
//     await window.ethereum.request({ method: "eth_requestAccounts" });
//     // console.log(provider);
//   };

//   const Connect = async () => {
//     let web3 = await web3modal.connect();
//     provider = new ethers.providers.Web3Provider(web3);
//     // setProvider(Provider);
//     // setAccount(await requestAccount());
//     Account = await requestAccount();
//     setStatus(true);
//     // Subscribe to accounts change
//     web3.on("accountsChanged", (accounts) => {
//       // console.log(accounts);
//       // setAccount(accounts[0]);
//       Account = accounts[0];
//       console.log(Account);
//       // selectedAccount = accounts
//     });

//     // Subscribe to chainId change
//     web3.on("chainChanged", (chainId) => {
//       console.log(parseInt(chainId));
//       alert("Chain Id Chainged");
//     });

//     // Subscribe to disconect
//     web3.on("disconnect", (err) => {
//       console.log(err);
//       setStatus(false);
//     });
//   };

//   const loadNFTs = async () => {
//     const signer = await provider.getSigner();
//     const contract = new ethers.Contract(asset, ASSET.abi, signer);
//     const data = await contract.getOwnerAssets();
//     let assets = await Promise.all(
//       data.map(async (i) => {
//         const tokenURI = await contract.tokenURI(i.TokenID);
//         let asset = {
//           tokenId: i.TokenID.toString(),
//           owner: i.owner,
//           tokenURI,
//         };
//         return asset;
//       })
//     );
//     console.log(assets);
//     setNfts(assets);
//     setLoadingState("loaded");
//   };

//   return (
//     <>
//       <TopBar ConnectMe={Connect} />
//       <Navbar />
      
//     </>
//   );
// }

// export default MyAssets;

// async function loadNFTs() {
//   const web3Modal = new Web3Modal({
//     network: "mainnet",
//     cacheProvider: true,
//   })
//   const connection = await web3Modal.connect()
//   const provider = new ethers.providers.Web3Provider(connection)
//   const signer = provider.getSigner()

//   const marketContract = new ethers.Contract(nftmarketaddress, Market.abi, signer)
//   const tokenContract = new ethers.Contract(nftaddress, NFT.abi, provider)
//   const data = await marketContract.fetchItemsCreated()

//   const items = await Promise.all(data.map(async i => {
//     const tokenUri = await tokenContract.tokenURI(i.tokenId)
//     const meta = await axios.get(tokenUri)
//     let price = ethers.utils.formatUnits(i.price.toString(), 'ether')
//     let item = {
//       price,
//       tokenId: i.tokenId.toNumber(),
//       seller: i.seller,
//       owner: i.owner,
//       sold: i.sold,
//       image: meta.data.image,
//     }
//     return item
//   }))
//   /* create a filtered array of items that have been sold */
//   const soldItems = items.filter(i => i.sold)
//   setSold(soldItems)
//   setNfts(items)
//   setLoadingState('loaded') 
// }
{/* <h1 className="px-20 py-10 text-3xl">Welcome To Dex Auction</h1> */}