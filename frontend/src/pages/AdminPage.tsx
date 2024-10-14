import { useEffect, useState } from "react";
import { Articles, Blogs } from "./Home";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import httpClient from "../httpClient";

export function AdminPage() {
  const [articles, setArticles] = useState<Articles[]>([]);
  const [blogs, setBlogs] = useState<Blogs[]>([]);
  const [fetchError, setFetchError] = useState(false);

  const fetchData = async () => {
    try {
      const respose = await httpClient.get("/api/admin");
      const data = await respose.data;
      if (data.error) {
        setFetchError(true);
      } else {
        setArticles(data.articles);
        setBlogs(data.blogs);
        setFetchError(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <section className="container flex-container column-flex">
      {fetchError ? (
        <h1>Unauthorized</h1>
      ) : (
        <ul>
          <li>
            <h2>Articles</h2>
            {articles.length > 0 ? (
              <>
                {articles.map((article, index) => (
                  <div
                    key={index}
                    style={{ border: "solid 1px black" }}
                    className="flex-container"
                  >
                    <div>
                      <p>{article.title}</p>
                      <p>{format(article.date, "MMMM do, yyyy")}</p>
                    </div>
                    <Link
                      to={"/Edit/Article/" + article.id}
                      className="back-btn"
                    >
                      Edit
                    </Link>
                  </div>
                ))}
              </>
            ) : (
              <p>No Articles Yet</p>
            )}
          </li>
          <li>
            <h2>Blogs</h2>
            {blogs.length > 0 ? (
              <>
                {blogs.map((blog, index) => (
                  <div
                    key={index}
                    style={{ border: "solid 1px black" }}
                    className="flex-container"
                  >
                    <div>
                      <p>{blog.title}</p>
                      <p>{format(blog.date, "MMMM do, yyyy")}</p>
                    </div>
                    <Link to={"/Edit/Blog/" + blog.id} className="back-btn">
                      Edit
                    </Link>
                  </div>
                ))}
              </>
            ) : (
              <p>No Articles Yet</p>
            )}
          </li>
          <li>
            <h2>Users</h2>
          </li>
        </ul>
      )}
    </section>
  );
}
