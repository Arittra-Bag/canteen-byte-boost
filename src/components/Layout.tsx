
import { ReactNode } from "react";
import Navbar from "./Navbar";
import { useAuth } from "@/context/AuthContext";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { currentUser } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow px-4 py-6 md:px-8 container max-w-7xl mx-auto">
        {children}
      </main>
      <footer className="py-6 bg-secondary/50 text-center text-sm text-muted-foreground">
        <div className="container max-w-7xl mx-auto">
          <p>© {new Date().getFullYear()} Canteen Pre-Ordering System</p>
        </div>
      </footer>
    </div>
  );
}
