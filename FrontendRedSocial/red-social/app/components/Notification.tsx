"use client";
import { Badge } from "@nextui-org/react";
import { IconBellFilled } from "@tabler/icons-react";
import Link from "next/link";
import React, { useEffect } from "react";
import { useNotification } from "../store/state";


export const Notification = () => {
  const notifications = useNotification((state) => state.messages);
  const setMessage = useNotification((state) => state.setMessages);
  const notificationLen = useNotification((state) => state.notificationLen);
  const setNotificationLen = useNotification(
    (state) => state.setNotificationLen
  );
  const user = useNotification(state => state.user)

  const reset = useNotification((state) => state.reset);

  useEffect(() => {
    const newSocket = new WebSocket(`ws://localhost:8083/ws/${user?.id}`);
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
  }, []);
  setNotificationLen(notifications.length);

  return (
    <div className=" flex  gap-3">
      <Link href={"/home/notifications"} onClick={() => reset()}>
        <Badge
          content={notifications.length > 0 ? notificationLen : ""}
          shape="circle"
          color="danger"
        >
          <IconBellFilled size={24} />
        </Badge>
        Notificaciones
      </Link>
    </div>
  );
};
