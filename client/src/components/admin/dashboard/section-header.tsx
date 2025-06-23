interface SectionHeaderProps {
  title: string;
  className?: string;
}

export function SectionHeader({ title, className = "" }: SectionHeaderProps) {
  return (
    <h2 className={`text-2xl font-semibold mb-4 ${className}`}>
      {title}
    </h2>
  );
}