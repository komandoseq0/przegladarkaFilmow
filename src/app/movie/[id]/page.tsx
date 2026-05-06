export default async function MovieDetails({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = await params;
  const movieId = resolvedParams.id;

  return (
    <div className="industrial-container" style={{ padding: '2rem', backgroundColor: 'var(--surface-color)', border: '1px solid var(--border-color)' }}>
      <h1 style={{ color: 'var(--accent-color)' }}>Details for Movie ID: {movieId}</h1>
      {/* Tutaj za chwilę dodasz pobieranie konkretnego filmu! */}
    </div>
  );
}