import { useEffect, useMemo, useRef, useState } from 'react'

const SLIDE_INTERVAL_MS = 6000

export default function HeroSlider() {
  const slides = useMemo(() => [
    {
      title: 'ADMISSION OPEN',
      sub: 'MAY-2025-26',
      desc: 'Apply now and kickstart your future at GLA University.',
      badge: 'Scholarships Available',
      bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=800&fit=crop&crop=center',
      overlay: 'rgba(0,0,0,0.4)'
    },
    {
      title: 'LEARN. GROW. THRIVE.',
      sub: 'Industry-led Curriculum',
      desc: 'Mentorship, live projects, and career guidance for every student.',
      badge: '500+ Recruiters',
      bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=800&fit=crop&crop=center',
      overlay: 'rgba(0,0,0,0.3)'
    },
    {
      title: 'EXCEPTIONAL PLACEMENTS',
      sub: '95% Placement Rate',
      desc: 'Top offers by leading companies across the globe.',
      badge: 'Average Package ₹15 LPA',
      bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&h=800&fit=crop&crop=center',
      overlay: 'rgba(0,0,0,0.4)'
    }
  ], [])

  const [index, setIndex] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, SLIDE_INTERVAL_MS)
    return () => clearInterval(timerRef.current)
  }, [slides.length])

  return (
    <section className="slider">
      <div className="slides-track" style={{width: `${slides.length*100}%`, transform: `translateX(-${index*(100/slides.length)}%)`}}>
        {slides.map((s, i) => (
          <div key={i} className="slide" style={{width: `${100/slides.length}%`}}>
            <div className="slide-bg" style={{backgroundImage: `url(${s.image})`, backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
            <div className="slide-overlay" style={{backgroundColor: s.overlay}}></div>
            <div className="slide-content">
              <div className="slide-inner">
                <div className="badge-tag">{s.badge}</div>
                <h1>{s.title}</h1>
                <h2>{s.sub}</h2>
                <p>{s.desc}</p>
                <div className="slide-cta">
                  <a className="pill pill-green" href="#">Apply Now</a>
                  <a className="pill" href="#">Learn More</a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button className="nav prev" onClick={()=>setIndex((index-1+slides.length)%slides.length)} aria-label="Previous">‹</button>
      <button className="nav next" onClick={()=>setIndex((index+1)%slides.length)} aria-label="Next">›</button>
      <div className="slider-controls">
        {slides.map((_, i) => (
          <button key={i} className={`dot ${i===index?'active':''}`} onClick={() => setIndex(i)} aria-label={`Slide ${i+1}`}></button>
        ))}
      </div>
    </section>
  )
}


