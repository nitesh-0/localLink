import { useLocation, useNavigate } from "react-router-dom";
import shoppingSvg from "../assets/shopping-cart-svgrepo-com.svg";
import { useRecoilValue } from "recoil";
import { imageUrl, notificationMapState } from "../recoil/atoms";
import { useState, useRef, useEffect } from "react";
import SearchFilter from "./SearchFilter";

function AppBar({ setProducts }: { setProducts?: any }) {
  const navigate = useNavigate();
  const location = useLocation();
  const image = useRecoilValue(imageUrl);
  const [showPopup, setShowPopup] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement | null>(null);

  const userRole = localStorage.getItem("userRole");
  const notificationMap = useRecoilValue(notificationMapState);

  const totalUnread = Object.values(notificationMap).reduce(
    (sum, count) => sum + count,
    0
  );

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
    localStorage.removeItem("token");
    navigate("/signin");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white shadow-md">
      <div className="flex justify-between items-center px-4 sm:px-16 py-4">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img src={shoppingSvg} alt="Online shop" className="h-7 w-7" />
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            LocalLink.AI
          </h1>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex items-center gap-4 relative">
          {location.pathname === "/business-dashboard" && (
            <button
              onClick={() => navigate("/new-product")}
              className="px-3 py-2 rounded-md bg-black text-white hover:bg-gray-800 transition"
            >
              Post New Product
            </button>
          )}

          {location.pathname === "/user-dashboard" && (
            <SearchFilter setProducts={setProducts} />
          )}

          {location.pathname.startsWith("/chat") && (
            <button
              onClick={() =>
                userRole === "USER"
                  ? navigate("/user-dashboard")
                  : navigate("/business-dashboard")
              }
              className="px-3 py-2 rounded-md bg-black text-white hover:bg-gray-800 transition"
            >
              Go to Dashboard
            </button>
          )}

          {/* Chat Icon */}
          <button onClick={() => navigate("/chat")} className="relative">
            {totalUnread > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[11px] font-semibold bg-red-600 text-white rounded-full">
                {totalUnread > 9 ? "9+" : totalUnread}
              </span>
            )}
            <svg width="35px" height="35px" viewBox="0 0 24 24">
              <path
                fill="#000"
                d="M12.94 14.41 10.38 11.75 5.45 14.48 10.86 8.74l2.56 2.66 4.93-2.72-5.41 5.73ZM11.9 2C6.43 2 2 6.14 2 11.26c0 2.91 1.43 5.5 3.68 7.2V22l3.38-1.87c.9.25 1.86.38 2.84.38 5.47 0 9.9-4.14 9.9-9.26C21.8 6.14 17.37 2 11.9 2Z"
              />
            </svg>
          </button>

          {/* Profile */}
          <div className="relative" ref={popupRef}>
            <img
              src={image}
              alt="profile"
              className="h-10 w-10 rounded-full cursor-pointer border"
              onClick={() => setShowPopup((pv) => !pv)}
            />
            {showPopup && (
              <div className="absolute right-0 mt-2 w-[100px] bg-black rounded-lg py-2 text-white flex justify-center">
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </nav>

        {/* Hamburger (mobile only) */}
        <button
          className="sm:hidden flex flex-col gap-1"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <span className="w-6 h-0.5 bg-black" />
          <span className="w-6 h-0.5 bg-black" />
          <span className="w-6 h-0.5 bg-black" />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden px-4 pb-4 flex flex-col gap-3 border-t">
          {location.pathname === "/business-dashboard" && (
            <button
              onClick={() => navigate("/new-product")}
              className="px-3 py-2 rounded-md bg-black text-white"
            >
              Post New Product
            </button>
          )}

          {location.pathname === "/user-dashboard" && (
            <SearchFilter setProducts={setProducts} />
          )}

          <button
            onClick={() => navigate("/chat")}
            className="px-3 py-2 rounded-md border"
          >
            Chats {totalUnread > 0 && `(${totalUnread})`}
          </button>

          <button
            onClick={handleLogout}
            className="px-3 py-2 rounded-md bg-black text-white"
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

export default AppBar;
