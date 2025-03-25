/* eslint-disable react/prop-types */
import { Bell, ChevronDown } from "@phosphor-icons/react";

export default function Navbar({ module, subSection }) {
  return (
    <nav className="bg-white shadow-md h-16 flex items-center justify-between px-4">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold">{module}</h1>
        <ChevronDown className="w-5 h-5 ml-2" />
        <span className="ml-2 text-gray-600">{subSection}</span>
      </div>
      <div className="flex items-center">
        <button className="mr-4 relative">
          <Bell className="w-6 h-6" />
          <span className="absolute top-0 right-0 bg-red-500 rounded-full w-2 h-2" />
        </button>
        <img
          src="/placeholder.svg?height=32&width=32"
          alt="User"
          className="w-8 h-8 rounded-full"
        />
      </div>
    </nav>
  );
}

// import React from 'react';

// const Navbar = ({ selectedSection }) => {
//   return (
//     <nav className="bg-white shadow px-4 py-2">
//       <ol className="flex items-center space-x-2">
//         <li>Home</li>
//         <li>{'>'}</li>
//         <li>{selectedSection}</li>
//       </ol>
//     </nav>
//   );
// };

// export default Navbar;
