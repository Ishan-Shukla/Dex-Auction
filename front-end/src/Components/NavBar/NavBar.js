import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const [status, setStatus] = useState(0);
  const location = useLocation();
  useEffect(()=>{
    const path = location.pathname;
    if (path.includes("/MyAssets")) {
      console.log("This is Path");
    }else if (path.includes("/Market")) {
      console.log("This is Market");
    }else if (path.includes("/NFT")) {
      console.log("This is NFT");
    }
  },[location])
  console.log(location.pathname);
  return (
    <div className="fixed flex z-50 text-xl top-1/2 transform -rotate-90 -right-24 ">
      <div>
        <Link to="/MyAssets" className="flex-grow p-4">
          My Assets
        </Link>
      </div>
      <div>
        <Link to="/Market" className="flex-grow p-4">
          MarketPlace
        </Link>
      </div>
    </div>
  );
}
