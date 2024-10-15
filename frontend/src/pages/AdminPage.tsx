import { useEffect, useState } from "react";
import { Articles, Blogs, Users } from "../components/Props";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import httpClient from "../httpClient";
import { LogOut } from "../components/LogOut";
import { Delete } from "../components/Delete";

export function AdminPage() {
  const [articles, setArticles] = useState<Articles[]>([]);
  const [blogs, setBlogs] = useState<Blogs[]>([]);
  const [users, setUsers] = useState<Users[]>([]);
  const [fetchError, setFetchError] = useState(false);

  const fetchData = async () => {
    await httpClient
      .get("/api/admin")
      .then(function (response) {
        if (response.data != 0) {
          setArticles(response.data.articles);
          setBlogs(response.data.blogs);
        }
        if (response.data.users) {
          setUsers(response.data.users);
        }
        setFetchError(false);
      })
      .catch(function (error) {
        if (error.response) {
          if (error.response.status == 401) {
            setFetchError(true);
          }
        }
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {fetchError ? (
        <h1>Unauthorized</h1>
      ) : (
        <section className="container flex-container column-flex">
          <ul>
            <LogOut></LogOut>
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
                      <Delete
                        url={`/api/deletearticle?postid=${article.id}`}
                        submit={(success) => {
                          if (success) {
                            alert(1);
                          } else {
                            alert(0);
                          }
                        }}
                      ></Delete>
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
                      <Delete
                        url={`/api/deleteblog?postid=${blog.id}`}
                        submit={(success) => {
                          if (success) {
                            alert(1);
                          } else {
                            alert(0);
                          }
                        }}
                      ></Delete>
                    </div>
                  ))}
                </>
              ) : (
                <p>No Articles Yet</p>
              )}
            </li>
            {users.length > 0 && (
              <li>
                <h2>Users</h2>
                <>
                  {users.map((users, index) => (
                    <div className="flex-container" key={index}>
                      <p>{users.userID}</p>
                      <p>{users.userName}</p>
                      <p>{users.su ? "True" : "False"}</p>
                    </div>
                  ))}
                </>
              </li>
            )}
          </ul>
        </section>
      )}
    </>
  );
}
