interface IconProps {
  size?: number
  className?: string
}

const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.25,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: false,
}

export function ArrowUpRight({ size = 14, className }: IconProps) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 16 16" className={className}>
      <path d="M4 12 12 4M5.5 4H12v6.5" />
    </svg>
  )
}

export function ArrowRight({ size = 14, className }: IconProps) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 16 16" className={className}>
      <path d="M2.5 8h10M8.5 4l4 4-4 4" />
    </svg>
  )
}

export function ChevronDown({ size = 14, className }: IconProps) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 16 16" className={className}>
      <path d="m4 6.5 4 4 4-4" />
    </svg>
  )
}

export function CodeIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 16 16" className={className}>
      <path d="m5.2 4.2-3.1 3.8 3.1 3.8M10.8 4.2l3.1 3.8-3.1 3.8" />
    </svg>
  )
}

export function NetworkIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 16 16" className={className}>
      <circle cx="3" cy="8" r="1.4" />
      <circle cx="12.5" cy="3.4" r="1.4" />
      <circle cx="12.5" cy="12.6" r="1.4" />
      <path d="m4.3 7.3 6.9-3.2M4.3 8.7l6.9 3.2" />
    </svg>
  )
}

export function WaveIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 16 16" className={className}>
      <path d="M1.2 8h1.7l1.6-4.2L7 12l2-7 1.6 5 1.2-2h2.8" />
    </svg>
  )
}

export function GridIcon({ size = 16, className }: IconProps) {
  return (
    <svg {...base} width={size} height={size} viewBox="0 0 16 16" className={className}>
      <rect x="1.7" y="1.7" width="12.6" height="12.6" rx="1.4" />
      <path d="M6 1.7v12.6M10 1.7v12.6M1.7 6h12.6M1.7 10h12.6" />
    </svg>
  )
}
