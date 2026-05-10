import { createBrowserRouter } from "react-router";
import { MainLayout } from "./layouts/MainLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { Home } from "./pages/Home";
import { Catalog } from "./pages/Catalog";
import { CategoryPage } from "./pages/CategoryPage";
import { ProductDetail } from "./pages/ProductDetail";
import { CraftStory } from "./pages/CraftStory";
import { About } from "./pages/About";
import { Contact } from "./pages/Contact";
import { AdminLogin } from "./pages/admin/Login";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { AdminProductList } from "./pages/admin/ProductList";
import { AdminProductEdit } from "./pages/admin/ProductEdit";
import { AdminCategoryList } from "./pages/admin/CategoryList";
import { AdminInquiryList } from "./pages/admin/InquiryList";
import { ComponentsPage } from "./pages/ComponentsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: Home },
      { path: "catalog", Component: Catalog },
      { path: "category/:id", Component: CategoryPage },
      { path: "product/:id", Component: ProductDetail },
      { path: "story", Component: CraftStory },
      { path: "about", Component: About },
      { path: "contact", Component: Contact },
      { path: "components", Component: ComponentsPage },
    ],
  },
  {
    path: "/admin",
    Component: AdminLayout,
    children: [
      { path: "login", Component: AdminLogin },
      { index: true, Component: AdminDashboard },
      { path: "products", Component: AdminProductList },
      { path: "products/new", Component: AdminProductEdit },
      { path: "products/edit/:id", Component: AdminProductEdit },
      { path: "categories", Component: AdminCategoryList },
      { path: "inquiries", Component: AdminInquiryList },
    ],
  }
]);
