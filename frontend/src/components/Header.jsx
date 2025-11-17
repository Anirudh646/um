import { useState } from 'react'
import Logo from './Logo.jsx'
import HamburgerMenu from './HamburgerMenu.jsx'

export default function Header({ onLogin, onRollingAd, onAdmissionOpen, onMenuNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false)
  
  // Ensure handlers have defaults
  const handleMenuNavigate = onMenuNavigate || (() => {})
  
  
  return (
    <>
       <div className="top-ribbon">
         <div className="left">
           <Logo className="logo-ribbon" />
           <span className="badge">Accredited with A+ Grade by NAAC</span>
         </div>
        <div className="cta-group">
          <button 
            type="button"
            className="pill" 
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (onAdmissionOpen && typeof onAdmissionOpen === 'function') {
                onAdmissionOpen()
              }
            }}
            style={{ pointerEvents: 'auto', position: 'relative', zIndex: 15 }}
          >
            Admission Open
          </button>
          <button 
            type="button"
            className="pill" 
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (onRollingAd && typeof onRollingAd === 'function') {
                onRollingAd()
              }
            }}
            style={{ pointerEvents: 'auto', position: 'relative', zIndex: 15 }}
          >
            Rolling Advertisement
          </button>
          <button 
            type="button"
            className="pill pill-yellow" 
            onClick={onLogin || (() => {})}
            style={{ cursor: 'pointer' }}
          >
            Student
          </button>
          <button className="pill pill-yellow">Examination</button>
          <button className="pill pill-yellow">IQAC</button>
          <button className="pill pill-yellow">NRPP</button>
          <button className="pill pill-yellow">Careers</button>
          <button className="pill pill-yellow">ICPC</button>
          <a className="helpline" href="#">Admission Helpline 9027068068</a>
        </div>
       </div>
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
            <button 
              type="button"
              className="pill pill-green hamburger-btn" 
              id="hamburger-menu-btn"
              style={{
                margin: 0, 
                pointerEvents: 'auto', 
                position: 'relative', 
                zIndex: 10003,
                cursor: 'pointer',
                minWidth: '40px',
                height: '32px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: 'none',
                outline: 'none'
              }}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setMenuOpen(true)
              }}
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              ☰
            </button>
          </div>
        </ul>
      </nav>
      <HamburgerMenu 
        isOpen={menuOpen} 
        onClose={() => setMenuOpen(false)}
        onNavigate={handleMenuNavigate}
      />
    </>
  )
}


