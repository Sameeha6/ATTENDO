import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import AboutUs from "./pages/About";
import ContactUs from "./pages/Contact";
import AdminRoutes from "./routes/AdminRoutes";

function App() {
  const [count, setCount] = useState(0);

  return (
    // <div className=" min-h-screen flex flex-col">
    //   <Navbar />
    //   <div className="flex-grow">
    //     <Routes>
    //       <Route path="/" element={<Home />} />
    //       <Route path="/about" element={<AboutUs />} />
    //       <Route path="/contact" element={<ContactUs />} />
    //       <Route path="/login" element={<Login />} />
    //     </Routes>
    //   </div>
    //   <Footer />
    // </div>
    <AdminRoutes />
  );
}

export default App;
