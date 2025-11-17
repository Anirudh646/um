import './DetailPage.css'

const pageContent = {
  'events': {
    title: 'Events',
    icon: '🎉',
    description: 'Explore our exciting events and activities throughout the year.',
    sections: [
      {
        heading: 'Upcoming Events',
        content: 'GLA University hosts a diverse range of events throughout the academic year including technical festivals, cultural programs, sports competitions, and industry interactions.'
      },
      {
        heading: 'Annual Festivals',
        content: 'Our annual technical and cultural festivals bring together students, faculty, and industry experts for celebrations of innovation, creativity, and collaboration.'
      }
    ]
  },
  'news': {
    title: 'News & Updates',
    icon: '📰',
    description: 'Stay updated with the latest news and announcements from GLA University.',
    sections: [
      {
        heading: 'Latest News',
        content: 'Keep yourself informed about the latest developments, achievements, and updates from GLA University.'
      },
      {
        heading: 'Announcements',
        content: 'Important announcements regarding admissions, examinations, results, and university activities.'
      }
    ]
  },
  'workshops': {
    title: 'Workshops',
    icon: '🔧',
    description: 'Hands-on learning experiences through our comprehensive workshop programs.',
    sections: [
      {
        heading: 'Technical Workshops',
        content: 'Regular technical workshops covering latest technologies, tools, and methodologies in engineering, business, and sciences.'
      },
      {
        heading: 'Skill Development',
        content: 'Workshops focused on developing soft skills, communication, leadership, and professional competencies.'
      }
    ]
  },
  'seminars': {
    title: 'Seminars',
    icon: '🎓',
    description: 'Enriching seminars by industry experts and academicians.',
    sections: [
      {
        heading: 'Industry Seminars',
        content: 'Regular seminars by industry leaders sharing insights, trends, and career opportunities.'
      },
      {
        heading: 'Academic Seminars',
        content: 'Academic seminars featuring research presentations and scholarly discussions.'
      }
    ]
  },
  'conferences': {
    title: 'Conferences',
    icon: '🌐',
    description: 'National and international conferences hosted at GLA University.',
    sections: [
      {
        heading: 'International Conferences',
        content: 'We host and participate in international conferences providing platforms for global academic exchange and research collaboration.'
      },
      {
        heading: 'National Conferences',
        content: 'Regular national conferences covering various domains of engineering, management, and sciences.'
      }
    ]
  },
  'nirf': {
    title: 'NIRF Rankings',
    icon: '🏆',
    description: 'GLA University\'s performance in National Institutional Ranking Framework.',
    sections: [
      {
        heading: 'NIRF Rankings 2024',
        content: 'GLA University has been consistently ranked among the top institutions in India by NIRF (National Institutional Ranking Framework) established by MHRD, Government of India.'
      },
      {
        heading: 'Category Rankings',
        content: 'The university has achieved commendable rankings across multiple categories including Engineering, Management, and Overall categories.'
      },
      {
        heading: 'Quality Parameters',
        content: 'Our rankings reflect excellence in teaching, learning, research, outreach, and inclusivity across all parameters evaluated by NIRF.'
      }
    ]
  },
  'why-gla': {
    title: 'Why GLA?',
    icon: '✨',
    description: 'Discover what makes GLA University the right choice for your future.',
    sections: [
      {
        heading: 'Academic Excellence',
        content: 'GLA University offers world-class education with a curriculum designed to meet industry needs, experienced faculty, and state-of-the-art infrastructure.'
      },
      {
        heading: 'Industry Connections',
        content: 'Strong industry partnerships providing internships, live projects, guest lectures, and excellent placement opportunities with leading companies.'
      },
      {
        heading: 'Holistic Development',
        content: 'Focus on all-round development through co-curricular activities, sports, cultural events, and student clubs.'
      },
      {
        heading: 'Research Opportunities',
        content: 'Extensive research facilities, funding opportunities, and mentorship for students interested in research and innovation.'
      }
    ]
  },
  'research': {
    title: 'Research & Innovation',
    icon: '🔬',
    description: 'Cutting-edge research and innovation at GLA University.',
    sections: [
      {
        heading: 'Research Centers',
        content: 'Multiple specialized research centers focusing on various domains including engineering, biotechnology, management, and applied sciences.'
      },
      {
        heading: 'Research Publications',
        content: 'Our faculty and students regularly publish research papers in reputed national and international journals and conferences.'
      },
      {
        heading: 'Patents & IPR',
        content: 'Active patent filing and intellectual property rights management, encouraging innovation and entrepreneurship.'
      },
      {
        heading: 'Research Funding',
        content: 'Support for research projects through internal funding, government grants, and industry collaborations.'
      }
    ]
  },
  'alumni': {
    title: 'Alumni Network',
    icon: '👥',
    description: 'Connect with our global alumni community.',
    sections: [
      {
        heading: 'Alumni Success Stories',
        content: 'Our alumni have achieved remarkable success across various industries worldwide. Many hold leadership positions in top organizations.'
      },
      {
        heading: 'Alumni Association',
        content: 'Active alumni association facilitating networking, mentorship programs, and continued engagement with the university.'
      },
      {
        heading: 'Alumni Contributions',
        content: 'Alumni regularly contribute through guest lectures, industry projects, placements, and supporting current students.'
      }
    ]
  },
  'careers': {
    title: 'Careers at GLA',
    icon: '💼',
    description: 'Explore career opportunities with GLA University.',
    sections: [
      {
        heading: 'Faculty Positions',
        content: 'We invite passionate educators and researchers to join our faculty. Competitive packages, research support, and excellent work environment await.'
      },
      {
        heading: 'Administrative Positions',
        content: 'Various administrative roles supporting the university operations across different departments and functions.'
      },
      {
        heading: 'Why Join Us',
        content: 'GLA University offers a stimulating work environment, professional growth opportunities, competitive compensation, and a chance to make a difference in education.'
      }
    ]
  },
  'contact-us': {
    title: 'Contact Us',
    icon: '📞',
    description: 'Get in touch with GLA University.',
    sections: [
      {
        heading: 'Main Campus',
        content: '17km Stone, NH-19, Mathura-Delhi Road, Mathura-281 406 (U.P.) INDIA'
      },
      {
        heading: 'Contact Information',
        content: 'Phone: +91-5662-250900 / 909\nEmail: info@gla.ac.in\nWebsite: www.gla.ac.in'
      },
      {
        heading: 'Admission Helpline',
        content: 'For admission related queries: +91 9027068068\nEmail: admission@gla.ac.in'
      },
      {
        heading: 'Careers',
        content: 'For career opportunities: career@gla.ac.in'
      }
    ]
  }
}

export default function DetailPage({ pageId, onBack }) {
  const content = pageContent[pageId]
  
  if (!content) {
    return (
      <div className="detail-page-container">
        <div className="detail-page-header">
          <h1>Page Not Found</h1>
          <button className="back-button" onClick={onBack}>← Back</button>
        </div>
      </div>
    )
  }

  return (
    <div className="detail-page-container">
      <div className="detail-page-hero">
        <div className="hero-content">
          <div className="page-icon">{content.icon}</div>
          <h1 className="page-title">{content.title}</h1>
          <p className="page-description">{content.description}</p>
        </div>
      </div>

      <div className="detail-page-content">
        <div className="content-sections">
          {content.sections.map((section, index) => (
            <div key={index} className="content-card">
              <h2 className="section-heading">{section.heading}</h2>
              <p className="section-content">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="page-footer">
          <button className="back-button-large" onClick={onBack}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

