import { useLocation, useNavigate } from "react-router-dom";
import shoppingSvg from "../assets/shopping-cart-svgrepo-com.svg";
import { useRecoilValue } from "recoil";
import { imageUrl } from "../recoil/atoms";
import { useState, useRef, useEffect } from "react";
import SearchFilter from "./SearchFilter";

function AppBar({setProducts} : {setProducts?: any}) {
  const navigate = useNavigate();
  const location = useLocation()
  const image = useRecoilValue(imageUrl);

  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);

  // close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowPopup(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // clear any auth data if needed
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-16 py-5 shadow-md bg-white">
      {/* Logo Section */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}>
        <img src={shoppingSvg} alt="Online shop" className="h-7 w-7" />
        <h1 className="text-2xl font-bold tracking-tight">LocalLink.AI</h1>
      </div>

      {/* Right Side Section */}
      <nav className="flex items-center space-x-4 gap-4 relative">
        {location.pathname === "/business-dashboard" && (
          <button
            onClick={() => navigate("/new-product")}
            className="px-2 py-2 rounded-md bg-black text-white hover:bg-gray-800 transition">
            Post New Product
          </button>
        )}

        {location.pathname === "/user-dashboard" && (
          <SearchFilter setProducts={setProducts} />
        )}
        

        {/* Profile Button */}
        <div className="relative" ref={popupRef}>
          <img src={image} alt="profile" className="h-10 w-10 rounded-full cursor-pointer border" onClick={() => setShowPopup((pv) => !pv)}/>
          {/* Popup Menu */}
          {showPopup && (
            <div className="absolute right--20 mt-2 w-[100px] bg-black border rounded-lg py-2 text-white animate-fade-in flex justify-center">
              <button onClick={handleLogout}> Logout</button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

export default AppBar;
