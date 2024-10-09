import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Editor } from "./TextEditor";
import { ErrorBox } from "./ErrorBox";

export interface Values {
  title: string;
  summary: string;
  image?: File;
  imageUrl?: string;
  content: string;
}

interface Props {
  preDefValues?: Values;
  article?: boolean;
  onSubmit: (values: Values) => void;
}

export function EditorPage({ preDefValues, article, onSubmit }: Props) {
  const [values, setValues] = useState<Values>(
    preDefValues ? preDefValues : { title: "", summary: "", content: "" }
  );
  const [error, setError] = useState(false);
  useEffect(() => {
    if (preDefValues) {
      setValues(preDefValues);
    }
  }, [preDefValues]);

  const handleSubmit = () => {
    if (
      values.title.trim() != "" &&
      values.summary.trim() != "" &&
      values.content.replace(/<[^>]+>/g, "").trim() != ""
    ) {
      onSubmit(values);
    } else {
      setError(true);
      //console.log(1);
    }
  };
  const handleInput = (
    element: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setValues((prevValues) => ({
      ...prevValues,
      [element.target.name]: element.target.value,
    }));
  };

  return (
    <div className="flex-container flex-gap30" style={{ width: "100%" }}>
      <div className="side-bar flex-container column-flex">
        <Link to="/" className="back-btn editor-homebtn">
          <i className="fa-solid fa-house"></i>
        </Link>
        <p>Title</p>
        <input
          type="text"
          name="title"
          value={values.title}
          placeholder="Enter Text"
          onChange={handleInput}
        />
        <p>Summary</p>
        <textarea
          name="summary"
          placeholder="Enter Text"
          value={values.summary}
          onChange={handleInput}
        />
        {article && (
          <>
            <label
              htmlFor="image"
              className="button admin-button flex-container centerd-flex"
            >
              Upload Image
            </label>
            <input
              type="file"
              name="image"
              id="image"
              onChange={(element) => {
                const imgFile = element.target.files?.[0];
                if (imgFile) {
                  const objectUrl = URL.createObjectURL(imgFile);
                  setValues((prevValues) => ({
                    ...prevValues,
                    imageUrl: objectUrl,
                    image: element.target.files?.[0],
                  }));
                }
              }}
            />
            {values.imageUrl != "." && values.imageUrl ? (
              <>
                <div
                  className="sidebar-image"
                  style={{ backgroundImage: `url(${values.imageUrl})` }}
                />
                <button
                  className="button-1 admin-button"
                  onClick={() => {
                    setValues((prevValues) => ({
                      ...prevValues,
                      imageUrl: ".",
                    }));
                  }}
                >
                  Remove Image
                </button>
              </>
            ) : null}
          </>
        )}

        <button className="button bold admin-button" onClick={handleSubmit}>
          Publish
        </button>
      </div>
      <Editor
        onChange={(content) => {
          setValues((prevValues) => ({ ...prevValues, content: content }));
        }}
        content={values.content}
      ></Editor>
      {error && (
        <ErrorBox
          onClick={() => {
            setError(false);
          }}
          message="Please fill all the text feilds"
          buttonMessage="Close"
        ></ErrorBox>
      )}
    </div>
  );
}
