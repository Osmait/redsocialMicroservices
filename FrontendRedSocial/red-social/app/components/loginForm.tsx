"use client";
import { Button, Input } from "@nextui-org/react";
import React, { useRef, useState } from "react";
import { EyeSlashFilledIcon } from "./eyeSlashFilledIcon";
import { EyeFilledIcon } from "./eyesFilledIcon";
import { useRouter } from "next/router";
import { loginService } from "../services/AuthService";

export const LoginForm = () => {
  const [isVisible, setIsVisible] = useState(false);
  const loginFrom = useRef<HTMLFormElement>(null);
  //   const router = useRouter();

  const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!loginFrom.current) {
      return;
    }

    const formData = new FormData(loginFrom.current);

    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };
    console.log(data);
    await loginService(data);

    const token = localStorage.getItem("x-token");
    if (!token) {
      throw Error("Login err");
    }
    loginFrom.current.reset();
    // router.push("/");
  };

  const toggleVisibility = () => setIsVisible(!isVisible);
  return (
    <form ref={loginFrom} onSubmit={handlerSubmit}>
      <div className="flex flex-col gap-2">
        <Input
          name="email"
          isRequired
          variant="bordered"
          type="email"
          label="Email"
          placeholder="junior@nextui.org"
          className="max-w-xs"
        />
        <Input
          name="password"
          isRequired
          label="Password"
          variant="bordered"
          placeholder="Enter your password"
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
          className="max-w-xs"
        />
        <Button type="submit" className="max-w-xs">
          Login
        </Button>
      </div>
    </form>
  );
};
