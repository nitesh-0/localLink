import { useState } from "react";
import axios from "axios";

function SearchFilter({setProducts} : {setProducts: any}) {
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState("");

    const handleSearch = async (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        const response = await axios.get("hhttps://locallink-lg2y.onrender.com/api/v1/listing/bulk", {
        params: { category, location },
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
        });

        setProducts(response.data.filteredProducts)
        
    };

    return (
        <form onSubmit={handleSearch} className="flex max-w-lg mx-auto ">
            <input
                type="text"
                placeholder="Enter Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-1/2 p-2 border"
            />
            <input type="text" placeholder="Enter Location" value={location} onChange={(e) => setLocation(e.target.value)}
                className="w-1/2 p-2 border"
            />
            <button type="submit" className="bg-black text-white px-4 py-2 rounded-r-md hover:bg-black-700">Search</button>
        </form>
    );
}

export default SearchFilter;
