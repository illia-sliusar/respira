import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import { Loading } from "@/src/ui";

export default function OAuthCallbackScreen() {
  const router = useRouter();

  useEffect(() => {
    // Better Auth handles the callback automatically
    // Root layout will redirect to app when session is detected
    const timer = setTimeout(() => {
      router.replace("/");
    }, 1000);

    return () => clearTimeout(timer);
  }, [router]);

  return <Loading message="Completing sign in..." fullScreen />;
}
