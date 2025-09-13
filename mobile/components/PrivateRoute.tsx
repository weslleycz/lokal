import { useAuthTokens } from "@/hooks/useAuth";
import { useRouter } from "expo-router";
import React, { useEffect } from "react";

interface PrivateRouteProps {
  children: React.ReactNode;
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { accessToken, loading } = useAuthTokens();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !accessToken) {
      router.replace("/login");
    }
  }, [accessToken, loading, router]);

  if (loading || !accessToken) {
    return null; 
  }

  return <>{children}</>;
}
