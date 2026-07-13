import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import Index from "./pages/Index";
import Gallery from "./pages/Gallery";
import Coupons from "./pages/Coupons";
import Book from "./pages/Book";
import BookCheckout from "./pages/BookCheckout";
import BookingView from "./pages/BookingView";
import SitePage from "./pages/SitePage";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import FloatingReviewWidget from "./components/FloatingReviewWidget";
import { Analytics } from "@vercel/analytics/react";

const queryClient = new QueryClient();

function AppShell() {
  return (
    <>
      <ScrollToTop />
      <FloatingReviewWidget />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: "/", element: <Index /> },
      { path: "/gallery", element: <Gallery /> },
      { path: "/coupons", element: <Coupons /> },
      { path: "/book", element: <Book /> },
      { path: "/book/checkout", element: <BookCheckout /> },
      { path: "/booking/:token", element: <BookingView /> },
      { path: "/:slug", element: <SitePage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Analytics />
      <RouterProvider router={router} />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
