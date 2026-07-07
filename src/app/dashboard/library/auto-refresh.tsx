"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AutoRefreshProcessor() {
  const router = useRouter();

  useEffect(() => {
    // Refresh the router every 3 seconds to check processing status
    const interval = setInterval(() => {
      router.refresh();
    }, 3000);

    return () => clearInterval(interval);
  }, [router]);

  return null; // Invisible component
}
