import { Outlet, useNavigate } from "react-router-dom";
import HeaderComponent from "./Header.component";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner"; // Assuming you are using Sonner for notifications
// Adjust the import path according to your project structure

const LayoutComponent = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  // Redirect to login if no user is found
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    let socket: Socket | undefined;

    if (user) {
      socket = io("http://localhost:3000"); // Adjust the URL for your server

      socket.on("connect", () => {
        console.log(`Socket connected: ${socket?.id}`);
        socket?.emit("join", user._id); // Join the user-specific room
      });

      socket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      socket.on("examNotification", (notification: { message: string }) => {
        console.log("Received notification:", notification); // Log the notification
        toast(notification.message); // Display the notification using toast
      });
    }
  }, [user])

  return (
    <div className="dark:bg-gray-900 min-h-screen">
      {user && <HeaderComponent />}{" "}
      {/* Only show the header if user is logged in */}
      <main>
        <Outlet /> {/* Render child routes */}
      </main>
    </div>
  );
};

export default LayoutComponent;
