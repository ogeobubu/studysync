import { cn } from '../lib/utils';

interface AcademicConnectLogoProps {
  className?: string;
}

export default function AcademicConnectLogo({ className }: AcademicConnectLogoProps) {
  return (
    <svg
      className={cn('text-blue-600', className)}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24 42C33.9411 42 42 33.9411 42 24C42 14.0589 33.9411 6 24 6C14.0589 6 6 14.0589 6 24C6 33.9411 14.0589 42 24 42Z"
        fill="currentColor"
        fillOpacity="0.1"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M24 16L30 22L24 28L18 22L24 16Z"
        fill="currentColor"
      />
      <path
        d="M24 32V38"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}