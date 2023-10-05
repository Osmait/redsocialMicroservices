"use client";
import { Badge, Button } from "@nextui-org/react";
import { IconBellFilled } from "@tabler/icons-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export const Notification = () => {
  // const [message, setMessage] = useState("");
  // //   const [socket, setSocket] = useState<any>();

  // useEffect(() => {
  //   const newSocket = new WebSocket("ws://localhost:8083/ws/1"); // Cambia la URL por la de tu servidor Go
  //   newSocket.onopen = () => {
  //     console.log("Conexión WebSocket abierta");
  //   };

  //   newSocket.onmessage = (event) => {
  //     console.log(event.data);
  //     const ms = JSON.parse(event.data);
  //     console.log(ms);
  //     setMessage(ms); // Actualizar el estado con el mensaje recibido
  //   };

  //   newSocket.onerror = (e) => {
  //     console.log(e);
  //   };

  //   return () => {
  //     newSocket.close();
  //   };
  // }, []);

  // console.log(message);

  return (
    <div className=" flex  gap-3">
      <Badge content="99+" shape="circle" color="danger">
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
