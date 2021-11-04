import React from "react";
<<<<<<< HEAD
import { BrowserRouter as Router, Route} from "react-router-dom";
import Content from "../Components/Landing/Content";
import { NFTsView } from "./HomeView/NFTViewHome";
import { NFTHome } from "./HomeView/NFTHome";

const Home = () => {

  return (
    <Router>
      <Route exact path="/">
        <div className="bg-Subtle-Background shadow-bar z-0 bg-cover bg-center min-h-screen">
          <Content />
        </div>
        <div className="min-h-screen">
          <NFTHome />
        </div>
      </Route>
      <Route path="/NFT/:id">
        <NFTsView />
=======
import { BrowserRouter as Router, Route } from "react-router-dom";
import Content from "../Components/Landing/Content";
import { NFTViewHome } from "./HomeView/NFTViewHome";
import { NFTHome } from "./HomeView/NFTHome";
import TopBar from "../Components/Header/TopBar";
import TestWorking from "../Components/practice/TestWorking";

const Home = () => {
  return (
    <Router>
      <Route exact path="/">
        <TopBar /> {/* Top Frosted Glass bar with DexAuction Logo */}
        {/* <div className="bg-Turquoise-Blurred bg-fixed bg-cover"> */}
        <div className="bg-Subtle-Background shadow-bar bg-cover bg-center min-h-screen">
          <Content /> {/* Starting screen Content */}
        </div>
        <div>
          <NFTHome /> {/* NFTs Card view */}
        </div>
        {/* </div> */}
      </Route>
      <Route path="/NFT/:id">
        <NFTViewHome /> {/* Particular NFT's details */}
>>>>>>> Front-End
      </Route>
    </Router>
  );
};

export default Home;
