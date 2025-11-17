import Logo from './Logo.jsx'
import { useEffect, useMemo, useState } from 'react'
import { API_ENDPOINTS } from '../config/api.js'

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
    console.log('🔍 Login submit - Current tab:', tab)
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
    
    // STUDENT LOGIN: Use backend API only (new credentials from database)
    if (tab === 'student') {
      console.log('🔵 Student login detected - using backend API')
      const studentId = input.id.trim()
      const password = input.password.trim()
      
      try {
        const response = await fetch(API_ENDPOINTS.LOGIN, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            student_id: studentId,  // Use student_id field for Student ID (roll_number)
            password: password
          })
        })
        
        const data = await response.json()
        
        if (data.ok && data.user.role === 'student') {
          console.log('✅ Student login successful:', data.user.roll_number)
          // Store student data in the format expected by StudentPortal
          const studentData = {
            id: data.user.roll_number,  // Use roll_number as id for compatibility
            name: data.user.name,
            email: data.user.email,
            roll_number: data.user.roll_number,
            class_name: data.user.class_name,
            program: data.user.class_name,  // Map class_name to program
            semester: 'V',  // Default semester
            batch: '2023'   // Default batch
          }
          localStorage.setItem('student', JSON.stringify(studentData))
          window.dispatchEvent(new CustomEvent('studentLoginSuccess', { detail: studentData }))
          onClose()
        } else {
          setError(data.message || 'Invalid Student ID or Password')
          setCaptcha(generateCaptcha())
          setInput({...input, captcha:''})
        }
      } catch (error) {
        console.error('Student login error:', error)
        setError('Network error. Please try again.')
        setCaptcha(generateCaptcha())
        setInput({...input, captcha:''})
      }
      
      return
    }
    
    // FACULTY LOGIN: Uses API
    if (tab === 'faculty') {
      console.log('🟡 Faculty login detected - using API')
      try {
        const response = await fetch(API_ENDPOINTS.LOGIN, {
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
        console.error('Faculty login error:', error)
        setError('Network error. Please try again.')
        setCaptcha(generateCaptcha())
        setInput({...input, captcha:''})
      }
    } else {
      // Unknown tab state - should not happen
      console.error('⚠️ Unknown tab state:', tab)
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
              <label>{tab === 'student' ? 'Student ID' : 'Email'}</label>
              <input 
                placeholder={tab === 'student' ? 'Enter your Student ID (e.g., 2335000001)' : 'Enter your Email'} 
                value={input.id} 
                onChange={(e)=>setInput({...input, id:e.target.value})} 
                required 
              />
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


