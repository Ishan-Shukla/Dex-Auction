import React from "react";
import Logo from "./Logo";

function TopBar(props) {
  // const account = props.ConnectMe;
  return (
<<<<<<< HEAD
    <div className="fixed top-0 w-full z-30">
      <div className="bg-blue-200 bg-opacity-20 backdrop-filter shadow-bar backdrop-blur-md backdrop-brightness-95">
          <div className=" p-6 pl-4">
            <Logo />
=======
    <div className="fixed top-0 w-screen z-30">
      <div className="bg-blue-200 bg-opacity-20 backdrop-filter shadow-bar backdrop-blur-md backdrop-brightness-95">
          <div className="flex p-6 pl-4">
            <Logo />
            <div className="flex-1"></div>
>>>>>>> Front-End
          </div>
      </div>
    </div>
  );
}

export default TopBar;
