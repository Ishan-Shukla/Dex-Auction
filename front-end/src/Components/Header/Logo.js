import React from "react";
import { Link } from "react-router-dom";
import logo from "../../img/Logo.svg";

function Logo() {
  return (
    <Link to="/">
      <div className="flex z-50 flex-row">
        <div>
          <img className="ml-6 z-50 h-10 w-auto mix-blend-overlay sm:h-10" src={logo} alt="Logo" />
        </div>
        <div className="ml-4">
          <p className=" leading-none pt-3 font-Hanseif">DeX- <br/>Auction </p>
        </div>
      </div>
    </Link>
  );
}

export default Logo;
