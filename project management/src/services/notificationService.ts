import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { io, Socket } from "socket.io-client";
import { RootState } from "@/redux/store";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { useToast } from "@/components/hooks/use-toast";

export const useNotificationService = () => {
  const notificationSocketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);
  const { userInfo } = useSelector((state: RootState) => state.Auth);

 const {toast }=useToast()
    if (!userInfo?._id) return;


    notificationSocketRef.current = io("http://localhost:3004", {
      transports: ["websocket"],
      query: { userId: userInfo._id },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 10000,
    });


    const socket = notificationSocketRef.current;
    socket.on("connect", () => console.log("Socket connected"));
    socket.on("disconnect", () => console.log("Socket disconnected"));
    socket.on("error", (error) => console.error("Socket error:", error));
    socket.on("new_employee", (data) => {
      console.log("New employee:", data); 
      toast({
        title: "New employee joined",
        description:"***",
        variant:'success',
      });
    });
    socket.on("new_task", (data) => {
      console.log("New task:", data); 
      toast({
        title: "New Task assigned",
        description:data.title,
        variant:'success',
      });
    });

    return () => {
      if (notificationSocketRef.current) {
        socket.off("connect");
        socket.off("disconnect");
        socket.off("error");
        socket.off("new_employee");
        socket.disconnect();
      }
    };
 


};
