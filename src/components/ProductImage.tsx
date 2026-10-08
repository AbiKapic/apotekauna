import { useEffect, useState } from 'react'
import { Image } from 'lucide-react'

export function ProductImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [src])
  if (!src.trim() || failed) return <div role="img" aria-label={`${alt} — slika nije dostupna`} className={`${className || ''} flex flex-col items-center justify-center gap-2 bg-[#f0f2e8] text-[#95a382]`}><Image size={24} strokeWidth={1.4}/><span className="text-[10px]">Slika nije dostupna</span></div>
  return <img src={src} alt={alt} className={className} onError={() => setFailed(true)} />
}
