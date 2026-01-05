import { useState } from "react"
import Button from "./Button"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function BusinessProductCard({ products, setProducts }: { products: any, setProducts: any }) {
  const [expandedCards, setExpandedCards] = useState<{ [id: string]: boolean }>({})
  const navigate = useNavigate()

  function toggleExpand(id: string) {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  async function toggleAvailability(id: string, current: boolean) {
    try {
      await axios.put(
        `https://locallink-lg2y.onrender.com/api/v1/listing/update/basic/${id}`,
        { available: !current },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )

      setProducts((prev: any[]) =>
        prev.map((p) =>
          p.id === id ? { ...p, available: !current } : p
        )
      )
    } catch (err) {
      console.error(err)
    }
  }

  async function handleDelete(id: string) {
    await axios.delete(`http://localhost:3000/api/v1/listing/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    setProducts((prev: any[]) => prev.filter((p) => p.id !== id))
  }

  return (
    <div
      className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        gap-6 
        px-4 
        sm:px-10 
        lg:px-24 
        mt-8 
        mb-8
      "
    >
      {products.map((product: any) => {
        const imagesToShow = product.imageUrl.slice(0, 2)
        const text = product.caption
        const words = text.split(" ")
        const shortText = words.slice(0, 32).join(" ")
        const isExpanded = expandedCards[product.id] || false

        return (
          <div
            key={product.id}
            className="
              min-h-[420px] 
              w-full 
              border-[3px] 
              border-gray-200 
              shadow-sm 
              rounded-lg
            "
          >
            <div className="flex flex-col">
              {/* Images */}
              <div className="flex gap-2 p-2">
                {imagesToShow.map((img: any, index: any) => (
                  <img
                    src={img}
                    key={index}
                    alt="Product image"
                    className="
                      w-1/2 
                      h-48 
                      sm:h-60 
                      object-cover 
                      rounded-md
                    "
                  />
                ))}
              </div>

              {/* Name & Price */}
              <div className="flex justify-between items-start px-2 mt-2">
                <div>
                  <div className="text-lg sm:text-xl font-bold">
                    {product.name}
                  </div>
                  <div className="mt-1 font-semibold">
                    Rs. {product.price}
                  </div>
                </div>

                {!product.available && (
                  <div className="text-red-800 font-semibold text-sm">
                    Currently Unavailable
                  </div>
                )}
              </div>

              {/* Caption */}
              <p
                className="px-2 mt-2 cursor-pointer text-sm sm:text-base"
                onClick={() => toggleExpand(product.id)}
              >
                {!isExpanded ? (
                  <span>
                    {shortText}
                    {words.length > 32 && (
                      <span className="text-slate-600 ml-1">
                        read more
                      </span>
                    )}
                  </span>
                ) : (
                  <span>{text}</span>
                )}
              </p>

              {/* Buttons */}
              <div
                className="
                  flex 
                  flex-col 
                  sm:flex-row 
                  gap-3 
                  mt-4 
                  px-4 
                  pb-4
                "
              >
                <Button
                  onClick={() => navigate(`/new-product/${product.id}`)}
                  width="100"
                  content="Edit"
                />

                <Button
                  onClick={() =>
                    toggleAvailability(product.id, product.available)
                  }
                  width="100"
                  content={
                    product.available
                      ? "Mark As Unavailable"
                      : "Mark As Available"
                  }
                />

                <Button
                  onClick={() => handleDelete(product.id)}
                  width="100"
                  content="Delete"
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default BusinessProductCard
