import { useState } from 'react'
import './RollingAdvertisement.css'

export default function RollingAdvertisement({ onBack }) {
  const [selectedPosition, setSelectedPosition] = useState(null)

  const handleDownloadApplication = () => {
    const link = document.createElement('a')
    link.href = '/application-form.pdf'
    link.download = 'GLA-University-Faculty-Application-Form.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setTimeout(() => {
      alert('Application form download initiated! If the file doesn\'t download automatically, please email career@gla.ac.in to request the form.')
    }, 500)
  }

  const positions = [
    {
      id: 'professor',
      title: 'Professor',
      icon: '👨‍🏫',
      requirements: [
        '10 years teaching/research/industrial experience',
        'At least 3 years at Associate Professor level',
        'At least 4 research papers as 1st author in reputed SCI Journals',
        'At least 2 PhD guidance as supervisor/co-supervisor completed'
      ],
      payLevel: '14',
      basicPay: '₹1,44,200'
    },
    {
      id: 'associate',
      title: 'Associate Professor',
      icon: '👩‍🏫',
      requirements: [
        '8 years teaching/research/industrial experience',
        'At least 2 years at Assistant Professor level (post-PhD)',
        'At least 2 research papers as 1st author in reputed SCI Journals',
        'At least 1 PhD guidance as supervisor/co-supervisor completed'
      ],
      payLevel: '13A1',
      basicPay: '₹1,31,400'
    },
    {
      id: 'assistant',
      title: 'Assistant Professor',
      icon: '🎓',
      requirements: [
        'Ph.D. with first class at preceding degree',
        'Very good academic record in all preceding degrees',
        'At least 1 research paper as 1st author in SCI Journal OR',
        'At least 2 papers as 1st author in reputed Scopus Journals'
      ],
      payLevel: '10-12',
      basicPay: '₹57,700 - ₹79,800'
    }
  ]

  return (
    <div className="rolling-ad-container">
      <div className="rolling-ad-hero">
        <div className="hero-pattern"></div>
        <div className="hero-content-wrapper">
          <div className="hero-badge">🌟 Faculty Positions Available</div>
          <h1 className="hero-main-title">Rolling Advertisement</h1>
          <p className="hero-description">Join Our Team of Excellence - Faculty Positions in Computer Engineering & Business Management</p>
          <div className="hero-buttons">
            <button className="hero-btn-primary" onClick={handleDownloadApplication}>
              📥 Download Application Form
            </button>
            <button className="hero-btn-secondary" onClick={onBack}>
              ← Back to Home
            </button>
          </div>
        </div>
      </div>

      <div className="rolling-ad-content">
        <div className="intro-section">
          <div className="section-icon">🎯</div>
          <h2>Opportunities Available</h2>
          <p className="intro-text">
            Applications for faculty positions are invited from <strong>Indian Nationals</strong> in the 
            <strong> Department of Computer Engineering and Applications</strong> and 
            <strong> Institute of Business Management</strong>.
          </p>
        </div>

        <div className="positions-section">
          <h2 className="section-title">Position-wise Requirements</h2>
          <div className="positions-grid">
            {positions.map((position) => (
              <div 
                key={position.id}
                className={`position-card ${selectedPosition === position.id ? 'expanded' : ''}`}
                onClick={() => setSelectedPosition(selectedPosition === position.id ? null : position.id)}
              >
                <div className="position-header">
                  <div className="position-icon">{position.icon}</div>
                  <div className="position-title-group">
                    <h3>{position.title}</h3>
                    <div className="position-salary">
                      <span className="pay-level">Level {position.payLevel}</span>
                      <span className="pay-amount">{position.basicPay}</span>
                    </div>
                  </div>
                </div>
                <div className={`position-details ${selectedPosition === position.id ? 'show' : ''}`}>
                  <ul className="requirements-list">
                    {position.requirements.map((req, index) => (
                      <li key={index}>
                        <span className="check-icon">✓</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pay-scale-section">
          <h2 className="section-title">Pay Scale (7th CPC)</h2>
          <div className="pay-scale-card">
            <table className="pay-scale-table">
              <thead>
                <tr>
                  <th>Post</th>
                  <th>Pay Level</th>
                  <th>Basic Pay (INR)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Professor</strong></td>
                  <td>14</td>
                  <td className="highlight">₹1,44,200</td>
                </tr>
                <tr>
                  <td><strong>Associate Professor</strong></td>
                  <td>13A1</td>
                  <td className="highlight">₹1,31,400</td>
                </tr>
                <tr>
                  <td><strong>Assistant Professor</strong></td>
                  <td>12</td>
                  <td className="highlight">₹79,800</td>
                </tr>
                <tr>
                  <td><strong>Assistant Professor</strong></td>
                  <td>11</td>
                  <td className="highlight">₹68,900</td>
                </tr>
                <tr>
                  <td><strong>Assistant Professor</strong></td>
                  <td>10</td>
                  <td className="highlight">₹57,700</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="incentives-section">
          <h2 className="section-title">University Benefits & Incentives</h2>
          <div className="incentives-grid">
            <div className="incentive-card">
              <div className="incentive-icon">📝</div>
              <h3>Publication Incentives</h3>
              <ul className="incentive-details">
                <li>₹1,25,000 for SCI Q1 Journal</li>
                <li>₹75,000 for SCI Q2 Journal</li>
                <li>₹50,000 for SCI Q3 Journal</li>
                <li>₹20,000 for Scopus/Web of Science</li>
              </ul>
            </div>

            <div className="incentive-card">
              <div className="incentive-icon">💼</div>
              <h3>Consultancy</h3>
              <div className="incentive-amount">80% of Amount</div>
            </div>

            <div className="incentive-card">
              <div className="incentive-icon">🔬</div>
              <h3>Patent Incentive</h3>
              <ul className="incentive-details">
                <li>₹1,00,000 on Grant</li>
                <li>₹25,000 on Publishing</li>
              </ul>
            </div>

            <div className="incentive-card">
              <div className="incentive-icon">🎓</div>
              <h3>Conference/Workshop</h3>
              <div className="incentive-amount">₹15,000 per annum</div>
            </div>

            <div className="incentive-card">
              <div className="incentive-icon">📚</div>
              <h3>Value Added Course</h3>
              <div className="incentive-amount">100% of Fee</div>
            </div>

            <div className="incentive-card highlight-card">
              <div className="incentive-icon">🏠</div>
              <h3>Additional Benefits</h3>
              <ul className="incentive-details">
                <li>HRA (if housing not provided)</li>
                <li>Free Transportation</li>
                <li>Conference Support</li>
                <li>And more as per norms</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="application-section">
          <div className="application-card">
            <h2>Application Process</h2>
            <p>Download the application form for all positions and send it to the email address below:</p>
            <button className="download-application-btn" onClick={handleDownloadApplication}>
              📥 Download Application Form
            </button>
            <div className="application-email">
              <span className="email-label">Send to:</span>
              <a href="mailto:career@gla.ac.in" className="email-link">career@gla.ac.in</a>
            </div>
          </div>
        </div>

        <div className="research-section">
          <div className="research-card">
            <div className="research-icon">🔬</div>
            <h2>Active Research Environment</h2>
            <p>The department is actively engaged in high-impact research across multiple cutting-edge domains, providing ample opportunities for innovative work and collaboration.</p>
          </div>
        </div>

        <div className="important-info-section">
          <h2 className="section-title">Important Information</h2>
          <div className="info-cards-grid">
            <div className="info-card">
              <div className="info-icon">ℹ️</div>
              <p>Mere eligibility will not entitle any candidate for being called for interview.</p>
            </div>
            <div className="info-card">
              <div className="info-icon">📋</div>
              <p>Applicants not meeting minimum experience may be offered contract appointments.</p>
            </div>
            <div className="info-card">
              <div className="info-icon">⭐</div>
              <p>Requirements may be relaxed for candidates with outstanding credentials.</p>
            </div>
            <div className="info-card">
              <div className="info-icon">🔄</div>
              <p>Candidates not suitable for higher positions may be considered for lower positions.</p>
            </div>
            <div className="info-card">
              <div className="info-icon">📎</div>
              <p>Certificate and documentary proof should be uploaded along with application form.</p>
            </div>
            <div className="info-card">
              <div className="info-icon">✉️</div>
              <p>All correspondence to be addressed to the Dean, Resource Generation & Planning.</p>
            </div>
          </div>
        </div>

        <div className="contact-section">
          <div className="contact-card">
            <div className="contact-header">
              <h2>Contact Information</h2>
              <div className="contact-decoration">📞</div>
            </div>
            <div className="contact-details">
              <div className="contact-item">
                <strong>Office of Human Resource Department</strong>
                <p>GLA University, Mathura</p>
              </div>
              <div className="contact-item">
                <strong>Tel:</strong> <a href="tel:+915662250900">+91-5662-250900</a> / <a href="tel:+915662250909">909</a>
              </div>
              <div className="contact-item">
                <strong>E-mail:</strong> <a href="mailto:career@gla.ac.in">career@gla.ac.in</a>
              </div>
              <div className="contact-item">
                <strong>Website:</strong> <a href="http://www.gla.ac.in" target="_blank" rel="noopener noreferrer">www.gla.ac.in</a>
              </div>
            </div>
            <p className="contact-note">For any clarification, please contact the HR Department using the details above.</p>
          </div>
        </div>

        <div className="cta-section">
          <button className="cta-primary-btn" onClick={handleDownloadApplication}>
            📥 Download Application Form Now
          </button>
          <button className="cta-secondary-btn" onClick={onBack}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

