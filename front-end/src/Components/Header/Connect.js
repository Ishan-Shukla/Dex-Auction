import React, { useState } from "react";

function Connect(props) {
  const [connect ,setState] = useState(false);
  const ConnectToEthereum = () => {
    props.ConnectMe();
    if (connect) {
      setState(false);
    } else {
      setState(true);
    }
  }
  return (
    <button onClick={ConnectToEthereum} className=" px-6 py-2 mr-4 transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none">
      {connect ? 'Disconnect' : 'Connect'}
    </button>
  );
}

export default Connect;

//  