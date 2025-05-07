import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const heroSectionHeight = document.getElementById("hero")?.offsetHeight || 600;
      setIsScrolled(window.scrollY > heroSectionHeight - 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const pagesWithBlueNavbar = ["/features", "/about", "/contact", "/login","*"];
  const isNotFoundPage = location.pathname !== "/" && !pagesWithBlueNavbar.includes(location.pathname);
  const isBlueNavbar = pagesWithBlueNavbar.includes(location.pathname) || isScrolled || isNotFoundPage;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 
        ${isBlueNavbar ? "bg-blue-950 text-white shadow-md" : "bg-transparent text-white"}`}
      >
        <div className="flex justify-between items-center px-6 py-3">
        
          <div className="flex items-center space-x-2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/18747/18747599.png"
              alt="LOGO"
              className="w-10 h-10"
            />
            <div className="text-2xl font-sans font-bold">AttenDo</div>
          </div>

        
          <div className="hidden md:flex space-x-6">
            <ul className="flex space-x-6 mt-6">
              <li>
                <Link to="/" className=" px-4 py-2 rounded-md hover:text-orange-200 font-semibold">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className=" px-4 py-2 rounded-md hover:text-orange-200 font-semibold">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className=" px-4 py-2 rounded-md hover:text-orange-200 font-semibold">
                  Contact Us
                </Link>
              </li>
            </ul>
            <button
              className="border-2 border-white px-4 py-2 my-3 rounded-md hover:text-orange-200 font-semibold"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>

    
          <button className="md:hidden" onClick={() => setIsOpen(true)}>
            <FaBars size={24} />
          </button>
        </div>
      </nav>

      {/* RIGHT SIDEBAR MENU */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-blue-950 text-white transform 
      ${isOpen ? "translate-x-0" : "translate-x-full"} transition-transform duration-300 z-50 shadow-lg`}
      >
        <div className="flex justify-between items-center p-6">
          <button onClick={() => setIsOpen(false)}>
            <FaTimes size={24} />
          </button>
        </div>
        <ul className="flex flex-col space-y-6 p-6">
          <li>
            <Link to="/" className="hover:text-gray-300" onClick={() => setIsOpen(false)}>
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-gray-300" onClick={() => setIsOpen(false)}>
              About Us
            </Link>
          </li>
          <li>
            <Link to="/contact" className="hover:text-gray-300" onClick={() => setIsOpen(false)}>
              Contact Us
            </Link>
          </li>
          <li>
            <button
              className="bg-white text-blue-950 px-4 py-2 rounded-lg hover:bg-gray-200 w-full"
              onClick={() => {
                setIsOpen(false);
                navigate("/login");
              }}
            >
              Login
            </button>
          </li>
        </ul>
      </div>

      {/* DARK OVERLAY WHEN SIDEBAR IS OPEN */}
      {isOpen && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
}

export default Navbar;
