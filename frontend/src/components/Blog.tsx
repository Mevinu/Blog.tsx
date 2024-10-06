import { Blogs } from "../pages/Home";
import { Link } from "react-router-dom";

interface Porps {
  blog: Blogs;
}

export function Blog({ blog }: Porps) {
  return (
    <div className="blog-card flex-container column-flex">
      <h2 className="blog-title">{blog.title}</h2>
      <p className="blog-author">{blog.author.userName}</p>
      <p className="blog-date">{blog.date}</p>
      <p className="blog-summary">{blog.summary}</p>
      <Link to={"/Blog/" + blog.id} className="link bold">
        Read More
      </Link>
    </div>
  );
}
