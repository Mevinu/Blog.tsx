import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import React from "react";

interface Props {
  onChange: (content: string) => void;
}

export function Editor({ onChange }: Props) {
  const modules = {
    toolbar: [
      ["bold", "italic", "underline"],

      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],

      ["link"],
    ],
  };

  const { quill, quillRef } = useQuill({ modules: modules });

  React.useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        onChange(quill.root.innerHTML);
      });
    }
  }, [quill]);

  return (
    <div className="text-editor">
      <div ref={quillRef} className="editor-section" />
    </div>
  );
}
