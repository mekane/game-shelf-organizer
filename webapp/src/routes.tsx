import { AnylistsPage } from "@pages/anylist/AnylistsPage";
import { ShelvesList } from "@pages/shelves/ShelvesList";
import { ShelfLayout } from "@pages/shelves/layout/ShelfLayout";
import { Organize } from "@pages/shelves/organize/Organize";
import { RouteObject, createBrowserRouter } from "react-router-dom";
import { ErrorPage } from "./pages/ErrorPage";
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
    errorElement: <ErrorPage />,
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
        children: [
          {
            path: "",
            index: true,
            element: <ShelvesList />,
          },
          {
            path: "layout/:id",
            element: <ShelfLayout />,
            index: true,
          },
          {
            path: "organize/:id",
            element: <Organize />,
          },
        ],
      },
      {
        path: "/anylists",
        element: <AnylistsPage />,
      },
      {
        path: "/anylists/:id",
        element: <div>TODO: Anylist</div>,
      },
    ],
  },
];

// TODO: set up public routes for login and protected routes for everything else

export const router = createBrowserRouter(routes);
