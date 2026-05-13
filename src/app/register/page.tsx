"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "./register.css";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Hasła nie są zgodne!");
      setIsLoading(false);
      return;
    }

    const response = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) router.push("/login/")
    else {
        const data = await response.json(); 
        setError(data.error);
    }

    setIsLoading(false);
  };

  return (
    <div className="register-page-container">
      <div className="terminal-box">
        <div className="terminal-header">
          <span className="terminal-title">
            SYS.REJESTRACJA_NOWEGO_UŻYTKOWNIKA_V1.0
          </span>
          <div className="terminal-controls">
            <span className="control-dot"></span>
            <span className="control-dot"></span>
          </div>
        </div>

        <form className="terminal-body" onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">{">"} ZDEFINIUJ_IDENTYFIKATOR_EMAIL:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="terminal-input"
              required
              placeholder="operator@sys.pl"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">{">"} USTAL_KLUCZ_DOSTĘPU:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="terminal-input"
              required
              placeholder="********"
            />
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword">
              {">"} POWTÓRZ_KLUCZ_DOSTĘPU:
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="terminal-input"
              required
              placeholder="********"
            />
          </div>

          {error && (
            <div className="terminal-error">[ KRYTYCZNY_BŁĄD: {error} ]</div>
          )}

          <div className="register-actions">
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading
                ? "[ GENEROWANIE_PROFILU... ]"
                : "[ UTWÓRZ_PROFIL_OPERATORA ]"}
            </button>
          </div>

          <div className="terminal-footer">
            <span>MASZ JUŻ UPRAWNIENIA?</span>
            <Link href="/login" className="terminal-link">
              [ POWRÓT_DO_LOGOWANIA ]
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
