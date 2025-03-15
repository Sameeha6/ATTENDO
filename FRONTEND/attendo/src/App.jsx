<<<<<<< HEAD
import React from "react";
import { useState } from "react";
import "./App.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import AboutUs from "./pages/About";
import ContactUs from "./pages/Contact";
import AdminRoutes from "./routes/AdminRoutes";
import HodRoutes from "./routes/HODroutes";
import TutorRoutes from "./routes/TutorRoutes";
import StudentRoutes from "./routes/StudentRoutes";
import FacultyRoutes from "./routes/FacultyRoutes";
import ParentRoutes from "./routes/ParentRoutes";
=======
import React from 'react'
import './App.css'
import { Routes, Route,useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Login from './pages/Login'
import AboutUs from './pages/About'
import ContactUs from './pages/Contact'
import AdminRoutes from './routes/AdminRoutes'
import HodRoutes from './routes/HODroutes'
import TutorRoutes from './routes/TutorRoutes'
import StudentRoutes from './routes/StudentRoutes'
import FacultyRoutes from './routes/FacultyRoutes'
import { Notfound } from './components/Notfound'


>>>>>>> df373bc398051f8cb1c4642632607c6dd54bfe00
function App() {
  const location = useLocation();

  const hideNavbarRoutes = ["/Admin/*", "/hod/*", "/tutor/*", "/student/*"];
  return (
    <div>
      <div className=" min-h-screen flex flex-col">
<<<<<<< HEAD
        {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/Admin/*" element={<AdminRoutes />} />
            <Route path="/hod/*" element={<HodRoutes />} />
            <Route path="/tutor/*" element={<TutorRoutes />} />
            <Route path="/student/*" element={<StudentRoutes />} />
            <Route path="/faculty/*" element={<FacultyRoutes />} />
            <Route path="/parent/*" element={<ParentRoutes />} />
          </Routes>
        </div>
=======
        {!hideNavbarRoutes.includes(location.pathname) && <Navbar/>}
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/login" element={<Login />} />
              <Route path="/Admin/*" element={<AdminRoutes />} />
              <Route path="/hod/*" element={<HodRoutes />} />
              <Route path="/tutor/*" element={<TutorRoutes />} />
              <Route path="/student/*" element={<StudentRoutes />} />
              <Route path="/faculty/*" element={<FacultyRoutes />} />
              <Route path="*" element={<Notfound />} />
            </Routes>
          </div>
>>>>>>> df373bc398051f8cb1c4642632607c6dd54bfe00
        <Footer />
      </div>
    </div>
  );
}

export default App;
