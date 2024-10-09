import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export interface Values {
  title: string;
  summary: string;
  image?: File;
  imageUrl?: string;
  content?: string;
}

interface Props {
  preDefValues?: Values;
  article?: boolean;
  onSubmit: (values: Values) => void;
}

export function SideBar({ preDefValues, article, onSubmit }: Props) {
  const [values, setValues] = useState<Values>(
    preDefValues ? preDefValues : { title: "", summary: "" }
  );

  useEffect(() => {
    if (preDefValues) {
      setValues(preDefValues);
    }
  }, [preDefValues]);

  const handleSubmit = () => {
    onSubmit(values);
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
  );
}
