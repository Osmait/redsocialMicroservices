"use client";
import React, { use, useEffect, useRef, useState } from "react";
import { findUser } from "../services/userService";
import { Avatar } from "@nextui-org/react";
import Link from "next/link";

const SearchInput = () => {
  const [name, setName] = useState<string | null>(null);
  const [listUser, setListUser] = useState<any>([]);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const find = async () => {
      if (name != null) {
        const list = await findUser(name);
        setListUser(list);
      }
    };
    find();
  }, [name]);
  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setListUser([]);
      setIsFocused(false);
    }, 300);
  };

  return (
    <div className="relative flex items-center  bg-zinc-900 rounded-full p-2 focus-within:ring-2 focus-within:ring-blue-700 focus-within:bg-black">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 text-gray-500 mr-2 transition-colors duration-300 ease-in-out focus-within:text-blue-500 "
        width="24"
        height="24"
        viewBox="0 0 24 24"
        stroke="currentColor"
        fill="none"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
        <path d="M10 10m-7 0a7 7 0 1 0 14 0a7 7 0 1 0 -14 0"></path>
        <path d="M21 21l-6 -6"></path>
      </svg>
      <input
        type="text"
        className="w-full bg-transparent focus:outline-none "
        placeholder="Buscar en Twitter"
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={(e) => setName(e.target.value)}
      />
      {isFocused && (
        <div className="absolute top-full left-0 mt-2 bg-black rounded-md shadow-sm shadow-zinc-500 w-full">
          {listUser.map((user: any) => (
            <ul
              key={user.id}
              className="flex gap-1 mb-2 justify-start items-center"
            >
              <Avatar
                src={
                  user.img
                    ? user.img
                    : `https://ui-avatars.com/api/?name=${user.name}+${user.lastName}`
                }
              />
              <li>
                <Link href={`/home/profile/${user.id}`}>
                  {user.name} {user.lastName}
                </Link>
              </li>
            </ul>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchInput;
