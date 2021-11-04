import React from "react";
import { useHistory } from "react-router";

export const GoBack = (props) => {
  const history = useHistory();

<<<<<<< HEAD
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
=======
  const isThereAnyPropsToChange = (obj) => {
    return Object.keys(obj).length !== 1;
  };

  const back = () => {
    history.push(props.url);
    if (isThereAnyPropsToChange(props)) {
      props.change();
    }
  };

  return (
    <div className="fixed left-8 top-40">
      <svg
        viewBox="0 0 32 32"
        aria-hidden="true"
        onClick={back}
        className="h-20 w-20 transform scale-90 transition ease-in duration-200 hover:scale-75 focus:outline-none"
      >
        <path d="M14.19 16.005l7.869 7.868-2.129 2.129-9.996-9.997L19.937 6.002l2.127 2.129z" />
      </svg>
>>>>>>> Front-End
    </div>
  );
};
