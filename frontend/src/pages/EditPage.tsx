import { Editor } from "../components/Editor";
import { SideBar } from "../components/SideBar";

export function EditPage() {
  return (
    <section className="admin-container flex-container flex-gap30">
      <SideBar
        onSubmit={console.log}
        preDefValues={{
          title: "test",
          summary: "test",
          imageUrl: "./src/assets/react.svg",
        }}
        article={true}
      />
      <Editor onChange={console.log}></Editor>
    </section>
  );
}
