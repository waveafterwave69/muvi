import type { FC } from 'react'

interface DefaultAvatarProps {
  className?: string
}

const DefaultAvatar: FC<DefaultAvatarProps> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 240 240"
    role="img"
    aria-label="Аватар профиля по умолчанию"
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="avatar-surface" x1="24" y1="14" x2="216" y2="226">
        <stop stopColor="var(--surface-soft)" />
        <stop offset="1" stopColor="var(--surface-raised)" />
      </linearGradient>
      <linearGradient id="avatar-accent" x1="70" y1="54" x2="180" y2="210">
        <stop stopColor="var(--accent-soft)" />
        <stop offset="1" stopColor="var(--accent)" />
      </linearGradient>
    </defs>

    <rect width="240" height="240" fill="url(#avatar-surface)" />

    <circle cx="198" cy="36" r="62" fill="var(--accent)" opacity="0.1" />
    <circle cx="27" cy="214" r="78" fill="var(--accent-soft)" opacity="0.08" />

    <g fill="none" stroke="var(--text-muted)" strokeWidth="2" opacity="0.16">
      <path d="M-8 52 248 8" />
      <path d="M-2 72 244 30" />
      <rect x="18" y="49" width="22" height="14" rx="3" transform="rotate(-10 18 49)" />
      <rect x="54" y="43" width="22" height="14" rx="3" transform="rotate(-10 54 43)" />
      <rect x="90" y="37" width="22" height="14" rx="3" transform="rotate(-10 90 37)" />
    </g>

    <circle cx="120" cy="92" r="43" fill="var(--card-bg)" stroke="var(--card-border-color)" strokeWidth="2" />
    <circle cx="120" cy="92" r="34" fill="url(#avatar-accent)" opacity="0.92" />
    <path
      d="M45 224c2-51 31-84 75-84s73 33 75 84H45Z"
      fill="var(--card-bg)"
      stroke="var(--card-border-color)"
      strokeWidth="2"
    />
    <path d="M56 224c3-44 27-73 64-73s61 29 64 73H56Z" fill="url(#avatar-accent)" opacity="0.92" />

    <g transform="translate(150 154)">
      <circle cx="28" cy="28" r="30" fill="var(--surface)" stroke="var(--card-border-color)" strokeWidth="2" />
      <g fill="none" stroke="var(--accent)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4">
        <path d="m11 18 32-7 2 9-32 7-2-9Z" fill="var(--accent-hover-alt)" />
        <path d="m14 27 32-7 5 23-32 7-5-23Z" fill="var(--accent-hover)" />
        <path d="m18 16 8 8M31 13l8 8M21 34l26-6" />
      </g>
    </g>

    <circle cx="205" cy="91" r="3" fill="var(--accent-soft)" opacity="0.75" />
    <circle cx="35" cy="117" r="4" fill="var(--accent)" opacity="0.48" />
  </svg>
)

export default DefaultAvatar
