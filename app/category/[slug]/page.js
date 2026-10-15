"use client";

import { useParams } from "next/navigation";
import ShopPage from "@/components/ShopPage";

export default function CategoryPage() {
  const { slug } = useParams();
  return <ShopPage key={slug} slug={slug} />;
}
