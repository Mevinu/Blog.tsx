import { useState, useEffect } from "react";
import { SideBar } from "../components/SideBar";
import DOMPurify from "dompurify";
import { Values } from "../components/Props";
import { useParams } from "react-router-dom";
import { TextEditor } from "../components/TextEditor";
import { MessageBox } from "../components/MessageBox";
import httpClient from "../httpClient";

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
  const [logged, setLogged] = useState(false);

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

  const checkUser = async () => {
    await httpClient
      .get("/api/checkuser")
      .then(function (response) {
        if (response.status == 200) {
          setLogged(true);
        }
      })
      .catch(function (error) {
        if (error.status == 401) {
          setLogged(false);
        }
      });
  };

  useEffect(() => {
    checkUser();
    if (edit) {
      fetchData();
    } else {
      setLoadingContent(true);
    }
  }, [edit]);

  const fetchData = async () => {
    await httpClient
      .get(article ? `/api/getarticle/${postID}` : `/api/getblog/${postID}`)
      .then(function (response) {
        if (response.data) {
          setValues(response.data);
          setLoadingContent(true);
          setFetchError(false);
        }
      })
      .catch(function (error) {
        if (error.status == 401 || error.status == 404) {
          setFetchError(true);
        }
      });
  };

  const sendData = async (data: FormData) => {
    await httpClient
      .post(
        edit
          ? article
            ? `/api/editarticle?postid=${postID}`
            : `/api/editblog?postid=${postID}`
          : article
          ? "/api/addarticle"
          : "/api/addblog",
        data
      )
      .then(function (response) {
        if (response.status == 200 && edit) {
          setMessage("Post Updated");
          setPostUpt(true);
        } else if (response.status == 200 && edit == false) {
          setMessage("Post Created");
          setPostSucc(true);
        }
      })
      .catch(function (error) {
        if (error.status == 406) {
          setMessage("Image type is invalied");
          setImageError(true);
        } else if (error.status == 401 || error.status == 404) {
          setFetchError(true);
        }
      });
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
    <>
      {logged ? (
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
      ) : (
        <h1>Unauthorized</h1>
      )}
    </>
  );
}
