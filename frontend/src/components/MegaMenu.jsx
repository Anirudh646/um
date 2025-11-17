export default function MegaMenu({ onLogin }) {
  return (
    <nav className="main-nav">
      <ul className="menu" style={{justifyContent:'space-between'}}>
        <div style={{display:'flex',gap:24,alignItems:'center'}}>
          <li className="menu-item">About Us
            <div className="mega">
              <div>
                <a href="#">Who We Are</a>
                <a href="#">Leadership</a>
                <a href="#">CSR Activities</a>
              </div>
            </div>
          </li>
          <li className="menu-item">Academics
            <div className="mega">
              <div>
                <a href="#">Institutes</a>
                <a href="#">Departments</a>
                <a href="#">Exams & Results</a>
              </div>
            </div>
          </li>
          <li className="menu-item">Courses
            <div className="mega">
              <div>
                <a href="#">Graduate</a>
                <a href="#">Post Graduate</a>
                <a href="#">Doctoral</a>
              </div>
            </div>
          </li>
          <li className="menu-item">Admissions</li>
          <li className="menu-item">Campus Life</li>
          <li className="menu-item">Placements</li>
          <li className="menu-item">Research & Innovation</li>
        </div>
        <div style={{display:'flex',gap:12,alignItems:'center'}}>
          <button className="pill" style={{margin:0}} onClick={onLogin}>Login</button>
          <button className="pill pill-green" style={{margin:0}}>☰</button>
        </div>
      </ul>
    </nav>
  )
}


