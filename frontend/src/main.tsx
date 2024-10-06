import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/style.css";
import { BlogsPage } from "./pages/BlogsPage.tsx";
import { ArticlesPage } from "./pages/ArticlesPage.tsx";
import { Post } from "./pages/Post.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/Blogs",
    element: <BlogsPage />,
  },
  {
    path: "/Articles",
    element: <ArticlesPage />,
  },
  {
    path: "/Blog/:id",
    element: <Post blog={true} />,
  },
  {
    path: "/Article/:id",
    element: <Post blog={false} />,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>
);
