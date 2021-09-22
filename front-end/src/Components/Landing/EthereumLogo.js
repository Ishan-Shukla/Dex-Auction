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
