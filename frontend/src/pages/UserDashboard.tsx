import { useState } from "react";
import AppBar from "../components/AppBar";
import ProductCard from "../components/ProductCard";

interface Product {
    name: string,
    price: number,
    caption: string,
    isAvailable: boolean,
    imageUrl: string[]
}

function UserDashboard(){
   const [products, setProducts] = useState<Product[]>([])

    return <div>
        <div>
            <AppBar setProducts={setProducts} />
        </div>
        <ProductCard products={products} setProducts={setProducts} />
    </div>
}

export default UserDashboard;