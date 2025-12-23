import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { notificationMapState } from "./recoil/atoms";
import { connectSocket } from "./socket"

import Landing from "./pages/Landing";
import Signin from "./pages/Signin";
import SignupAsUser from "./pages/SignupAsUser";
import SignupAsBusiness from "./pages/SignupAsBusiness";
import UserDashboard from "./pages/UserDashboard";
import BusinessDashboard from "./pages/BusinessDashboard";
import VerifyPending from "./pages/VerifyPending";
import VerifyPage from "./pages/Verify";
import NewProduct from "./components/NewProduct";
import ChatPage from "./pages/ChatPage";

function AppRoutes() {
  const location = useLocation();
  const setNotificationMap = useSetRecoilState(notificationMapState);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const socket = connectSocket(token);
    if (!socket) return;

    socket.on("new_message", (message: any) => {
        setNotificationMap((prev) => ({
            ...prev,
            [message.conversationId]:
            (prev[message.conversationId] || 0) + 1,
        }));
    });


    return () => {
      socket.off("new_message");
    };
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signup-as-user" element={<SignupAsUser />} />
      <Route path="/signup-as-business" element={<SignupAsBusiness />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/business-dashboard" element={<BusinessDashboard />} />
      <Route path="/verify-pending" element={<VerifyPending />} />
      <Route path="/verify" element={<VerifyPage />} />
      <Route path="/new-product" element={<NewProduct />} />
      <Route path="/new-product/:id" element={<NewProduct />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/chat/:id" element={<ChatPage />} />
    </Routes>
  );
}

export default AppRoutes;
