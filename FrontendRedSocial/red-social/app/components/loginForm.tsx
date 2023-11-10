"use client";
import { Button, Input, Spinner } from "@nextui-org/react";
import React, { useRef, useState } from "react";
import { EyeSlashFilledIcon } from "./eyeSlashFilledIcon";
import { EyeFilledIcon } from "./eyesFilledIcon";

import { loginService } from "../services/AuthService";
import { useRouter } from "next/navigation";
import { useNotification } from "../store/state";
import Cookies from "js-cookie";
import { findAuthProfile } from "../services/userService";

export const LoginForm = () => {
  const [isVisible, setIsVisible] = useState(false);
  const loginFrom = useRef<HTMLFormElement>(null);
  const router = useRouter();
  const setUser = useNotification((state) => state.setUser);
  const [loading, setLoading] = useState(false);

  const handlerSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    if (!loginFrom.current) {
      return;
    }

    const formData = new FormData(loginFrom.current);

    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };
    await loginService(data);
    const token = Cookies.get("x-token");

    if (!token) {
      throw Error("Login err");
    }
    try {
      const user = await findAuthProfile(token);
      setUser(user);
    } catch (error) {
      throw new Error("login Error ");
    }

    router.push("/home");
    loginFrom.current.reset();
    setLoading(false);
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
        {loading ? (
          <Spinner />
        ) : (
          <Button type="submit" className="max-w-xs">
            Login
          </Button>
        )}
      </div>
    </form>
  );
};
