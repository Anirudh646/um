import './PillarDetail.css'

const pillarData = {
  '110-acre-campus': {
    title: '110-Acre Campus',
    icon: '🎓',
    description: 'Our expansive 110-acre campus provides students with a world-class learning environment that seamlessly blends modern infrastructure with natural green spaces.',
    detailedDescription: `
      GLA University's sprawling 110-acre campus stands as a testament to our commitment to providing an exceptional educational experience. The campus is thoughtfully designed to foster innovation, collaboration, and holistic development.
      
      The modern infrastructure includes state-of-the-art academic buildings equipped with smart classrooms, seminar halls, and conference rooms. Every building is designed with sustainability in mind, featuring energy-efficient systems and eco-friendly construction materials.
      
      Our green spaces are carefully maintained, providing students with serene environments for study, relaxation, and recreation. The campus features beautiful gardens, walking paths, and open areas that contribute to a healthy and inspiring atmosphere.
      
      The campus layout ensures easy accessibility to all facilities, with well-planned roadways, parking areas, and pedestrian paths. Safety and security are paramount, with 24/7 surveillance and dedicated security personnel ensuring a secure environment for all students and staff.
    `,
    features: [
      'Smart classrooms with advanced audio-visual systems',
      'Modern administrative buildings with efficient workspaces',
      'Extensive parking facilities for students and staff',
      'Well-maintained gardens and green spaces',
      'Eco-friendly infrastructure with sustainable practices',
      'Comprehensive security systems throughout the campus',
      'Wheelchair accessible facilities',
      'Centralized utilities and maintenance systems'
    ],
    image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=1200&h=800&fit=crop'
  },
  'sports-facilities': {
    title: '20+ Sports Facilities',
    icon: '🏊',
    description: 'Our comprehensive sports infrastructure includes an Olympic-size swimming pool, cricket ground, indoor sports complex, and many more facilities to promote physical fitness and athletic excellence.',
    detailedDescription: `
      At GLA University, we believe in the holistic development of our students, and sports play a crucial role in building character, discipline, and teamwork. Our 20+ world-class sports facilities cater to a wide range of athletic interests and competitive sports.
      
      Our Olympic-size swimming pool is one of the finest in the region, equipped with modern filtration systems, changing rooms, and trained lifeguards. The pool hosts regular swimming competitions and training sessions for both recreational and competitive swimmers.
      
      The cricket ground is a pride of our campus, with well-maintained pitches, professional-grade equipment, and spectator stands. It has hosted numerous inter-university and inter-college tournaments, providing students with opportunities to showcase their talent at competitive levels.
      
      Our indoor sports complex houses facilities for basketball, volleyball, badminton, table tennis, and chess. The complex is climate-controlled, ensuring comfortable play throughout the year. Additionally, we have dedicated spaces for gymnasium, yoga, and meditation.
      
      Beyond these major facilities, our campus includes tennis courts, football grounds, athletics tracks, and specialized courts for various racquet sports. All facilities are maintained to international standards and are available for use by students, faculty, and staff.
    `,
    features: [
      'Olympic-size swimming pool with professional standards',
      'International-standard cricket ground with pavilion',
      'Indoor sports complex with multiple courts',
      'Fully equipped gymnasium with modern equipment',
      'Tennis courts and football grounds',
      'Athletics track for track and field events',
      'Dedicated yoga and meditation halls',
      'Basketball and volleyball courts',
      'Table tennis and badminton facilities',
      'Chess and other indoor game rooms',
      'Professional coaching support available',
      'Regular inter-university tournaments and competitions'
    ],
    image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=1200&h=800&fit=crop'
  },
  'modern-hostels': {
    title: '19 Modern Hostels',
    icon: '🏨',
    description: 'Our 19 modern hostels provide comfortable, secure, and well-maintained accommodation with all essential amenities, creating a home away from home for our students.',
    detailedDescription: `
      GLA University's hostel accommodation is designed to provide students with a comfortable, safe, and conducive living environment that supports both their academic and personal growth. Our 19 modern hostels can accommodate thousands of students, with separate facilities for male and female students.
      
      Each hostel room is spacious, well-ventilated, and furnished with comfortable beds, study tables, chairs, wardrobes, and storage spaces. The rooms are designed to maximize comfort while promoting a productive study environment. Regular maintenance and cleaning ensure that all facilities remain in excellent condition.
      
      All hostels are equipped with high-speed Wi-Fi connectivity, ensuring students can access online resources, attend virtual classes, and stay connected with their families. Common areas in each hostel include recreational spaces, television rooms, and study halls for group activities.
      
      The mess facilities provide nutritious and hygienic meals prepared under strict quality control. Multiple meal options are available to cater to different dietary preferences and requirements. The mess halls are spacious, clean, and designed for comfortable dining.
      
      Security is a top priority in our hostels. All hostels have round-the-clock security personnel, CCTV surveillance, and controlled access systems. Hostel wardens and staff are always available to address any concerns and ensure the well-being of students.
      
      Additional amenities include 24/7 water supply, power backup systems, laundry facilities, common kitchens for light cooking, and dedicated spaces for group studies and recreation. The hostel environment fosters camaraderie, cultural exchange, and lifelong friendships among students.
    `,
    features: [
      'Separate hostels for male and female students',
      'Spacious, well-ventilated, and furnished rooms',
      'High-speed Wi-Fi connectivity in all rooms',
      'Nutritious and hygienic mess facilities',
      '24/7 security with CCTV surveillance',
      'Common recreational and study areas',
      'Regular cleaning and maintenance services',
      'Power backup and uninterrupted water supply',
      'Laundry and housekeeping facilities',
      'Hostel wardens and staff for support',
      'Medical assistance available',
      'Structured rules and discipline for harmonious living'
    ],
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1200&h=800&fit=crop'
  },
  'research-labs': {
    title: '50+ Research Labs',
    icon: '🔬',
    description: 'Our state-of-the-art research laboratories provide cutting-edge facilities for innovation, experimentation, and groundbreaking research across various disciplines.',
    detailedDescription: `
      GLA University is committed to fostering a culture of research and innovation. Our 50+ research laboratories are equipped with the latest technology and equipment, enabling students and faculty to conduct cutting-edge research and contribute to global knowledge.
      
      Our laboratories span across multiple disciplines including engineering, biotechnology, pharmacy, chemistry, physics, computer science, and many more. Each lab is designed according to international standards with proper safety measures, ventilation systems, and modern equipment.
      
      The engineering laboratories feature advanced equipment for civil engineering testing, mechanical engineering experiments, electrical and electronics work, and computer hardware testing. Students have access to simulation software, prototyping tools, and testing facilities that prepare them for real-world challenges.
      
      Our biotechnology and pharmacy labs are equipped with sophisticated instruments for molecular biology, microbiology, pharmaceutical analysis, and drug development. These facilities support both undergraduate learning and advanced research projects.
      
      Computer science labs provide high-performance computing facilities, networking equipment, robotics labs, and AI/ML research setups. Students can work on software development, data science projects, cybersecurity research, and emerging technologies.
      
      All laboratories are supervised by experienced faculty members and technical staff who ensure proper usage of equipment and safety protocols. Regular workshops and training sessions help students make the most of these facilities.
      
      The university encourages interdisciplinary research, and our lab facilities are often used for collaborative projects between different departments. These labs have been instrumental in numerous research publications, patents, and industry collaborations.
    `,
    features: [
      'Advanced equipment across multiple disciplines',
      'Engineering labs with modern testing facilities',
      'Biotechnology and pharmacy research facilities',
      'Computer science labs with high-performance computing',
      'Chemistry and physics research laboratories',
      'Robotics and AI/ML research setups',
      'International-standard safety protocols',
      'Experienced technical staff support',
      'Access to specialized software and tools',
      'Opportunities for undergraduate research projects',
      'Industry collaboration and sponsored research',
      'Regular workshops and equipment training sessions'
    ],
    image: 'https://images.unsplash.com/photo-1532619675605-1ede6c2ed2b0?w=1200&h=800&fit=crop'
  },
  'central-library': {
    title: 'Central Library',
    icon: '📚',
    description: 'Our extensive central library houses a vast collection of books, journals, and digital resources, providing students and faculty with comprehensive academic support.',
    detailedDescription: `
      The Central Library at GLA University is a knowledge hub that serves as the intellectual heart of our campus. With a collection of over thousands of books, journals, periodicals, and digital resources, the library provides comprehensive support for teaching, learning, and research activities.
      
      The library building is architecturally designed to create an inspiring study environment. It features multiple reading halls with comfortable seating, individual study carrels, group discussion rooms, and quiet zones for focused study. The ambiance is carefully maintained to promote concentration and academic productivity.
      
      Our physical collection includes textbooks, reference books, research monographs, encyclopedias, and periodicals across all disciplines taught at the university. The collection is continuously updated with the latest editions and new publications to ensure relevance to current academic and research needs.
      
      The digital library section provides access to numerous online databases, e-journals, e-books, and research papers. Students and faculty can access leading academic databases such as IEEE Xplore, Springer, Elsevier, ACM Digital Library, and many more from anywhere on campus or remotely.
      
      The library uses modern library management systems for easy cataloging, searching, and issuing of books. Students can search the catalog online, reserve books, renew loans, and check their account status through the library portal.
      
      Specialized sections include a rare books collection, archives section, thesis and dissertation repository, and a digital repository of university publications. The library also provides access to newspapers, magazines, and general reading materials.
      
      The library staff is dedicated and knowledgeable, ready to assist students and faculty with research queries, literature searches, and information retrieval. Regular workshops on information literacy and research skills are conducted to help users make the most of library resources.
      
      Modern amenities include computer workstations, printing and scanning facilities, high-speed internet, and comfortable seating arrangements. The library remains open for extended hours to accommodate various study schedules and research needs.
    `,
    features: [
      'Extensive collection of books and reference materials',
      'Access to leading online databases and e-journals',
      'Multiple reading halls and study spaces',
      'Group discussion and meeting rooms',
      'Digital repository and online catalog system',
      'Quiet zones for focused study',
      'Computer workstations and internet access',
      'Printing, scanning, and photocopying facilities',
      'Thesis and dissertation repository',
      'Newspapers, magazines, and periodicals',
      'Professional library staff for assistance',
      'Extended operating hours for convenience',
      'Remote access to digital resources',
      'Information literacy workshops and training'
    ],
    image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=1200&h=800&fit=crop'
  },
  'wifi-campus': {
    title: 'Wi‑Fi Campus',
    icon: '📶',
    description: 'Our high-speed Wi-Fi network covers the entire campus, providing seamless internet connectivity for academic, research, and communication needs.',
    detailedDescription: `
      GLA University's Wi-Fi infrastructure ensures that students and faculty have uninterrupted, high-speed internet access throughout the campus. This robust network supports all academic activities, research work, online learning, and daily communication needs.
      
      Our campus-wide Wi-Fi network is designed with the latest networking technology, providing reliable and fast internet connectivity in classrooms, laboratories, libraries, hostels, administrative buildings, and open spaces. The network infrastructure includes multiple access points strategically placed to ensure comprehensive coverage without dead zones.
      
      The network supports high bandwidth requirements for various applications including video conferencing, online classes, research data transfers, software downloads, and streaming educational content. Students can seamlessly access learning management systems, online libraries, research databases, and cloud-based applications.
      
      Security is a top priority in our network design. The Wi-Fi network implements advanced security protocols including WPA3 encryption, firewall protection, and network monitoring systems. Students are provided with secure credentials and access to a virtual private network (VPN) for additional security when accessing sensitive resources.
      
      The IT department continuously monitors network performance, ensuring optimal speeds and reliability. Regular maintenance and upgrades keep the infrastructure up-to-date with the latest technology standards. Technical support is readily available to address any connectivity issues or technical queries.
      
      Special features of our Wi-Fi network include guest access for visitors, separate networks for different user categories (students, faculty, administrative staff), and bandwidth management to ensure fair usage and optimal performance for all users.
      
      The network infrastructure also supports Internet of Things (IoT) devices, smart campus initiatives, and future technological advancements. This ensures that our campus remains technologically advanced and ready to adopt emerging educational technologies.
      
      With our comprehensive Wi-Fi coverage, students can attend online classes, submit assignments, access study materials, communicate with peers and faculty, and engage in online research from anywhere on campus, making learning flexible and convenient.
    `,
    features: [
      'Campus-wide coverage with no dead zones',
      'High-speed internet connectivity throughout',
      'Secure network with advanced encryption',
      'Support for high-bandwidth applications',
      'Separate networks for students, faculty, and guests',
      'VPN access for secure remote connections',
      '24/7 network monitoring and technical support',
      'Guest Wi-Fi access for visitors',
      'Bandwidth management for optimal performance',
      'Support for IoT and smart campus initiatives',
      'Regular network maintenance and upgrades',
      'Compatible with all modern devices',
      'Support for video conferencing and online classes',
      'Access to cloud services and online resources'
    ],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=800&fit=crop'
  }
}

