import ScrollToTop from './components/ScrolltoTop'
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
import ParentRoutes from "./routes/ParentRoutes";
import { Notfound } from './components/Notfound'
import ProtectedRoute from './routes/Protectedroutes'



function App() {
  const location = useLocation();

const hideNavbarRoutes = ["/admin", "/hod", "/tutor", "/student", "/parent", "/faculty"];
const shouldHideNavbar = hideNavbarRoutes.some(route => location.pathname.startsWith(route));

return (
  <div className="min-h-screen flex flex-col">
    {!shouldHideNavbar && <Navbar />}
    <div className="flex-grow">
    <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/*" element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminRoutes />
          </ProtectedRoute>} 
        />
        <Route path="/hod/*" element={
          <ProtectedRoute allowedRoles={["HOD"]}>
            <HodRoutes />
          </ProtectedRoute>} 
        />
        <Route path="/tutor/*" element={
          <ProtectedRoute allowedRoles={["tutor"]}>
            <TutorRoutes />
          </ProtectedRoute>}
        />
        <Route path="/student/*" element={
          <ProtectedRoute allowedRoles={["student"]}>
          <StudentRoutes />
          </ProtectedRoute>} 
        />
        <Route path="/faculty/*" element={
          <ProtectedRoute allowedRoles={["faculty"]}>
          <FacultyRoutes />
          </ProtectedRoute>} 
        />
        <Route path="/parent/*" element={
          <ProtectedRoute allowedRoles={["parent"]}>
          <ParentRoutes />
          </ProtectedRoute>} 
        />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </div>
    {/* <Footer /> */}
  </div>
);

}

export default App;
