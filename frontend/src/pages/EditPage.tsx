import { useState } from "react";
import { EditorPage } from "../components/EditorPage";
import DOMPurify from "dompurify";
import { Values } from "../components/EditorPage";

interface Props {
  article: boolean;
}

export function EditPage({ article }: Props) {
  const [values, setValues] = useState<Values>();

  return (
    <section className="admin-container">
      <EditorPage
        onSubmit={(content) => {
          setValues({
            title: DOMPurify.sanitize(content.title ?? ""),
            summary: DOMPurify.sanitize(content.summary ?? ""),
            content: DOMPurify.sanitize(content.content ?? ""),
            image: content.image ?? undefined,
            imageUrl: content.imageUrl
              ? DOMPurify.sanitize(content.imageUrl)
              : ".",
          });
        }}
        preDefValues={{
          title: "Test",
          content: "Test",
          summary: "",
          imageUrl: "./src/assets/react.svg",
        }}
        article={article}
      ></EditorPage>
    </section>
  );
}
