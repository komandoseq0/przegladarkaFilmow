import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Brak sesji" }, { status: 401 });

  const { movieId } = await req.json();
  const userId = (session.user as any).id;

  const existing = await prisma.watchedMovie.findFirst({
    where: { movieId, userId }
  });

  if (!existing) {
    await prisma.watchedMovie.create({
      data: { movieId, userId, rating: 0 }
    });
  }
  
  return NextResponse.json({ success: true });
}

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json([]);

  const userId = (session.user as any).id;

  const movies = await prisma.watchedMovie.findMany({
    where: { userId }
  });

  const formattedMovies = movies.map(movie => ({
    id: movie.movieId,
    rating: movie.rating
  }));

  return NextResponse.json(formattedMovies);
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Brak sesji" }, { status: 401 });

  const { movieId } = await req.json();
  const userId = (session.user as any).id;

  await prisma.watchedMovie.deleteMany({
    where: { movieId, userId }
  });

  return NextResponse.json({ success: true });
}

export async function PATCH(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Brak sesji" }, { status: 401 });

  const { movieId, rating } = await req.json();
  const userId = (session.user as any).id;

  await prisma.watchedMovie.updateMany({
    where: { movieId, userId },
    data: { rating }
  });

  return NextResponse.json({ success: true });
}