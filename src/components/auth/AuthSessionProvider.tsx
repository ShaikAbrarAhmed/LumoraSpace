"use client";

import { SessionProvider } from "next-auth/react";
import { MotionConfig } from "framer-motion";
import { MembershipProvider } from "./MembershipContext";

export default function AuthSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <MotionConfig reducedMotion="user">
        <MembershipProvider>{children}</MembershipProvider>
      </MotionConfig>
    </SessionProvider>
  );
}
