import { Link } from "react-router-dom";

export function HomeNav() {
  return (
    <nav>
      <Link to="/" className="back-btn">
        <i className="fa-solid fa-house"></i>
      </Link>
    </nav>
  );
}
