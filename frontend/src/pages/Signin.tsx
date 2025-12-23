import { useState, type ChangeEvent } from "react";
import AuthFooter from "../components/AuthFooter";
import AuthHeader from "../components/AuthHeader";
import Button from "../components/Button";
import InputBox from "../components/InputBox";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { busName, imageUrl } from "../recoil/atoms";


function Signin(){
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const setBusinessName = useSetRecoilState(busName)
     const setImageUrl = useSetRecoilState(imageUrl)

    const navigate = useNavigate()

    async function handleSignupClick() {
        

        try {
            const response = await axios.post("https://locallink-lg2y.onrender.com/api/v1/user/signin", {
                email: email,
                password: password
            }
            );

            setBusinessName(response.data.isValid.businessName)
            setImageUrl(response.data.isValid.imageUrl)
            console.log(response.data.isValid.imageUrl)
            console.log(response.data.isValid.businessName)
            

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userId", response.data.isValid.id);
            localStorage.setItem("userRole", response.data.isValid.role);

            if(response.data.isValid.role == "USER"){
                navigate("/user-dashboard");
            } else {
                navigate("/business-dashboard")
            }
            
        } catch (err: any) {
            console.error("Signup failed:", err.response?.data || err.message);
        }
    }


    return <div className="flex justify-center">
        <div className="min-h-screen w-80 flex flex-col justify-center ">
            <div className="mb-4">
                <AuthHeader header="Sign In" subheader="Enter Details to Sign In" />
            </div>
            <div className="flex flex-col gap-2"> 
                <div>
                    <InputBox onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setEmail(e.target.value)
                    }} label="Email" placeholder="johndoe123@gmail.com"/>
                </div> 
                <div>
                    <InputBox onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setPassword(e.target.value)
                    }} label="Password" placeholder="123456" type="password" />
                </div> 
                
            </div>
            <div className="flex justify-center mt-6">
                <Button onClick={handleSignupClick} content="Sign In" />
            </div>
            <div>
                <AuthFooter content="Don't have an account?" link="Sign Up"/>
            </div>
        </div>
    </div>
}

export default Signin;