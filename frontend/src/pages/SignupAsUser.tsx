import { useState, type ChangeEvent } from "react";
import AuthFooter from "../components/AuthFooter";
import AuthHeader from "../components/AuthHeader";
import Button from "../components/Button";
import ImageUpload from "../components/ImageUpload";
import InputBox from "../components/InputBox";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import { busName, imageUrl } from "../recoil/atoms";


function SignupAsUser(){
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [location, setLocation] = useState("")

    const navigate = useNavigate()
    const setBusName = useSetRecoilState(busName)
    const setImageUrl = useSetRecoilState(imageUrl)


    async function handleSignupClick() {
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("location", location);
        formData.append("role", "USER");

        
        // Append the file if selected
        const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');
        if (fileInput?.files?.[0]) {
            formData.append("image", fileInput.files[0]);
        }

        try {
            const response = await axios.post("http://localhost:3000/api/v1/user/create", formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            setBusName(response.data.newUser.businessName)
            setImageUrl(response.data.newUser.imageUrl)
            
            localStorage.setItem("token", response.data.token);
            navigate("/verify-pending");
        } catch (err: any) {
            console.error("Signup failed:", err.response?.data || err.message);
        }
    }


    return <div className="flex justify-center">
        <div className="min-h-screen w-80 flex flex-col justify-center ">
            <div className="mb-4">
                <AuthHeader header="Sign Up As User" subheader="Enter Details to Sign Up as User" />
            </div>
            <div className="flex flex-col gap-2">
                <div>
                    <InputBox onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setName(e.target.value)
                    }} label="Name" placeholder="John Doe"/>
                </div> 
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
                <div>
                    <InputBox onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setLocation(e.target.value)
                    }} label="Location" placeholder="Imadol"/>
                </div>
                <div>
                    <ImageUpload/>
                </div>
            </div>
            <div className="flex justify-center mt-6">
                <Button onClick={handleSignupClick} content="Sign Up" />
            </div>
            <div>
                <AuthFooter content="Already have an account?" link="Sign In"/>
            </div>
        </div>
    </div>
}

export default SignupAsUser;