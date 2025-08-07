"use client";

import { useState, useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";

export default function ClientBody({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
