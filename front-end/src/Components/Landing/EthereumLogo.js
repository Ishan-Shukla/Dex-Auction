<<<<<<< HEAD
import React from 'react'
import ethPlaceholder from "../../img/Ethereum.png";

function EthereumLogo() {
    return (
        <div className="flex-grow">
            <img className=" h-96 w-96 ml-60 mt-28 " src={ethPlaceholder} alt="Logo" />
        </div>
    )
}

export default EthereumLogo
=======
import React from "react";
import ethPlaceholder from "../../img/Ethereum.png";

function EthereumLogo() {
  return (
    <div className="flex-1 flex items-center">
      <div className="p-32">
        <img
          src={ethPlaceholder}
          alt="Logo"
        />
      </div>
    </div>
  );
}

export default EthereumLogo;
>>>>>>> Front-End
