"use client";

import { useUserAuth } from "@/app/utils/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const { user } = useUserAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/"); // redirect to homepage if not logged in
    }
  }, [user]);

  // Prevents flashing of protected content before redirect
  if (!user) return null;

  return children;
}
