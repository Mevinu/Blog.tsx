import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/style.css";
import { BlogsPage } from "./pages/BlogsPage.tsx";
import { ArticlesPage } from "./pages/ArticlesPage.tsx";
import { Post } from "./pages/Post.tsx";
import { EditPage } from "./pages/EditPage.tsx";
import { AdminPage } from "./pages/AdminPage.tsx";
import { Login } from "./pages/Login.tsx";
import { SignUp } from "./pages/SignUp.tsx";

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
  { path: "/Admin", element: <AdminPage /> },
  {
    path: "/Edit/Blog/:id",
    element: <EditPage article={false} edit={true} />,
  },
  {
    path: "/Edit/Article/:id",
    element: <EditPage article={true} edit={true} />,
  },
  {
    path: "/Add/Blog",
    element: <EditPage article={false} edit={false}></EditPage>,
  },
  {
    path: "/Add/Article",
    element: <EditPage article={true} edit={false}></EditPage>,
  },
  {
    path: "/Login",
    element: <Login></Login>,
  },
  {
    path: "/Createuser",
    element: <SignUp></SignUp>,
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router}></RouterProvider>
  </StrictMode>
);
