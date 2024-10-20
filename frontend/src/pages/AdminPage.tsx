import { useEffect, useState } from "react";
import { Articles, Blogs, Users } from "../components/Props";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import httpClient from "../httpClient";
import { Delete } from "../components/Delete";
import { AdminNav } from "../components/AdminNav";
import { MessageBox } from "../components/MessageBox";

export function AdminPage() {
  const [articles, setArticles] = useState<Articles[]>([]);
  const [blogs, setBlogs] = useState<Blogs[]>([]);
  const [users, setUsers] = useState<Users[]>([]);
  const [fetchError, setFetchError] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showBlogs, setShowBlogs] = useState(false);
  const [showArticles, setShowArticles] = useState(false);
  const [showUsers, setShowUsers] = useState(false);

  const fetchData = async () => {
    await httpClient
      .get("/api/admin")
      .then(function (response) {
        if (response.data != 0) {
          setArticles(response.data.articles);
          setBlogs(response.data.blogs);
        }
        if (response.data.users) {
          setIsAdmin(true);
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
        <>
          <AdminNav su={isAdmin}></AdminNav>
          <section className="container flex-container column-flex">
            <ul>
              <li>
                <h2
                  className="clickable-h2"
                  onClick={() => {
                    if (showArticles) {
                      setShowArticles(false);
                    } else {
                      setShowArticles(true);
                    }
                  }}
                >
                  Articles
                </h2>
                {showArticles && (
                  <>
                    {articles.length > 0 ? (
                      <>
                        {articles.map((article, index) => (
                          <div
                            key={index}
                            className="flex-container admin-card column-flex"
                          >
                            <div>
                              <p>{article.title}</p>
                              <p>{format(article.date, "MMMM do, yyyy")}</p>
                              <p>{article.author.userName}</p>
                            </div>
                            <Link
                              to={"/Edit/Article/" + article.id}
                              className="nav-button"
                            >
                              Edit
                            </Link>
                            <Delete
                              url={`/api/deletearticle?postid=${article.id}`}
                              submit={(success) => {
                                if (success) {
                                  setMessage("Action Comited");
                                } else {
                                  setMessage("Error Occured");
                                }
                              }}
                            ></Delete>
                          </div>
                        ))}
                      </>
                    ) : (
                      <p>No Articles Yet</p>
                    )}
                  </>
                )}
              </li>
              <li>
                <h2
                  className="clickable-h2"
                  onClick={() => {
                    if (showBlogs) {
                      setShowBlogs(false);
                    } else {
                      setShowBlogs(true);
                    }
                  }}
                >
                  Blogs
                </h2>
                {showBlogs && (
                  <>
                    {blogs.length > 0 ? (
                      <>
                        {blogs.map((blog, index) => (
                          <div
                            key={index}
                            className="flex-container admin-card column-flex"
                          >
                            <div>
                              <p>{blog.title}</p>
                              <p>{format(blog.date, "MMMM do, yyyy")}</p>
                              <p>{blog.author.userName}</p>
                            </div>
                            <Link
                              to={"/Edit/Blog/" + blog.id}
                              className="nav-button"
                            >
                              Edit
                            </Link>
                            <Delete
                              url={`/api/deleteblog?postid=${blog.id}`}
                              submit={(success) => {
                                if (success) {
                                  setMessage("Action Comited");
                                } else {
                                  setMessage("Error Occured");
                                }
                              }}
                            ></Delete>
                          </div>
                        ))}
                      </>
                    ) : (
                      <p>No Articles Yet</p>
                    )}
                  </>
                )}
              </li>
              {users.length > 0 && (
                <li>
                  <h2
                    className="clickable-h2"
                    onClick={() => {
                      if (showUsers) {
                        setShowUsers(false);
                      } else {
                        setShowUsers(true);
                      }
                    }}
                  >
                    Users
                  </h2>
                  <>
                    {showUsers && (
                      <>
                        {users.map((users, index) => (
                          <div
                            className="flex-container column-flex user-container"
                            key={index}
                          >
                            <p>Username :{users.userName}</p>
                            <p>Superuser :{users.su ? "True" : "False"}</p>
                            <Delete
                              url={`/api/deleteuser?userid=${users.userID}`}
                              submit={(success) => {
                                if (success) {
                                  setMessage("Action Comited");
                                } else {
                                  setMessage("Error Occured");
                                }
                              }}
                            />
                          </div>
                        ))}
                      </>
                    )}
                  </>
                </li>
              )}
            </ul>
          </section>
          {message != "" && (
            <MessageBox
              message={message}
              buttonMessage="Close"
              onClick={() => {
                setMessage("");
              }}
            ></MessageBox>
          )}
        </>
      )}
    </>
  );
}