export default function PillarDetail({ pillarId, onBack }) {
  const pillar = pillarData[pillarId]
  
  if (!pillar) {
    return (
      <div className="pillar-detail-container">
        <div className="pillar-detail-content">
          <h1>Pillar Not Found</h1>
          <button className="back-button pill pill-green" onClick={onBack}>
            ← Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="pillar-detail-container">
      <div className="pillar-detail-header">
        <div className="pillar-header-content">
          <div className="pillar-header-icon">{pillar.icon}</div>
          <h1 className="pillar-detail-title">{pillar.title}</h1>
        </div>
        <button className="back-button pill pill-green" onClick={onBack}>
          ← Back to Home
        </button>
      </div>

      <div className="pillar-detail-hero">
        <div className="pillar-hero-image" style={{ backgroundImage: `url(${pillar.image})` }}></div>
        <div className="pillar-hero-overlay"></div>
        <div className="pillar-hero-content">
          <p className="pillar-description">{pillar.description}</p>
        </div>
      </div>

      <div className="pillar-detail-content">
        <div className="pillar-detailed-section">
          <h2>Detailed Overview</h2>
          <div className="pillar-detailed-text">
            {pillar.detailedDescription.split('\n').map((paragraph, index) => 
              paragraph.trim() ? <p key={index}>{paragraph.trim()}</p> : null
            )}
          </div>
        </div>

        <div className="pillar-features-section">
          <h2>Key Features</h2>
          <div className="pillar-features-grid">
            {pillar.features.map((feature, index) => (
              <div key={index} className="pillar-feature-item">
                <span className="pillar-feature-icon">✓</span>
                <span className="pillar-feature-text">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="pillar-detail-cta">
          <button className="back-button pill pill-green" onClick={onBack}>
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  )
}

