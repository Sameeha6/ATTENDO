<<<<<<< HEAD
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
=======
import { useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Login from './pages/Login'
import AboutUs from './pages/About'
import ContactUs from './pages/Contact'
import AdminRoutes from './routes/AdminRoutes'
import HodRoutes from './routes/HODroutes'
>>>>>>> 4a68f10be941b28dd7cc34a45943de2864d7c61a

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
<<<<<<< HEAD
    <AdminRoutes />
  );
=======
    // <AdminRoutes/>
    <HodRoutes/>
  )
>>>>>>> 4a68f10be941b28dd7cc34a45943de2864d7c61a
}

export default App;
