import { useState } from "react"
import Button from "./Button"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function BusinessProductCard({products, setProducts} : {products: any, setProducts: any}) {
  const [expandedCards, setExpandedCards] = useState<{ [id: string]: boolean }>({})
  const navigate = useNavigate()

 

  // ✅ toggle caption expansion per card
  function toggleExpand(id: string) {
    setExpandedCards((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  // ✅ update availability in backend & locally
  async function toggleAvailability(id: string, current: boolean) {
    console.log("before click current: ", current)
    try {
      const response = await axios.put(
        `https://locallink-lg2y.onrender.com/api/v1/listing/update/basic/${id}`,
        { available: !current }, // ✅ field name fixed
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      )

      console.log("updated:", response.data.updatedListing.available)

      // ✅ Update local state
      setProducts((prev: any[]) =>
        prev.map((p) =>
          p.id === id ? { ...p, available: !current } : p
        )
      )
    } catch (err) {
      console.error(err)
    }
  }

  // ✅ delete product
  async function handleDelete(id: string) {
    await axios.delete(`http://localhost:3000/api/v1/listing/delete/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    setProducts((prev: any[]) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className="grid grid-cols-2 gap-8 mt-8 mb-8 ml-[145px]">
      {products.map((product: any) => {
        const imagesToShow = product.imageUrl.slice(0, 2)
        const text = product.caption
        const words = text.split(" ")
        const shortText = words.slice(0, 32).join(" ")
        const isExpanded = expandedCards[product.id] || false

        return (
          <div
            key={product.id}
            className="min-h-[420px] w-[493px] border-[3px] border-gray-200 shadow-sm rounded-lg"
          >
            <div className="flex flex-col justify-center">
              {/* Images */}
              <div className="flex gap-2">
                {imagesToShow.map((img: any, index: any) => (
                  <img
                    src={img}
                    key={index}
                    alt="Product image"
                    className="w-60 h-60 object-cover"
                  />
                ))}
              </div>

              {/* Name & Price */}
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

              {/* Caption */}
              <p
                className="ml-2 mt-2 cursor-pointer"
                onClick={() => toggleExpand(product.id)}
              >
                {!isExpanded ? (
                  <div>
                    {shortText}
                    {words.length > 32 && (
                      <span className="inline text-slate-600 ml-1">
                        read more
                      </span>
                    )}
                  </div>
                ) : (
                  <div>{text}</div>
                )}
              </p>

              {/* Buttons */}
              <div className="flex justify-between mt-4 mx-4">
                <Button
                  onClick={() => navigate(`/new-product/${product.id}`)}
                  width="50"
                  content="Edit"
                />

                <Button
                  onClick={() =>
                    toggleAvailability(product.id, product.available)
                  }
                  width="65"
                  content={
                    product.available
                      ? "Mark As Unavailable"
                      : "Mark As Available"
                  }
                />

                <Button
                  onClick={() => handleDelete(product.id)}
                  width="50"
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
