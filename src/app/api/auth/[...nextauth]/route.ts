import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/src/lib/prisma";
import bcrypt from "bcrypt";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Konto",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Hasło", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) return null;

        const passwordsMatch = await bcrypt.compare(credentials.password, user.password);
        if (!passwordsMatch) return null;

        return { id: user.id, email: user.email };
      }
    })
  ],
  session: { strategy: "jwt" },
});

export { handler as GET, handler as POST };