"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DishView from "@/components/DishView";
import { takeStashedDish } from "@/lib/client";
import type { DishProfile } from "@/lib/schemas";

// Shows a saved dish without calling the engine again.
export default function DishPage() {
  const router = useRouter();
  const [dish, setDish] = useState<DishProfile | null>(null);
  useEffect(() => {
    const d = takeStashedDish();
    if (d) setDish(d);
    else router.replace("/saved");
  }, [router]);
  if (!dish) return null;
  return <DishView dish={dish} onLookup={(name) => router.push(`/?q=${encodeURIComponent(name)}`)} />;
}
