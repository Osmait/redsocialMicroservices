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
  const reset = useNotification((state) => state.reset);

  useEffect(() => {
    const newSocket = new WebSocket(
      "ws://localhost:8083/ws/ec5707f4-32bc-48ce-a3bb-d1a3d3f674d2"
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
      <Link href={"/notifications"} onClick={() => reset()}>
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
