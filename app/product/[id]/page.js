import Link from "next/link";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/ProductDetail";
import { getProduct } from "@/lib/api";

const REVALIDATE = { next: { revalidate: 3600 } };

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const p = await getProduct(id, REVALIDATE);
    return { title: p.title, description: p.description };
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  let product = null;
  let error = "";

  try {
    product = await getProduct(id, REVALIDATE);
  } catch (err) {
    if (/not found/i.test(err.message)) notFound();
    error = err.message;
  }

  if (error) {
    return (
      <div className="container py-16 text-center">
        <h1 className="page-title">Could not load this product</h1>
        <p className="mt-2 font-inter text-gray">{error}</p>
        <Link href="/products" className="btn-primary mt-6">
          Back to products
        </Link>
      </div>
    );
  }

  return <ProductDetail product={product} />;
}
