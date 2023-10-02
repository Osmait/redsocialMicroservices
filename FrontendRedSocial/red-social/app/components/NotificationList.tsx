"use client";
import React, { useEffect, useState } from "react";

export const NotificationList = () => {
  const [message, setMessage] = useState({});

  useEffect(() => {
    const newSocket = new WebSocket(
      "ws://localhost:8083/ws/ec5707f4-32bc-48ce-a3bb-d1a3d3f674d2"
    );
    newSocket.onopen = () => {
      console.log("Conexión WebSocket abierta");
    };

    newSocket.onmessage = (event) => {
      const ms = JSON.parse(event.data);
      console.log(event.origin);

      setMessage(ms);
    };

    newSocket.onerror = (e) => {
      console.log(e);
    };

    return () => {
      newSocket.close();
    };
  }, []);
  console.log("hola");
  console.log(message);
  return <div>NotificationList</div>;
};
