import { useEffect, useState } from "react"
import Button from "./Button"
import axios from "axios"


function ProductCard({products, setProducts} : {products: any, setProducts: any}){
    const [isExpanded, setIsexpanded] = useState(false)
    
    
    useEffect(() => {
        axios.get("http://localhost:3000/api/v1/listing/all", 
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}` 
                }
            }
        ).then(res => {
            setProducts(res.data.allProducts)
            console.log("res.data: ", res.data)
            console.log("res.data.allProducts: ", res.data.allProducts)
        })
    }, [])

    console.log("prducts: ", products)


    function handleMapButtonClick(){

    }

    function handleChatButtonClick(){

    }
    
    return <div  className="grid grid-cols-2 pt-[100px] gap-8 mt-8 mb-8 ml-[145px]">
        {products.map((product : any) => {
            const imagesToShow = product.imageUrl.slice(0, 2) 
            const text = product.caption
            const words = text.split(" ")
            const shortText = words.slice(0, 32).join(" ")

            return <div className="min-h-[420px] w-[493px] border-[3px] border-1 border-gray-200 shadow-sm rounded-lg">
                <div className="flex flex-col justify-center">
                    <div className="flex gap-2">
                        {imagesToShow.map((img: any, index : any) => (
                            <img 
                                src={img} 
                                key={index}
                                alt="Product image"
                                className="w-60 h-60 object-cover"
                            />
                        ))}
                    </div>
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="text-xl font-bold ml-2 mt-3">
                                {product.name}
                            </div>
                            <div className="ml-2 mt-2 font-semibold">
                                Rs. {product.price}
                            </div>
                        </div>
                        {!product.available && (
                        <div className="mr-3 mt-2 text-red-800 font-semibold">
                            Currently Unavailable
                        </div>
                        )}
                    </div>
                    
                    <p className=" ml-2 mt-2 cursor-pointer" onClick={() => setIsexpanded(!isExpanded)}>
                        {!isExpanded ?
                            (<div>
                                {shortText}
                                {words.length > 32 && (
                                    <div className=" inline text-slate-600  ml-1">
                                        read more
                                    </div>
                                )}
                            </div>) :
                            (<div>
                                {text}
                            </div>)
                        }
                    </p> 
                    <div className="flex justify-between mt-4 mx-4">
                        <Button onClick={handleMapButtonClick} width="50" content="View Shop on Map"/>
                        <Button onClick={handleChatButtonClick} width="50" content="Talk to Shopkeeper"/>
                    </div>
                </div>
            </div>
            })  
        }  
    </div>
}

export default ProductCard