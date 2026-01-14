import "../../styles/home.css";

export default function Home() {
  return (
    <main className="home">
      <h2>Barang Bekas Jogja</h2>

      <section className="product-grid">
        {Array.from({ length: 8 }).map((_, i) => (
          <article className="card" key={i}>
            <img src="https://via.placeholder.com/150" />
            <h4>Nama Barang</h4>
            <p>Rp 1.000.000</p>
          </article>
        ))}
      </section>
    </main>
  )
}

