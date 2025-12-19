import axios from "axios";
import { useEffect, useState } from "react";


export function useProduct({id} : {id: string}){

    interface Product {
        name: string, 
        caption: string,
        price: number,
        available: boolean,
        imageUrl: string[]
    }

    const[loading, setLoading] = useState(true)
    const [product, setProduct] = useState<Product>()

    useEffect(() => {
        axios.get(`http://localhost:3000/api/v1/listing/me?productId=${id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }).then(res => {
            const result = res.data.me
            setProduct(result)
            setLoading(false)
        })

    }, [])

    return {loading, product}

}