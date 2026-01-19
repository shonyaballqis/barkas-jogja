import { BrowserRouter } from "react-router-dom";
import Router from "./router";
import Navbar from "./components/Navbar/index.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Router />
    </BrowserRouter>
  );
}
