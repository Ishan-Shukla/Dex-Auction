import React from "react";
import EthereumLogo from "./EthereumLogo";
import Name from "./Name";

function Content() {
  return (
    <div className="relative flex flex-row">
      <Name/>
      <EthereumLogo/>
    </div>
  );
}

export default Content;
