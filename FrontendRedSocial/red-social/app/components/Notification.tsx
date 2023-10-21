"use client";
import { Badge, Button } from "@nextui-org/react";
import { IconBellFilled } from "@tabler/icons-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useNotification } from "../store/state";
import { User } from "@/types";
import Cookies from "js-cookie";

export const Notification = () => {
  const notifications = useNotification((state) => state.messages);
  const setMessage = useNotification((state) => state.setMessages);
  const notificationLen = useNotification((state) => state.notificationLen);
  const setNotificationLen = useNotification(
    (state) => state.setNotificationLen
  );
  const reset = useNotification((state) => state.reset);
  const token = Cookies.get("x-token");
  if (!token) {
    return
  }

  const options = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const [user, setUser] = useState<User>()
  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch("http://127.0.0.1:5000/api/profile", options);
      const user: User = await response.json();
      setUser(user)
    }
    fetchUser()
  }, [])



  useEffect(() => {
    const newSocket = new WebSocket(
      `ws://localhost:8083/ws/${user?.id}`
    );
    newSocket.onopen = () => {
      console.log("Conexión WebSocket abierta");
    };

    newSocket.onmessage = (event) => {
      const ms = JSON.parse(event.data);
      console.log(event.data);
      setMessage(ms);
    };

    newSocket.onerror = (e) => {
      console.log(e);
    };

    return () => {
      newSocket.close();
    };
  });
  setNotificationLen(notifications.length);

  return (
    <div className=" flex  gap-3">
      <Link href={"/home/notifications"} onClick={() => reset()}>
        <Badge
          content={notifications.length > 0 ? notificationLen : ""}
          shape="circle"
          color="danger"
        >
          {/* <Button
          radius="full"
          isIconOnly
          aria-label="more than 99 notifications"
          variant="light"
        > */}
          <IconBellFilled size={24} />
          {/* </Button> */}
        </Badge>
        Notificaciones
      </Link>
    </div>
  );
};
