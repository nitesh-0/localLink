import { useEffect, useState } from "react"
import Button from "./Button"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function ProductCard({ products, setProducts }: { products: any, setProducts: any }) {
  const [isExpanded, setIsexpanded] = useState(false)

  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  useEffect(() => {
    axios.get("https://locallink-lg2y.onrender.com/api/v1/listing/all", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }).then(res => {
      setProducts(res.data.allProducts)
    })
  }, [])

  async function handleChatButtonClick(productId: number) {
    const res = await axios.post(
      "https://locallink-lg2y.onrender.com/api/v1/chat/start",
      { businessId: productId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )

    navigate(`/chat/${res.data.conversation?.id}`)
  }

  return (
    <div className="
      grid 
      grid-cols-1 
      sm:grid-cols-2 
      gap-6 
      pt-[100px] 
      px-4 
      sm:px-10 
      lg:px-24 
      mt-8 
      mb-8
    ">
      {products.map((product: any) => {
        const imagesToShow = product.imageUrl.slice(0, 2)
        const text = product.caption
        const words = text.split(" ")
        const shortText = words.slice(0, 32).join(" ")

        return (
          <div className="
            min-h-[420px] 
            w-full 
            border-[3px] 
            border-gray-200 
            shadow-sm 
            rounded-lg
          ">
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

              {/* Title + Price */}
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

              {/* Description */}
              <p
                className="px-2 mt-2 cursor-pointer text-sm sm:text-base"
                onClick={() => setIsexpanded(!isExpanded)}
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
              <div className="
                flex 
                flex-col 
                sm:flex-row 
                gap-3 
                mt-4 
                px-4 
                pb-4
              ">
                <Button
                  onClick={() => {}}
                  width="100"
                  content="View Shop on Map"
                />
                <Button
                  onClick={() => handleChatButtonClick(product.userId)}
                  width="100"
                  content="Talk to Shopkeeper"
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default ProductCard
