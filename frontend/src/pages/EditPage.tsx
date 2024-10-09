import { useState, useEffect } from "react";
import { EditorPage } from "../components/EditorPage";
import DOMPurify from "dompurify";
import { Values } from "../components/EditorPage";
import { useParams } from "react-router-dom";

interface Props {
  article: boolean;
  edit: boolean;
}

export function EditPage({ article, edit }: Props) {
  const [values, setValues] = useState<Values | null>(null);
  const [error, setError] = useState<boolean>(false);
  const { id } = useParams<{ id: string }>();
  const postID = id ? parseInt(id, 10) : null;

  useEffect(() => {
    if (edit) {
      fetchData();
    }
  }, [edit]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        article
          ? "http://127.0.0.1:5000/blog/" + postID
          : "http://127.0.0.1:5000/article/" + postID
      );
      const data = await response.json();
      if (data == 0) {
        setError(true);
      } else {
        setValues(data);
        setError(false);
      }
    } catch (err) {
      setError(true);
    }
  };

  const handleSubmit = (content: Values) => {
    setValues({
      title: DOMPurify.sanitize(content.title ?? ""),
      summary: DOMPurify.sanitize(content.summary ?? ""),
      content: DOMPurify.sanitize(content.content ?? ""),
      image: content.image ?? undefined,
      imageUrl: content.imageUrl ? DOMPurify.sanitize(content.imageUrl) : ".",
    });
  };

  if (error) {
    return <h1>Error fetching data</h1>;
  }

  return (
    <section className="admin-container">
      <EditorPage
        onSubmit={handleSubmit}
        preDefValues={values ?? undefined}
        article={article}
      />
    </section>
  );
}
