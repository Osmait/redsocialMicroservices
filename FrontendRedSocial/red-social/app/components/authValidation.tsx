'use client'

import { useEffect } from "react";
import { findAuthProfile } from "../services/userService";
import { useNotification } from "../store/state";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export const AuthValidation = () => {
  const router = useRouter()
  const setUser = useNotification((state) => state.setUser);
  useEffect(() => {
    const check = async () => {
      const token = Cookies.get("x-token");

      if (!token) {
        throw Error("Login err");
      }
      try {
        const user = await findAuthProfile(token)
        setUser(user);

      } catch (e) {
        router.push("/login")
      }
    }
    check()
  }, [])

  return <></>
}
