"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./login.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error === "CredentialsSignin") setError("Nie poprawny email lub hasło");
    if (!result?.error) router.push("/");
  };

  return (
    <div className="login-page-container">
      <div className="terminal-box">
        <div className="terminal-header">
          <span className="terminal-title">SYS.LOGOWANIE_V1.0</span>
          <div className="terminal-controls">
            <span className="control-dot"></span>
            <span className="control-dot"></span>
          </div>
        </div>

        <form className="terminal-body" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">{">"} Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="terminal-input"
              required
              placeholder="..."
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">{">"} Hasło:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="terminal-input"
              required
              placeholder="..."
            />
          </div>

          {error && <div className="terminal-error">[ BŁĄD: {error} ]</div>}

          <div className="login-actions">
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? "[ PROCESOWANIE... ]" : "[ WYKONAJ_LOGOWANIE ]"}
            </button>
          </div>

          <div className="terminal-footer">
            <span>NIE MASZ KONTA?</span>
            <Link href="/register" className="terminal-link">
              [ UTWÓRZ_NOWY_PROFIL ]
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}