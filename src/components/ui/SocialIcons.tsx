interface IconProps {
  className?: string;
}

export function InstagramIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function TikTokIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.63c.3 0 .58.05.85.13V9.4a6.34 6.34 0 0 0-6.04 6.34 6.34 6.34 0 0 0 6.34 6.34c3.48 0 6.32-2.82 6.34-6.3V8.89a8.28 8.28 0 0 0 4.62 1.41V6.85c-.71-.01-1.39-.06-2.03-.16z" />
    </svg>
  );
}

export function SpotifyIcon({ className = 'w-4 h-4' }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424a.627.627 0 0 1-.861.208c-2.357-1.44-5.325-1.766-8.82-0.967a.627.627 0 1 1-.28-1.223c3.824-.874 7.103-.497 9.753 1.121a.627.627 0 0 1 .208.861zm1.226-2.724a.786.786 0 0 1-1.08.258c-2.698-1.658-6.812-2.138-10.003-1.17a.786.786 0 1 1-.454-1.503c3.645-1.106 8.196-.572 11.28 1.334a.786.786 0 0 1 .257 1.081zm.105-2.835C14.692 8.94 9.37 8.766 6.29 9.7a.944.944 0 1 1-.548-1.805c3.542-1.075 9.434-.872 13.19 1.36a.944.944 0 0 1-.954 1.628l-.066-.018z" />
    </svg>
  );
}
