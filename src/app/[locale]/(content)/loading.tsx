export default function Loading() {
  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'grid',
        placeItems: 'center',
        color: 'var(--accent)',
        letterSpacing: '0.4em',
        fontFamily: 'var(--font-mono)',
      }}
      aria-label="Loading"
    >
      ◇ ◇ ◇
    </div>
  );
}
