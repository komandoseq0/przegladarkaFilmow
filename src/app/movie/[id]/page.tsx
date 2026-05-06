export default async function MovieDetails({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const resolvedParams = await params;
  const movieId = resolvedParams.id;

  return (
    <div>
      <h1>Details for Movie ID: {movieId}</h1>
      {/* Tutaj za chwilę dodasz pobieranie konkretnego filmu! */}
    </div>
  );
}