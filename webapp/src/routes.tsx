import { Navigate, RouteObject, createBrowserRouter } from "react-router-dom";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PageContainer } from "./pages/PageContainer";
import { CollectionPage } from "./pages/collection/CollectionPage";
import { HomePage } from "./pages/home/HomePage";
import { ListsPage } from "./pages/lists/ListsPage";
import { ShelvesPage } from "./pages/shelves/ShelvesPage";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <PageContainer />,
    errorElement: <Navigate replace to="/404" />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/404",
        element: <NotFoundPage />,
      },
      {
        path: "/collection",
        element: <CollectionPage />,
      },
      {
        path: "/lists",
        element: <ListsPage />,
      },
      {
        path: "/shelves",
        element: <ShelvesPage />,
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
