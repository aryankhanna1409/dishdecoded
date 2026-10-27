export function DemoBanner({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <p className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-2 text-sm text-amber-900">
      Demo mode: no API key is set, so you are seeing sample results. Add <code>ANTHROPIC_API_KEY</code> to decode real dishes.
    </p>
  );
}

export function ErrorNote({ message }: { message: string | null }) {
  if (!message) return null;
  return <p className="rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-800">{message}</p>;
}

export function Spinner({ label }: { label: string }) {
  return (
    <p className="flex items-center gap-2 text-stone-500 text-sm py-4">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
      {label}
    </p>
  );
}
