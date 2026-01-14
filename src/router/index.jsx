import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Category from "../pages/Category";
import Admin from "../pages/Admin";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/category" element={<Category />} />
      <Route path="/admin" element={<Admin />} />
    </Routes>
  );
}

