import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import Layout from "@/components/organisms/Layout";
import NotFound from "@/components/pages/NotFound";

// Lazy load pages
const Dashboard = lazy(() => import("@/components/pages/Dashboard"));
const Transactions = lazy(() => import("@/components/pages/Transactions"));
const Budgets = lazy(() => import("@/components/pages/Budgets"));
const Goals = lazy(() => import("@/components/pages/Goals"));
const Reports = lazy(() => import("@/components/pages/Reports"));

const mainRoutes = [
  {
    path: "",
    index: true,
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Dashboard />
      </Suspense>
    ),
  },
  {
    path: "transactions",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Transactions />
      </Suspense>
    ),
  },
  {
    path: "budgets",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Budgets />
      </Suspense>
    ),
  },
  {
    path: "goals",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Goals />
      </Suspense>
    ),
  },
  {
    path: "reports",
    element: (
      <Suspense fallback={<div>Loading...</div>}>
        <Reports />
      </Suspense>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

const routes = [
  {
    path: "/",
    element: <Layout />,
    children: mainRoutes,
  },
];

export const router = createBrowserRouter(routes);