"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { ComponentType, ReactNode } from "react";
import Spinner from "@/components/common/Spinner";
import { useRouter } from "next/navigation";

interface LayoutProps {
  children: ReactNode;
}

const withMemberProtection = (WrappedComponent: ComponentType<LayoutProps>) => {
  return (props: LayoutProps) => {
    const router = useRouter();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const roles = useAuthStore((state) => state.roles);
    const isLoading = useAuthStore((state) => state.isLoading);

    useEffect(() => {
      console.log("[Member HOC] isAuthenticated:", isAuthenticated);
      console.log("[Member HOC] roles:", roles);
      console.log("[Member HOC] isLoading:", isLoading);

      if (!isLoading) {
        if (!isAuthenticated || roles.is_qr_member !== 1) {
          router.push("/auth");
        }
      }
    }, [isAuthenticated, roles, router, isLoading]);

    if (isLoading || !isAuthenticated || roles.is_qr_member !== 1) {
      return <Spinner />;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withMemberProtection;
