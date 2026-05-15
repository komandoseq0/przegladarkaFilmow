import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Brak sesji" }, { status: 401 });

  const { movieId } = await req.json();
  const userId = (session.user as any).id;

  const existing = await prisma.movieToWatch.findFirst({
    where: { movieId, userId }
  });

  if (existing) {
    await prisma.watchedMovie.delete({ where: { id: existing.id } });
    return NextResponse.json({ action: "removed" });
  } else {
    await prisma.watchedMovie.create({
      data: { movieId, userId }
    });
    return NextResponse.json({ action: "added" });
  }
}