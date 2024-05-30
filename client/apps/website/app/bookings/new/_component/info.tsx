interface InfoProps {
  label: string;
  body: string | number;
  className?: string;
}

export default function Info({ label, body, className }: InfoProps) {
  return (
    <p className={`flex flex-col ${className}`}>
      <span className="short-label text-base">{label}</span>
      <span>{body}</span>
    </p>
  );
}
