"use client";

import { useState, useEffect } from "react";

export default function ClientBody({ children }: { children: React.ReactNode }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <>
      {children}
    </>
  );
}
