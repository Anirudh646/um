export default function Alumni() {
  const items = [
    { name: 'Ananya Sharma', role: 'Software Engineer, Google', year: 'B.Tech CSE 2021' },
    { name: 'Rohit Verma', role: 'Data Scientist, Amazon', year: 'B.Tech CSE 2020' },
    { name: 'Priya Singh', role: 'Product Manager, Microsoft', year: 'MBA 2019' },
    { name: 'Arjun Mehta', role: 'SDE, Adobe', year: 'B.Tech IT 2022' }
  ]
  return (
    <section className="alumni">
      <div className="alumni-head">
        <h3>Our Distinguished Alumni</h3>
        <a className="alumni-cta" href="#">Explore Alumni →</a>
      </div>
      <div className="alumni-grid">
        {items.map((a, idx) => (
          <div className="alumni-card" key={idx}>
            <div className="avatar" aria-hidden>👤</div>
            <div className="alumni-info">
              <div className="name">{a.name}</div>
              <div className="role">{a.role}</div>
              <div className="year">{a.year}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}


