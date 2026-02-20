import { Suspense } from "react";
import { PlayFlow } from "@/components/game/PlayFlow";

export default function PlayPage() {
  return (
    <Suspense>
      <PlayFlow />
    </Suspense>
  );
}
