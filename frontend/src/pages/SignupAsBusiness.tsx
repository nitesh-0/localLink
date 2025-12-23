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


function SignupAsBusiness(){
    const [businessName, setBusinessName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [location, setLocation] = useState("")
    const [category, setCategory] = useState("")

    const setBusName = useSetRecoilState(busName)
    const setImageUrl = useSetRecoilState(imageUrl)

    const navigate = useNavigate()

    async function handleSignupClick() {
        const formData = new FormData();
        formData.append("businessName", businessName);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("location", location);
        formData.append("category", category)
        formData.append("role", "BUSINESS");

        // Append the file if selected
        const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]');
        if (fileInput?.files?.[0]) {
            formData.append("image", fileInput.files[0]);
        }

        try {
            const response = await axios.post("https://locallink-lg2y.onrender.com/api/v1/user/create", formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                }
            );

            console.log(response.data)

            setBusName(response.data.newUser.businessName)
            setImageUrl(response.data.newUser.imageUrl)
            console.log(response.data.newUser.businessName)
            console.log(response.data.newUser.imageUrl)

            localStorage.setItem("token", response.data.token);
            localStorage.setItem("userId", response.data.newUser.id);
            localStorage.setItem("userRole", response.data.newUser.role);

            navigate("/verify-pending");
        } catch (err: any) {
            console.error("Signup failed:", err.response?.data || err.message);
        }
    }


    return <div className="flex justify-center">
        <div className="min-h-screen w-80 flex flex-col justify-center ">
            <div className="mb-4">
                <AuthHeader header="Sign Up As Business" subheader="Enter Details to Sign Up as Business" />
            </div>
            <div className="flex flex-col gap-2">
                <div>
                    <InputBox onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setBusinessName(e.target.value)
                    }} label="Business Name" placeholder="Galaxy Foot Wear"/>
                </div> 
                <div>
                    <InputBox onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setEmail(e.target.value)
                    }} label="Email" placeholder="galaxyfoot123@gmail.com"/>
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
                    <InputBox onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setCategory(e.target.value)
                    }} label="Category" placeholder="restaurant or grocery"/>
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

export default SignupAsBusiness;