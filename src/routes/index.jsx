import FrontLayout from "../layouts/FrontLayout";
import HomePage from "../pages/Homepage";
import ProductPage from "../pages/ProductPage";
import ProductDetailPage from "../pages/ProductDetailPage";
import CartPage from "../pages/CartPage";
import AdminLayout from "../layouts/AdminLayout";
import AdminProductPage from "../pages/AdminProductPage";
import AdminOrderPage from "../pages/AdminOrderPage";
import LoginPage from "../pages/LoginPage";

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
  }
]

export default routes;