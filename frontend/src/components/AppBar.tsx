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

  const userRole = localStorage.getItem("userRole")

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

        {location.pathname === "/chat" && (
          <button
            onClick={() => {
              userRole === "USER" ? navigate("/user-dashboard") : navigate("/business-dashboard")
            }}
            className="px-2 py-2 rounded-md bg-black text-white hover:bg-gray-800 transition">
            Go to Dashboard
          </button>
        )}
        

        <button onClick={() => {
          navigate("/chat")
        }}>
          <svg width="35px" height="35px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g id="brand" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g id="messanger" fill="#000000">
                  <path d="M12.9419305,14.4132711 L10.3816186,11.7534625 L5.45094503,14.4802487 L10.8567589,8.74367787 L13.4170708,11.4034864 L18.3477192,8.67670029 L12.9419305,14.4132711 Z M11.8993321,2 C6.43210743,2 2,6.14444891 2,11.2568612 C2,14.1651845 3.43438829,16.7602069 5.67764614,18.457241 L5.67764614,22 L9.05594606,20.1261138 C9.95655399,20.3782306 10.911016,20.5137223 11.8993321,20.5137223 C17.366582,20.5137223 21.7986642,16.3692734 21.7986642,11.2568612 C21.7986642,6.14444891 17.366582,2 11.8993321,2 L11.8993321,2 Z" id="Shape"></path></g>
            </g>
          </svg>
        </button>

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
