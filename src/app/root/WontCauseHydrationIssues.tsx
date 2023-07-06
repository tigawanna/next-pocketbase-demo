"use client";
import { PBUserRecord } from "@/state/user/types";
import { Record, Admin } from "pocketbase";

interface WontCauseHydrationIssuesProps {
  user: Record | Admin | null;
}

/**
 * Renders a component that won't cause hydration issues.
 *
 * @param {WontCauseHydrationIssuesProps} user - The user object.
 * @return {JSX.Element} - The rendered component.
 */

export function WontCauseHydrationIssues({ user }: WontCauseHydrationIssuesProps) {
  return (
    <div className="w-full h-full flex items-center justify-center">
      {user && <h1 className="text-2xl font-bold">User Logged In</h1>}
    </div>
  );
}
