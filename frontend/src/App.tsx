import { useEffect, useState } from "react";
import { Home } from "./pages/Home";

function App() {
  const [blogs, setBlogs] = useState([]);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch("http://127.0.0.1:5000/");
    const data = await response.json();
    setBlogs(data.blogs);
    setArticles(data.articles);
  };

  return <Home blogs={blogs} articles={articles} />;
}

export default App;
