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
  const { id } = useParams<{ id: string }>();
  const postID = id ? parseInt(id, 10) : null;
  const [blogContent, setBlogContent] = useState("");
  const [loadingContent, setLoadingContent] = useState(false);

  const [message, setMessage] = useState("");

  //error codes
  //1 = fetching error
  //2 = post created
  //3 = post updates
  //4 = image type invalied
  //5 = title empty
  //6 = summary empty
  //7 = content empty
  const [fetchError, setFetchError] = useState(false);
  const [postSucc, setPostSucc] = useState(false);
  const [postUpt, setPostUpt] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [summaryError, setSummaryError] = useState(false);
  const [contentError, setContentError] = useState(false);

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
        setFetchError(true);
      } else {
        setValues(data);
        setLoadingContent(true);
        setFetchError(false);
      }
    } catch (err) {
      setFetchError(true);
    }
  };

  const sendData = async (data: FormData) => {
    try {
      var url = "";
      if (edit) {
        url = article
          ? "http://127.0.0.1:5000/editarticle?postid=" + postID
          : "http://127.0.0.1:5000/editblog?postid=" + postID;
      } else {
        url = article
          ? "http://127.0.0.1:5000/addarticle"
          : "http://127.0.0.1:5000/addblog";
      }
      const response = await fetch(url, {
        method: "POST",

        body: data,
      });
      const result = await response.json();
      if (result == 1 && edit == false) {
        setMessage("Post Created");
        setPostSucc(true);
      } else if (result == 1 && edit) {
        setMessage("Post Updated");
        setPostUpt(false);
      } else if (result == 3) {
        setMessage("Image type is invalied");
        setImageError(true);
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
      if (content.imageURL) {
        jsonData.imageURL = DOMPurify.sanitize(content.imageURL);
      }

      formData.append("json", JSON.stringify(jsonData));
      if (content.image) {
        formData.append("image", content.image);
      }

      sendData(formData);
    } else {
      if (content.title.trim() == "") {
        setTitleError(true);
      } else {
        setTitleError(false);
      }
      if (content.summary.trim() == "") {
        setSummaryError(true);
      } else {
        setSummaryError(false);
      }
      if (blogContent.replace(/<[^>]+>/g, "").trim() == "") {
        setContentError(true);
      } else {
        setContentError(false);
      }
    }
  };

  if (fetchError) {
    return <h1>Error fetching data</h1>;
  }

  return (
    <section className="admin-container flex-container flex-gap30">
      <SideBar
        titleError={titleError}
        summaryError={summaryError}
        onSubmit={handleSubmit}
        preDefValues={values ?? undefined}
        article={article}
      />
      {loadingContent ? (
        <TextEditor
          warning={contentError}
          onChange={setBlogContent}
          content={values?.content}
        ></TextEditor>
      ) : null}
      {postSucc || postUpt || imageError ? (
        <MessageBox
          message={message}
          buttonMessage="Close"
          onClick={() => {
            setPostSucc(false);
            setPostUpt(false);
            setImageError(false);
          }}
        ></MessageBox>
      ) : null}
    </section>
  );
}
