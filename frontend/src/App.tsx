import { BrowserRouter, Route, Routes } from "react-router-dom"
import Landing from "./pages/Landing"
import Signin from "./pages/Signin"
import SignupAsUser from "./pages/SignupAsUser"
import SignupAsBusiness from "./pages/SignupAsBusiness"
import UserDashboard from "./pages/UserDashboard"
import BusinessDashboard from "./pages/BusinessDashboard"
import VerifyPending from "./pages/VerifyPending"
import VerifyPage from "./pages/Verify"
import NewProduct from "./components/NewProduct"
import ChatPage from "./pages/ChatPage"
import { useEffect } from "react";
// @ts-ignore: no declaration file for './socket'
import { connectSocket } from "./socket";

function App() {

  useEffect(() => {
    const token = localStorage.getItem("token"); // your JWT
    const socket = connectSocket(token);
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing/>} />
        <Route path="/signup-as-user" element={<SignupAsUser/>}/>
        <Route path="/signup-as-business" element={<SignupAsBusiness/>} />
        <Route path="/signin" element={<Signin/>} />
        <Route path="/user-dashboard" element={<UserDashboard/>} />
        <Route path="/business-dashboard" element={<BusinessDashboard/>} />
        <Route path="/verify-pending" element={<VerifyPending/>} />
        <Route path="/verify" element={<VerifyPage/>} />
        <Route path="/new-product" element={<NewProduct/>} />
        <Route path="/new-product/:id" element={<NewProduct/>} />
        <Route path="/chat" element={<ChatPage/>} />
      </Routes>
    </BrowserRouter>

      
  )
}

export default App
