import { useQuill } from "react-quilljs";
import "quill/dist/quill.snow.css";
import React from "react";

interface Props {
  onChange: (content: string) => void;
}

export function Editor({ onChange }: Props) {
  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],

      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],

      ["link", "image"],
    ],
  };

  const { quill, quillRef } = useQuill({ modules: modules });

  React.useEffect(() => {
    if (quill) {
      quill.on("text-change", () => {
        //console.log(quill.getText()); // Get text only
        //console.log(quill.getContents()); // Get delta contents
        //console.log(quill.root.innerHTML); // Get innerHTML using quill
        //console.log(quillRef.current.firstChild.innerHTML); // Get innerHTML using quillRef
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
