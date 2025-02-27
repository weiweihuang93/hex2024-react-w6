import FrontLayout from "../front/FrontLayout";
import HomePage from "../front/HomePage";
import ProductPage from "../front/ProductPage";
import ProductDetailPage from "../front/ProductDetailPage";
import CartPage from "../front/CartPage";

import AdminLayout from "../admin/AdminLayout";
import AdminProductPage from "../admin/AdminProductPage";
import AdminOrderPage from "../admin/AdminOrderPage";
import LoginPage from "../admin/LoginPage";

import NotFound from "../pages/NotFound";

const routes = [
  {
    path: "/",
    element: <FrontLayout />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "product",
        element: <ProductPage />,
      },
      {
        path: "product/:id",
        element: <ProductDetailPage />,
      },
      {
        path: "cart",
        element: <CartPage />,
      }
    ]
  },
  {
    path: "/login",
    element: <LoginPage />
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "product",
        element: <AdminProductPage />
      },
      {
        path: "order",
        element: <AdminOrderPage />
      }
    ]
  },
  {
    path: "*",
    element: <NotFound />
  }
]

export default routes;