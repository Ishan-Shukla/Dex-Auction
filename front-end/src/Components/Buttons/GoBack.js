import React from "react";
import { useHistory } from "react-router";

export const GoBack = (props) => {
  const history = useHistory();

  const isEmpty = (obj) => {
    return Object.keys(obj).length === 1;
  };
  const work = () => {
    
    history.push(props.url)
    if (!isEmpty(props)) {
      props.change();
    }
    
  };
  return (
    <div className="fixed left-8 top-40">
      <button
        onClick={work}
        className="flex items-center p-4  transition ease-in duration-200 uppercase rounded-full hover:bg-gray-800 hover:text-white border-2 border-gray-900 focus:outline-none"
      >
        Back
      </button>
    </div>
  );
};
