import { useState } from 'react'

export default function Logo({ className, style }) {
  const [src, setSrc] = useState('/mobilelogo.png')
  const [stage, setStage] = useState(0)

  const handleError = () => {
    if (stage === 0) { setSrc('/gla-logo.png'); setStage(1); return }
    if (stage === 1) { setSrc('/gla-logo.svg'); setStage(2); return }
  }

  return (
    <img alt="GLA University" src={src} onError={handleError} className={className} style={style} />
  )
}


