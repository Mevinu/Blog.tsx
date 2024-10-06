import { Articles } from "../pages/Home";
import { Link } from "react-router-dom";

interface Props {
  article: Articles;
}
export function Article({ article }: Props) {
  return (
    <div className="article-card flex-container column-flex">
      <div className="article-img" style={{ display: "block" }}></div>
      <h2 className="blog-title">{article.title}</h2>
      <p className="blog-author">{article.author.userName}</p>
      <p className="blog-date">{article.date}</p>
      <p className="blog-summary">{article.summary}</p>
      <Link to={"/Article/" + article.id} className="article-link link bold">
        Read More
      </Link>
    </div>
  );
}
