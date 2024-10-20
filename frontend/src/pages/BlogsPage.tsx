import { useState, useEffect } from "react";
import { Blog } from "../components/Blog";
import { HomeNav } from "../components/HomeNav";

export function BlogsPage() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch("http://127.0.0.1:5000/allblogs");
    const data = await response.json();
    setBlogs(data);
  };

  return (
    <>
      <HomeNav url="/"></HomeNav>
      <section className="hero-section flex-container centerd-flex">
        <h1>All Blogs</h1>
      </section>
      <section className="content flex-container centerd-flex">
        <div className="container flex-container">
          <div className="card-container flex-container column-flex blog-container">
            {blogs.length > 0 ? (
              <>
                {blogs.map((blog, index) => (
                  <Blog blog={blog} key={index}></Blog>
                ))}
              </>
            ) : (
              <p>No Posts Yet</p>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
