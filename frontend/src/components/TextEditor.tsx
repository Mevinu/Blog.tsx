import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import React from "react";

interface Props {
  onChange: (content: string) => void;
  content?: string;
  warning: boolean;
}

export function TextEditor({ onChange, content, warning }: Props) {
  const modules = {
    toolbar: [
      ["bold", "italic", "underline"],

      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],

      ["link"],
    ],
  };

  const { quill, quillRef } = useQuill({
    modules: modules,
    placeholder: "Enter Text",
  });

  React.useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        onChange(quill.root.innerHTML);
      });
      if (content) {
        quill.clipboard.dangerouslyPasteHTML(content);
      }
    }
  }, [quill]);

  return (
    <div className="flex-container column-flex" style={{ width: "100%" }}>
      {warning && <p className="warning">Please fill the following field</p>}
      <div className="text-editor">
        <div ref={quillRef} className="editor-section" />
      </div>
    </div>
  );
}
