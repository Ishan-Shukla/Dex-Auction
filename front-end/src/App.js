import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "./App.css";
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import TopBar from "./Components/Header/TopBar";
import Navbar from "./Components/NavBar/NavBar";
import Home from "./pages/Home";
import MyAssets from "./pages/MyAssets";
import MarketPlace from "./pages/MarketPlace";
import { useHistory } from "react-router";


export const MetamaskProvider = React.createContext();
export const UserAccount = React.createContext();

function App() {
  const [Account, setAccount] = useState(0);
  const [provider, setProvider] = useState(0);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const [chainLock, setchainLock] = useState(false);
  const history = useHistory();

  const web3modal = new Web3Modal();
  let web3;
  let selectedAccount = 0;

  useEffect(() => {
    Connect();
  }, [loadingState]);

  const Connect = async () => {
    web3 = await web3modal.connect();
    setProvider(new ethers.providers.Web3Provider(web3));
    selectedAccount = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(() => selectedAccount);
    setLoadingState("loaded");
    console.log("Loaded");

    // Subscribe to accounts change
    web3.on("accountsChanged", (accounts) => {
      console.log(accounts);
      history.replace("/");
      setLoadingState("not-loaded");
    });

    // Subscribe to chainId change
    web3.on("chainChanged", (chainId) => {
      console.log(parseInt(chainId));
      if (parseInt(chainId) !== 1337) {
        if (!chainLock) {
          setchainLock(true);
        }
      } else {
        setchainLock(false);
        history.replace("/");
        setLoadingState("not-loaded");
      }
    });

    // Subscribe to disconect
    web3.on("disconnect", (err) => {
      console.log(err);
    });
  };

  if (loadingState !== "loaded") {
    return <h1>Loading</h1>;
  }
  if (chainLock) {
    return <h1>Connected to wrong Chain</h1>;
  }
  return (
    <Router>
      <MetamaskProvider.Provider value={provider}>
        <div className="App">
          <TopBar />
          <Navbar />
          <div>
            <Switch>
              <Route exact path="/">
                <Home />
              </Route>
              <UserAccount.Provider value={Account}>
                <Route exact path="/Market">
                  <MarketPlace />
                </Route>
                <Route exact path="/MyAssets">
                  <MyAssets />
                </Route>
              </UserAccount.Provider>
            </Switch>
          </div>
        </div>
      </MetamaskProvider.Provider>
    </Router>
  );
}

export default App;
