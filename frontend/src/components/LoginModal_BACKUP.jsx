import Logo from './Logo.jsx'
import { useEffect, useMemo, useState } from 'react'
import { authenticateStudent } from '../data/students.js'

function generateCaptcha() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = ''
  for (let i=0;i<6;i++) out += chars[Math.floor(Math.random()*chars.length)]
  return out
}

export default function LoginModal({ open, onClose }) {
  const [tab, setTab] = useState('')
  const [captcha, setCaptcha] = useState(generateCaptcha())
  const [input, setInput] = useState({ id:'', password:'', captcha:'' })
  const [error, setError] = useState('')

  useEffect(()=>{ 
    setError('')
    if (open) {
      setTab('') // Reset to category selection every time modal opens
      setInput({ id:'', password:'', captcha:'' })
      setCaptcha(generateCaptcha())
    }
  }, [open])

  if (!open) return null

  const submit = async (e) => {
    e.preventDefault()
    if (!input.id || !input.password || !input.captcha) {
      setError('Please fill all fields')
      return
    }
    if (input.captcha.toUpperCase() !== captcha) {
      setError('Invalid CAPTCHA')
      setCaptcha(generateCaptcha())
      setInput({...input, captcha:''})
      return
    }
    
    // CRITICAL: Handle student login with local authentication (NO API CALL EVER)
    // Check IMMEDIATELY and return early to prevent any API calls
    // This MUST execute before any API code can run
    const isStudentLogin = tab === 'student'
    
    if (isStudentLogin) {
      // Use local authentication - no API calls for students
      const studentId = input.id.trim()
      const password = input.password.trim()
      const student = authenticateStudent(studentId, password)
      
      if (student) {
        // Store student data in localStorage
        localStorage.setItem('student', JSON.stringify(student))
        // Trigger student login success
        window.dispatchEvent(new CustomEvent('studentLoginSuccess', { detail: student }))
        onClose()
        return // MUST return here - prevents any API call
      } else {
        setError('Invalid Student ID or Password. Please check your credentials.')
        setCaptcha(generateCaptcha())
        setInput({...input, captcha:''})
        return // MUST return here - prevents any API call
      }
    }
    
    // IMPORTANT: Only faculty login reaches this point
    // Student login should NEVER reach here due to early return above
    
    // Final safety checks - NEVER make API call if this is student login
    if (isStudentLogin || tab === 'student') {
      console.error('CRITICAL ERROR: Student login reached API call section! Tab:', tab)
      setError('System error: Student login should use local authentication')
      return
    }
    
    // Only proceed with API call if tab is definitely 'faculty'
    if (tab !== 'faculty') {
      console.error('Unexpected tab value:', tab, 'Expected: faculty')
      setError('Please select a login type')
      return
    }
    
    try {
      const response = await fetch('http://127.0.0.1:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: input.id,
          password: input.password
        })
      })
      
        const data = await response.json()
        
        if (data.ok) {
          localStorage.setItem('user', JSON.stringify(data.user))
          
          if (data.user.role === 'teacher') {
            window.dispatchEvent(new CustomEvent('openFacultyPortal'))
          } else {
            alert(`Welcome ${data.user.name}! Student login successful!`)
          }
          onClose()
        } else {
          setError(data.message || 'Login failed')
          setCaptcha(generateCaptcha())
          setInput({...input, captcha:''})
        }
      } catch (error) {
        console.error('Login error:', error)
        setError('Network error. Please try again.')
        setCaptcha(generateCaptcha())
        setInput({...input, captcha:''})
      }
    } else {
      // Unknown tab state - should not happen
      setError('Please select a login type')
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e)=>e.stopPropagation()}>
        {!tab && (
          <div>
            <div className="modal-header" style={{justifyContent:'center', position:'relative'}}>
              <Logo className="modal-logo" />
              <button className="modal-close" onClick={onClose}>✕</button>
            </div>
            <div className="modal-body" style={{alignItems:'center'}}>
              <div style={{fontWeight:800, color:'#374151', marginBottom:8}}>Select Login Type</div>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, width:'100%'}}>
                <button className="pill" onClick={()=>setTab('faculty')}>Faculty Login</button>
                <button className="pill pill-green" onClick={()=>setTab('student')}>Student Login</button>
              </div>
            </div>
          </div>
        )}
        {!!tab && (
          <>
            <div className="modal-header" style={{justifyContent:'center', position:'relative'}}>
              <Logo className="modal-logo" />
              <button className="modal-close" onClick={onClose}>✕</button>
            </div>
            <div style={{display:'flex', alignItems:'center', padding:'10px 16px', borderBottom:'1px solid #e5e7eb', background:'#f9fafb'}}>
              <button onClick={() => { setTab(''); setError(''); setInput({ id:'', password:'', captcha:'' }); setCaptcha(generateCaptcha()); }} style={{background:'none', border:'none', cursor:'pointer', color:'#0b4d2b', fontWeight:600, display:'flex', alignItems:'center', gap:4}}>
                ← Back
              </button>
              <div style={{flexGrow:1, textAlign:'center', fontWeight:700, color:'#333'}}>
                {tab === 'student' ? 'Student Login' : 'Faculty Login'}
              </div>
            </div>
            <form className="modal-body" onSubmit={submit}>
              <label>Login ID</label>
              <input placeholder="Enter your User ID" value={input.id} onChange={(e)=>setInput({...input, id:e.target.value})} required />
              <label>Password</label>
              <input type="password" placeholder="Enter your password" value={input.password} onChange={(e)=>setInput({...input, password:e.target.value})} required />
              <label>Captcha</label>
              <div className="captcha-row">
                <div className="captcha-box" role="img" aria-label="captcha">{captcha}</div>
                <input placeholder="Enter captcha" value={input.captcha} onChange={(e)=>setInput({...input, captcha:e.target.value})} required />
                <button type="button" className="pill" onClick={()=>setCaptcha(generateCaptcha())}>↻</button>
              </div>
              {error && <div className="error-text">{error}</div>}
              <div className="modal-actions">
                <label className="remember"><input type="checkbox" /> Remember me</label>
                <button type="submit" className="pill pill-green" style={{marginLeft:'auto'}}>Login</button>
              </div>
            </form>
            <div className="modal-footer">
              <a href="#">Forgot Password?</a>
              <a href="#">Help & Support</a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}


