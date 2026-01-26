import "./styles.css";

export default function SellerRequest() {
  const requests = [
    {
      id: 1,
      nama: "Budi Santoso",
      email: "budi@gmail.com",
      toko: "Toko Barkas Jaya",
      status: "Pending",
    },
  ];

  return (
    <>
      <h1>Permintaan Seller</h1>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Nama</th>
              <th>Email</th>
              <th>Toko</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((item) => (
              <tr key={item.id}>
                <td>{item.nama}</td>
                <td>{item.email}</td>
                <td>{item.toko}</td>
                <td>
                  <span className="badge pending">{item.status}</span>
                </td>
                <td>
                  <button className="btn approve">Approve</button>
                  <button className="btn reject">Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

// import { useState } from "react";

// export default function SellerRequest() {
//   const [requests, setRequests] = useState([
//     {
//       id: 1,
//       email: "user@gmail.com",
//       toko: "Toko Barkas Jaya",
//       status: "pending",
//     },
//   ]);

//   const handleApprove = async (id) => {
//     try {
//       const res = await fetch(
//         `http://localhost:3000/approve-seller/${id}`,
//         { method: "POST" }
//       );

//       if (res.status === 403) {
//         alert("Akses ditolak (403)");
//         return;
//       }

//       setRequests((prev) =>
//         prev.map((r) =>
//           r.id === id ? { ...r, status: "approved" } : r
//         )
//       );

//       alert("Seller disetujui ✅");
//     } catch {
//       alert("Error approve seller");
//     }
//   };

//   return (
//     <>
//       <h1>Permintaan Seller</h1>

//       {requests.map((r) => (
//         <div key={r.id} className="request-card">
//           <p>Email: {r.email}</p>
//           <p>Toko: {r.toko}</p>
//           <p>Status: {r.status}</p>

//           {r.status === "pending" && (
//             <button onClick={() => handleApprove(r.id)}>
//               Approve
//             </button>
//           )}
//         </div>
//       ))}
//     </>
//   );
// }
