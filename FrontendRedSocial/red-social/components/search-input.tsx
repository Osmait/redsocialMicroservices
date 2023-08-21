"use client";
import React from "react";

const SearchInput = () => {
  return (
    <div className="flex items-center  bg-zinc-900 rounded-full p-2 focus-within:ring-2 focus-within:ring-blue-700 focus-within:bg-black">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 text-gray-500 mr-2 transition-colors duration-300 ease-in-out focus-within:text-blue-500 "
        width="24"
        height="24"
        viewBox="0 0 24 24"
        stroke-width="2"
        stroke="currentColor"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
        <path d="M21 21l-6 -6"></path>
      </svg>
      <input
        type="text"
        className="w-full bg-transparent focus:outline-none "
        placeholder="Buscar en Twitter"
      />
    </div>
  );
};

export default SearchInput;
