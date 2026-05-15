import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) return NextResponse.json({ isToWatch: false, isWatched: false });

  const userId = (session.user as any).id;

  const { searchParams } = new URL(req.url);
  const movieIdString = searchParams.get("movieId");
  
  if (!movieIdString) return NextResponse.json({ isToWatch: false, isWatched: false });
  const movieId = parseInt(movieIdString);

  const inToWatch = await prisma.movieToWatch.findFirst({ where: { movieId, userId } });
  const inWatched = await prisma.watchedMovie.findFirst({ where: { movieId, userId } });

  return NextResponse.json({
    isToWatch: inToWatch ? true : false,
    isWatched: inWatched ? true : false
  });
}