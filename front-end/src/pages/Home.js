import React from "react";
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
      </Route>
    </Router>
  );
};

export default Home;
