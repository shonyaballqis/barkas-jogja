import { useEffect, useState } from "react";
import "./styles.css";
import { API_URL } from "../../api";

export default function SellerRequest() {
  const [requests, setRequests] = useState([]);
  const token = localStorage.getItem("token");

  // GET SELLER PENDING
  const fetchRequests = async () => {
    try {
      const res = await fetch(`${API_URL}/api/admin/seller-requests`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setRequests(data);
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // APPROVE SELLER
  const handleApprove = async (id) => {
    if (!window.confirm("Approve seller ini?")) return;

    await fetch(
      `${API_URL}/api/admin/seller-requests/${id}/approve`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchRequests(); // refresh
  };

  // REJECT SELLER
  const handleReject = async (id) => {
    if (!window.confirm("Reject seller ini?")) return;

    await fetch(
      `${API_URL}/api/admin/seller-requests/${id}/reject`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchRequests(); // refresh
  };

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
            {requests.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: "center" }}>
                  Tidak ada pengajuan seller
                </td>
              </tr>
            ) : (
              requests.map((item) => (
                <tr key={item.verification_id}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.store_name}</td>
                  <td>
                    <span className="badge pending">
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn approve"
                      onClick={() => handleApprove(item.verification_id)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn reject"
                      onClick={() => handleReject(item.verification_id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
