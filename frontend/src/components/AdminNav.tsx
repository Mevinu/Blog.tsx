import { Link } from "react-router-dom";
import { LogOut } from "./LogOut";

interface Props {
  su: boolean;
}

export function AdminNav({ su }: Props) {
  return (
    <>
      <nav className="admin-nav">
        <ul className="flex-container centerd-flex flex-gap30">
          <li>
            <LogOut></LogOut>
          </li>
          <li>
            <Link to="/Add/Blog" className="nav-button">
              Add Blog
            </Link>
          </li>
          <li>
            <Link to="/Add/Article" className="nav-button">
              Add Article
            </Link>
          </li>
          {su && (
            <li>
              <Link to="/Createuser" className="nav-button">
                Create User
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </>
  );
}
