import { useState } from 'react'
import './AdmissionOpen.css'

export default function AdmissionOpen({ onBack }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    course: '',
    message: ''
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Thank you for your interest! Our admission team will contact you soon.')
    setFormData({ name: '', email: '', phone: '', course: '', message: '' })
  }

  const handleDownloadBrochure = () => {
    const link = document.createElement('a')
    link.href = '/brochure.pdf'
    link.download = 'GLA-University-Admission-Brochure-2025-26.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setTimeout(() => {
      alert('Brochure download initiated! If the file doesn\'t download automatically, please contact admission@gla.ac.in')
    }, 500)
  }

  return (
    <div className="admission-open-container">
      <div className="admission-hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">🎓 Admissions Now Open</div>
          <h1 className="hero-title">Admission Open 2025-26</h1>
          <p className="hero-subtitle">Begin Your Journey to Excellence at GLA University</p>
          <div className="hero-actions">
            <button className="hero-btn primary" onClick={handleDownloadBrochure}>
              📥 Download Brochure
            </button>
            <button className="hero-btn secondary" onClick={onBack}>
              ← Back to Home
            </button>
          </div>
        </div>
      </div>

      <div className="admission-main-wrapper">
        <div className="admission-grid">
          <div className="admission-left-panel">
            <div className="info-card">
              <div className="card-icon">📋</div>
              <h2>Request an Admission</h2>
              <div className="instructions-list">
                <div className="instruction-item">
                  <span className="step-number">1</span>
                  <span className="step-text">Your details must be same as 10th/Educational certificate.</span>
                </div>
                <div className="instruction-item">
                  <span className="step-number">2</span>
                  <span className="step-text">You will receive your credentials on specified mobile no.</span>
                </div>
                <div className="instruction-item">
                  <span className="step-number">3</span>
                  <span className="step-text">Check you eligibility from (✓) symbol at last before submit.</span>
                </div>
              </div>
            </div>

            <div className="helpline-card">
              <h3>📞 Help Line</h3>
              <div className="divider-small"></div>
              <div className="helpline-item">
                <div className="helpline-label">Offline Courses</div>
                <a href="tel:+917617595613" className="helpline-phone offline">
                  <span className="phone-icon">📱</span>
                  +91 76175 95613
                </a>
              </div>
              <div className="helpline-item">
                <div className="helpline-label">Online Courses</div>
                <a href="tel:+919045054300" className="helpline-phone online">
                  <span className="phone-icon">📱</span>
                  +91 90450 54300
                </a>
              </div>
            </div>

            <div className="brochure-card">
              <div className="brochure-icon-large">📄</div>
              <h3>Get Your Admission Brochure</h3>
              <p>Download comprehensive information about courses, fees, scholarships, and admission process.</p>
              <button className="brochure-download-btn" onClick={handleDownloadBrochure}>
                Download Brochure Now
              </button>
            </div>
          </div>

          <div className="admission-right-panel">
            <div className="status-banner">
              <div className="status-badge">✨ Current Session</div>
              <h2>Admissions Now Open!</h2>
              <p className="status-text">
                Admissions for <strong>Academic Year 2025-26</strong> are now open! 
                Apply now and secure your seat in your preferred program.
              </p>
              <p className="status-note">
                <strong>Winter Session (January Batch)</strong> admissions will open from 
                the first week of November. For enquiries contact us @ 
                <a href="tel:+919027068068"> 9027068068</a>
              </p>
            </div>

            <div className="enquiry-form-card">
              <div className="form-header">
                <h3>Quick Admission Enquiry</h3>
                <p>Fill the form below and our team will get back to you</p>
              </div>
              <form onSubmit={handleSubmit} className="admission-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your.email@example.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label>Mobile Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="10-digit mobile number"
                      required
                      pattern="[0-9]{10}"
                    />
                  </div>
                  <div className="form-group">
                    <label>Course Interest *</label>
                    <select
                      name="course"
                      value={formData.course}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Course</option>
                      <option value="btech">B.Tech</option>
                      <option value="mtech">M.Tech</option>
                      <option value="mba">MBA</option>
                      <option value="mca">MCA</option>
                      <option value="bsc">B.Sc</option>
                      <option value="msc">M.Sc</option>
                      <option value="phd">Ph.D</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group full-width">
                  <label>Message (Optional)</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Any specific query or message..."
                    rows="4"
                  />
                </div>
                
                <button type="submit" className="submit-btn">
                  Submit Enquiry
                </button>
              </form>
            </div>

            <div className="login-card">
              <p>Already registered?</p>
              <a href="#" className="login-link">Click Here To Login →</a>
            </div>

            <div className="stats-grid">
              <div className="stat-box">
                <div className="stat-number">5000+</div>
                <div className="stat-label">Students Placed</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">500+</div>
                <div className="stat-label">Recruiting Companies</div>
              </div>
              <div className="stat-box">
                <div className="stat-number">95%</div>
                <div className="stat-label">Placement Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

