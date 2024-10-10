import { useState, useEffect } from "react";
import { SideBar } from "../components/SideBar";
import DOMPurify from "dompurify";
import { Values } from "../components/SideBar";
import { useParams } from "react-router-dom";
import { TextEditor } from "../components/TextEditor";
import { MessageBox } from "../components/MessageBox";

interface Props {
  article: boolean;
  edit: boolean;
}

export function EditPage({ article, edit }: Props) {
  const [values, setValues] = useState<Values | null>(null);
  const [error, setError] = useState(0);
  const { id } = useParams<{ id: string }>();
  const postID = id ? parseInt(id, 10) : null;
  const [blogContent, setBlogContent] = useState("");
  const [loadingContent, setLoadingContent] = useState(false);

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (edit) {
      fetchData();
    } else {
      setLoadingContent(true);
    }
  }, [edit]);

  const fetchData = async () => {
    try {
      const response = await fetch(
        article
          ? "http://127.0.0.1:5000/article/" + postID
          : "http://127.0.0.1:5000/blog/" + postID
      );
      const data = await response.json();
      if (data == 0) {
        setError(1);
      } else {
        setValues(data);
        setLoadingContent(true);
        setError(0);
      }
    } catch (err) {
      setError(1);
    }
  };

  const sendData = async (data: FormData) => {
    try {
      const response = await fetch(
        article
          ? "http://127.0.0.1:5000/addarticle"
          : "http://127.0.0.1:5000/addblog",
        {
          method: "POST",

          body: data,
        }
      );
      const result = await response.json();
      if (result == 1) {
        setMessage("Post Created");
        setError(2);
      } else if (result == 3) {
        setMessage("Image type is invalied");
        setError(2);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (content: Values) => {
    if (
      content.title.trim() != "" &&
      content.summary.trim() != "" &&
      blogContent.replace(/<[^>]+>/g, "").trim() != ""
    ) {
      const formData = new FormData();

      const jsonData: Values = {
        title: DOMPurify.sanitize(content.title ?? ""),
        summary: DOMPurify.sanitize(content.summary ?? ""),
        content: DOMPurify.sanitize(blogContent ?? ""),
        author: 1,
      };
      if (content.imageUrl) {
        jsonData.imageUrl = DOMPurify.sanitize(content.imageUrl);
      }

      formData.append("json", JSON.stringify(jsonData));
      if (content.image) {
        formData.append("image", content.image);
      }

      sendData(formData);
    } else {
      setMessage("Please fill all the fields");
      setError(2);
    }
  };

  if (error == 1) {
    return <h1>Error fetching data</h1>;
  }

  return (
    <section className="admin-container flex-container flex-gap30">
      <SideBar
        onSubmit={handleSubmit}
        preDefValues={values ?? undefined}
        article={article}
      />
      {loadingContent ? (
        <TextEditor
          onChange={setBlogContent}
          content={values?.content}
        ></TextEditor>
      ) : null}
      {error == 2 ? (
        <MessageBox
          message={message}
          buttonMessage="Close"
          onClick={() => {
            setError(0);
          }}
        ></MessageBox>
      ) : null}
    </section>
  );
}
