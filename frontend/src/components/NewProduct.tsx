import { useEffect, useState, type ChangeEvent } from "react"
import AppBar from "./AppBar"
import AuthHeader from "./AuthHeader"
import InputBox from "./InputBox"
import TextArea from "./TextArea"
import Button from "./Button"
import axios from "axios"
import { useNavigate, useParams } from "react-router-dom"
import { useProduct } from "../hooks/product"


function NewProduct(){
    const [name, setName] = useState("")
    const [price, setPrice] = useState(0.0)
    const [caption, setCaption] = useState("")
    const [files, setFiles] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]); // already uploaded


    const navigate  = useNavigate()

    const {id} = useParams() 

    const { product } = useProduct({id : id ?? ""})

    useEffect(() => {
        if (product) {
            setName(product.name);
            setPrice(product.price);
            setCaption(product.caption);
            setExistingImages(product.imageUrl || []); // prefill old images
        }
    }, [product]);

    async function handlePostButtonClick() {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("caption", caption);
    formData.append("price", price.toString());

    // ✅ Always include existing images
    formData.append("existingImages", JSON.stringify(existingImages));

    // ✅ Add new images (from state, not direct DOM query)
    if (files.length > 0) {
        files.forEach(file => formData.append("images", file));
    }

    try {
        if (id) {
            const response = await axios.put(
                `https://locallink-lg2y.onrender.com/api/v1/listing/update/${id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            console.log("update response:", response.data);
        } else {
            const response = await axios.post(
                "https://locallink-lg2y.onrender.com/api/v1/listing/create",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            console.log("post response:", response.data);
        }

        navigate("/business-dashboard");
    } catch (err) {
        console.error(err);
    }
}


    return <div>
        <div>
            <AppBar/>
        </div>
        <div className="flex min-h-[calc(100vh-80px)] pt-[120px] justify-center items-center ">
            <div className="min-h-[500px] w-[370px] border-2 border-gray-300 shadow-lg gap-9 flex justify-center items-center flex-col rounded-xl">
                <div className="w-[315px] flex flex-col gap-5">
                    <div className="mb-1">
                        <AuthHeader subheader="Enter details for new product"/>
                    </div>
                    <div>
                        <InputBox onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setName(e.target.value)
                        }} label="Product Name" value={name} placeholder="Jacket, Cake, cement"/>
                    </div>
                    <div>
                        <TextArea onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                            return setCaption((e.target.value))
                        }} label="Describe your Product" value={caption} placeholder="It's a beautiful warm jacket and confortable for men"/>
                    </div>
                    <div>
                        <InputBox onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            setPrice(parseFloat(e.target.value))
                        }} label="Price" value={price.toString()} placeholder="1000.45"/>
                    </div>
                    <div>
                        <ImageUpload files={files} setFiles={setFiles} existingImages={existingImages} setExistingImages={setExistingImages}/>
                    </div>

                    <div className="mt-3">
                        <Button onClick={handlePostButtonClick} content={ id ? "Update Product" : "Post Product"}/>
                    </div> 
                </div>    
            </div>
        </div>   
    </div>
}


function ImageUpload({
  files,
  setFiles,
  existingImages,
  setExistingImages
}: {
  files: File[];
  setFiles: (f: File[]) => void;
  existingImages: string[];
  setExistingImages: (imgs: string[]) => void;
}) {

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setFiles([...files, ...Array.from(e.target.files)]);
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  return (
    <div>
        <label className="block mb-2 text-sm font-medium">Product Images</label>

        {/* New files */}
        <input type="file" multiple accept="image/*" onChange={handleFileChange}className="block w-full"/>

        <div className="flex flex-wrap gap-2 mt-2">
            {existingImages.map((url, i) => (
            <div key={i} className="relative">
                <img src={url} alt="Existing" className="w-20 h-20 object-cover rounded" />
                <button type="button" onClick={() => removeExistingImage(i)} className="absolute top-0 right-0 text-red-600">
                    X
                </button>
            </div>
            ))}

            {/* New files */}
            {files.map((file, i) => (
            <div key={i} className="relative">
                <img src={URL.createObjectURL(file)} alt={file.name} className="w-20 h-20 object-cover rounded" />
                <button type="button" onClick={() => removeFile(i)} className="absolute top-0 right-0 text-red-600">X</button>
            </div>
            ))}
        </div>
    </div>
  );
}


export default NewProduct