import { Link } from "react-router-dom";

interface Props {
  url: string;
}
export function HomeNav({ url }: Props) {
  return (
    <nav>
      <Link to={url} className="back-btn">
        <i className="fa-solid fa-house"></i>
      </Link>
    </nav>
  );
}
