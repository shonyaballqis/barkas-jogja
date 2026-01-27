// import Sidebar from "./Sidebar";
// import "./styles.css";

// export default function AdminLayout({ children }) {
//   return (
//     <div className="admin-container">
//       <Sidebar />
//       <main className="admin-content">{children}</main>
//     </div>
//   );
// }
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./styles.css";

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}
