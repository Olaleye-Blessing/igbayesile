interface LocationProps {
  type: string;
  text: string;
  updateLocation: (props: { type: string; value: string }) => void;
}

export default function Location({
  type,
  text,
  updateLocation,
}: LocationProps) {
  return (
    <button
      type="button"
      className="text-left text-sm truncate text-ellipsis overflow-hidden w-full max-w-28 text-primary underline"
      onClick={() => updateLocation({ type, value: text })}
    >
      {text}
    </button>
  );
}
