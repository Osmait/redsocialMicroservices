"use client";
import { Badge, Button } from "@nextui-org/react";
import { IconBellFilled } from "@tabler/icons-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useNotification } from "../store/state";

export const Notification = () => {
  const notifications = useNotification((state) => state.messages);
  const setMessage = useNotification((state) => state.setMessages);
  const notificationLen = useNotification((state) => state.notificationLen);
  const setNotificationLen = useNotification(
    (state) => state.setNotificationLen
  );

  useEffect(() => {
    const newSocket = new WebSocket(
      "ws://localhost:8083/ws/a5698235-a37b-4c70-ac46-a234f359ada0"
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
  // setNotificationLen(notifications.length);

  return (
    <div className=" flex  gap-3">
      <Badge
        content={notifications.length > 0 ? notifications.length : ""}
        shape="circle"
        color="danger"
      >
        <Button
          radius="full"
          isIconOnly
          aria-label="more than 99 notifications"
          variant="light"
        >
          <IconBellFilled size={24} />
        </Button>
      </Badge>
      <Link href={"/notifications"}>Notificaciones</Link>
    </div>
  );
};
