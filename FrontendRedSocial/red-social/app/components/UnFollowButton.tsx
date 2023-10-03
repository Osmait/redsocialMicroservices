"use client";
import { Button } from "@nextui-org/react";
import React from "react";

export const UnFollowButton = () => {
  return (
    <button className="px-4 py-1 rounded-full font-semibold bg-blue-500 border border-blue-500 text-white hover:bg-red-500 hover:border-red-500 hover:text-white transition duration-300 ease-in-out">
      Deja de Seguir
    </button>
  );
};
