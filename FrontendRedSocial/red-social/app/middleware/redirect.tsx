"use client";

import { useEffect } from "react";

// import LinearProgress from '@mui/material/LinearProgress';
import { useRouter } from "next/navigation";

export function Redirect({ to }: { to: string }) {
  const router = useRouter();

  useEffect(() => {
    router.push(to);
  });

  return <div></div>;
}
