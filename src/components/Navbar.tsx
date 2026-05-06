import Link from "next/link";
import "./navbar.css";

export default function Navbar() {
  return (
      <nav>
        <div className="search">
          <input type="text" />
          <button>Lupa</button>
        </div>
      </nav>
  );
}