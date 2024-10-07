import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Values {
  title: string;
  summary: string;
  image?: File;
  imageUrl?: string;
}

interface Props {
  preDefValues?: Values;
  article?: boolean;
  onSubmit: (values: Values) => void;
}

export function SideBar({ preDefValues, onSubmit, article }: Props) {
  const [values, setValues] = useState<Values>({
    title: "",
    summary: "",
  });

  useEffect(() => {
    if (preDefValues) {
      setValues(preDefValues);
    }
  }, [preDefValues]);

  const handleInputChange = (
    element: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = element.target;
    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
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
        placeholder="Enter Text"
        value={values.title}
        onChange={handleInputChange}
      />
      <p>Summary</p>
      <textarea
        name="summary"
        placeholder="Enter Text"
        value={values.summary}
        onChange={handleInputChange}
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
                setValues((prevValues) => ({
                  ...prevValues,
                  imageUrl: URL.createObjectURL(imgFile),
                  image: imgFile,
                }));
              }
            }}
          />
        </>
      )}
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
      <div className="sidebar-footer flex-container column-flex">
        <button
          className="button bold admin-button"
          onClick={() => onSubmit(values)}
        >
          Publish
        </button>
      </div>
    </div>
  );
}
