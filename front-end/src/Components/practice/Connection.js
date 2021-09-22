import React from 'react'
import { ethers } from 'ethers';
import Web3Modal from "web3modal";

export default function Connection() {

  const web3modal = new Web3Modal();
  let web3;
  let provider;
  let selectedAccount;
  const windowEthereum = async () => {
    console.log(window.ethereum);
    // console.log(typeof(window.ethereum));
    // console.log(window.ethereum.chainId);
    // console.log(window.ethereum.isMetaMask);
    // console.log(web3modal);
    web3 = await web3modal.connect();
    // console.log(web3); 
    provider = new ethers.providers.Web3Provider(web3);
    console.log(provider);
    console.log(await (await provider.getNetwork()).chainId);
    selectedAccount = await window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log(selectedAccount);
    // Subscribe to accounts change
    web3.on("accountsChanged", (accounts) => {
      console.log(accounts);
      selectedAccount = accounts;
      console.log(selectedAccount);
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
  }
  return (
    <div>
      <button onClick = {windowEthereum}>Connect To ETH</button>
    </div>
  )
}
