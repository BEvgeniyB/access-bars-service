
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AccessBars from "./pages/AccessBars";
import Training from "./pages/Training";
import Healing from "./pages/Healing";
import Massage from "./pages/Massage";
import Analytics from "./pages/Analytics";
import AdminPanel from "./components/admin/AdminPanel";
import AdminLogin from "./pages/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";
import YandexMetrika from "./components/YandexMetrika";
import SEO404Handler from "./components/SEO404Handler";
import Reviews from "./pages/Reviews";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <YandexMetrika />
        <SEO404Handler />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/access-bars" element={<AccessBars />} />
          <Route path="/training" element={<Training />} />
          <Route path="/healing" element={<Healing />} />
          <Route path="/massage" element={<Massage />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;