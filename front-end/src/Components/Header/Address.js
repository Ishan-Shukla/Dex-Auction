import React from 'react'

function Address(props) {
    return (
        <div className=" relative bg-Subtle-Background pt-24 pb-32 shadow-md pl-10">
            {/* <p className=" absolute bottom-12 font-Hanseif text-5xl text-blue-500 text-opacity-60  border-b-2 max-w-max">{props.address}</p> */}
            <p className=" absolute bottom-12 font-Hanseif text-5xl text-gray-500 text-opacity-60 border-b-2 max-w-max">{props.address}</p>
        </div>
    )
}

export default Address
