export default function Users() {
  const users = [
    { id: 1, nama: "Siti", email: "siti@gmail.com", role: "User" },
    { id: 2, nama: "Ahmad", email: "ahmad@gmail.com", role: "Seller" },
  ];

  return (
    <>
      <h1>Pengguna</h1>

      <div className="table-card">
        <table>
          <thead>
            <tr>
              <th>Nama</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.nama}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
