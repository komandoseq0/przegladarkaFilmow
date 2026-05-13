import { NextResponse } from "next/server";
import { prisma } from "@/src/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json({ message: "Konto utworzone" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Błąd rejestracji (może email jest już zajęty?)" }, { status: 500 });
  }
}