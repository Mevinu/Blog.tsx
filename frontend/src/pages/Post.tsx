import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Blogs } from "../components/Props";
import { HomeNav } from "../components/HomeNav";
import { format } from "date-fns";
import "quill/dist/quill.core.css";

interface Props {
  blog: boolean;
}

export function Post({ blog }: Props) {
  const { id } = useParams<{ id: string }>();
  const postID = id ? parseInt(id, 10) : null;

  const [post, setPost] = useState<Blogs>();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await fetch(
      blog
        ? "http://127.0.0.1:5000/blog/" + postID
        : "http://127.0.0.1:5000/article/" + postID
    );
    const data = await response.json();
    setPost(data);
  };

  return (
    <>
      <HomeNav url="/"></HomeNav>
      {post ? (
        <>
          <section className="hero-section flex-container centerd-flex column-flex">
            <h1>{post.title}</h1>
            <p>{post.author.userName}</p>
            <p>{format(post.date, "MMMM do, yyyy")}</p>
          </section>
          <section className="content flex-container centerd-flex">
            <div className="container flex-container column-flex flex-gap30">
              <p
                dangerouslySetInnerHTML={{ __html: post.content }}
                className="ql-editor"
              />
            </div>
          </section>
        </>
      ) : (
        <section className="hero-section flex-container centerd-flex column-flex">
          <h1>Invalid Post Number</h1>
        </section>
      )}
    </>
  );
}
