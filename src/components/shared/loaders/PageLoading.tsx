import { Loader } from "lucide-react";

interface PageLoadingProps {}

export function PageLoading({}: PageLoadingProps) {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <Loader className="h-6 w-6 animate-spin text-accent-foreground" />
    </div>
  );
}
