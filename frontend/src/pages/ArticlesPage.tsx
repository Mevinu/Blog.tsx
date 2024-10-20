import { useState, useEffect } from "react";
import { Article } from "../components/Article";
import { HomeNav } from "../components/HomeNav";

export function ArticlesPage() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch("http://127.0.0.1:5000/allarticles");
    const data = await response.json();
    setArticles(data);
  };

  return (
    <>
      <HomeNav url="/"></HomeNav>
      <section className="hero-section flex-container centerd-flex">
        <h1>All Articles</h1>
      </section>

      <section className="content flex-container centerd-flex">
        <div className="container flex-container">
          {articles.length > 0 ? (
            <div className="card-container grid-container">
              {articles.map((article, index) => (
                <Article article={article} key={index}></Article>
              ))}
            </div>
          ) : (
            <p>No Articles Yet</p>
          )}
        </div>
      </section>
    </>
  );
}
