import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import RequireAuth from "./components/RequireAuth";
import Layout from "./components/Layout";

// Auth Pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// Student Pages
import Home from "./pages/student/Home";
import CanteenMenu from "./pages/student/CanteenMenu";
import Cart from "./pages/student/Cart";
import Orders from "./pages/student/Orders";
import Nutrition from "./pages/student/Nutrition";

// Manager Pages
import Dashboard from "./pages/manager/Dashboard";
import MenuManagement from "./pages/manager/MenuManagement";
import Analytics from "./pages/manager/Analytics";

// Other Pages
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Student Routes */}
              <Route
                path="/"
                element={
                  <Layout>
                    <RequireAuth>
                      <Home />
                    </RequireAuth>
                  </Layout>
                }
              />
              <Route
                path="/canteen/:canteenId"
                element={
                  <Layout>
                    <RequireAuth allowedRoles={["student"]}>
                      <CanteenMenu />
                    </RequireAuth>
                  </Layout>
                }
              />
              <Route
                path="/cart"
                element={
                  <Layout>
                    <RequireAuth allowedRoles={["student"]}>
                      <Cart />
                    </RequireAuth>
                  </Layout>
                }
              />
              <Route
                path="/orders"
                element={
                  <Layout>
                    <RequireAuth allowedRoles={["student"]}>
                      <Orders />
                    </RequireAuth>
                  </Layout>
                }
              />
              <Route
                path="/nutrition"
                element={
                  <Layout>
                    <RequireAuth allowedRoles={["student"]}>
                      <Nutrition />
                    </RequireAuth>
                  </Layout>
                }
              />
              
              {/* Manager Routes */}
              <Route
                path="/"
                element={
                  <Layout>
                    <RequireAuth allowedRoles={["canteen_manager"]}>
                      <Dashboard />
                    </RequireAuth>
                  </Layout>
                }
              />
              <Route
                path="/menu"
                element={
                  <Layout>
                    <RequireAuth allowedRoles={["canteen_manager"]}>
                      <MenuManagement />
                    </RequireAuth>
                  </Layout>
                }
              />
              <Route
                path="/analytics"
                element={
                  <Layout>
                    <RequireAuth allowedRoles={["canteen_manager"]}>
                      <Analytics />
                    </RequireAuth>
                  </Layout>
                }
              />
              
              {/* Catch All Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
