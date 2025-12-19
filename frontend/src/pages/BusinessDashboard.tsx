import AppBar from "../components/AppBar";
import BusinessProductCard from "../components/BusinessProductCard";
import emptySvg from "../assets/undraw_publish-post_7g2z.png";
import { useEffect, useState } from "react";
import axios from "axios";

interface Product {
  id: string;
  name: string;
  price: number;
  caption: string;
  isAvailable: boolean;
  imageUrl: string[];
}

function BusinessDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.get("http://localhost:3000/api/v1/listing/mylistings", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setProducts(res.data.mylistings || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) {
    return <div className="text-center mt-32">Loading...</div>;
  }

  return (
    <div>
      <AppBar />
      <div className="pt-24 px-10">
        {products.length > 0 ? (
          <BusinessProductCard products={products} setProducts={setProducts} />
        ) : (
          <div className="flex flex-col gap-2 items-center justify-center mt-[80px] text-center">
            <img
              src={emptySvg}
              alt="No products"
              className="h-[195px] w-[195px] opacity-80"
            />
            <h2 className="text-2xl font-semibold mt-6 text-gray-700">
              No products yet
            </h2>
            <p className="text-gray-500 mt-2 max-w-md">
              Once you post a product, it will appear right here on your screen.
              Start by adding your first product below.
            </p>
            <button
              onClick={() => (window.location.href = "/new-product")}
              className="mt-6 px-5 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition"
            >
              + Add Your First Product
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BusinessDashboard;
