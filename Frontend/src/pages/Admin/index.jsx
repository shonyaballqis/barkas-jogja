import { useState } from "react";

export default function Admin() {
  // dummy data pengajuan seller
  const [requests, setRequests] = useState([
    {
      id: 1,
      email: "user@gmail.com",
      toko: "Toko Barkas Jaya",
      status: "pending",
    },
  ]);

  const handleApprove = (id) => {
    setRequests((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "approved" } : item
      )
    );

    alert("Seller berhasil disetujui (dummy)");
    // nanti di backend: update role jadi seller
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Dashboard Admin</h2>

      <h3>Pengajuan Seller</h3>

      {requests.map((req) => (
        <div
          key={req.id}
          style={{
            marginTop: 10,
            padding: 10,
            background: "#e6f0e2",
            borderRadius: 10,
          }}
        >
          <p><b>Email:</b> {req.email}</p>
          <p><b>Nama Toko:</b> {req.toko}</p>
          <p><b>Status:</b> {req.status}</p>

          {req.status === "pending" && (
            <button onClick={() => handleApprove(req.id)}>
              Approve Seller
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
