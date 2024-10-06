import { Article } from "../components/Article";
import { Blog } from "../components/Blog";
import { Link } from "react-router-dom";

export interface Author {
  authorID: number;
  userID: number;
  userName: string;
}

export interface Blogs {
  author: Author;
  content: string;
  id: number;
  date: string;
  summary: string;
  title: string;
}
export interface Articles {
  id: number;
  title: string;
  summary: string;
  date: string;
  content: string;
  author: Author;
  image: string;
}

interface Props {
  blogs: Blogs[];
  articles: Articles[];
}

export function Home({ blogs, articles }: Props) {
  return (
    <>
      <section className="hero-section flex-container centerd-flex">
        <h1>Welcome To Mevinu's Blog</h1>
      </section>
      <section className="content flex-container centerd-flex">
        <div className="container flex-container">
          <p className="bold section-title">Latest Blogs</p>
          <div className="card-container flex-container column-flex blog-container">
            {blogs.length > 0 ? (
              <>
                {blogs.map((blog, index) => (
                  <Blog blog={blog} key={index}></Blog>
                ))}

                <Link to="/Blogs" className="button bold">
                  View All Blogs
                </Link>
              </>
            ) : (
              <p>No Posts Yet</p>
            )}
          </div>
        </div>
      </section>
      <section className="content flex-container centerd-flex">
        <div className="container flex-container">
          <p className="bold section-title">Articles</p>
          <div className="container flex-container column-flex flex-gap30">
            {articles.length > 0 ? (
              <>
                <div className="card-container grid-container">
                  {articles.map((article, index) => (
                    <Article article={article} key={index}></Article>
                  ))}
                </div>
              </>
            ) : (
              <p>No Articles Yet</p>
            )}

            <Link to="/Articles" className="button bold">
              View All Articles
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
