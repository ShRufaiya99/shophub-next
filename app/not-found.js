import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container py-20 text-center">
      <p className="font-inter text-6xl font-bold text-blue">404</p>
      <h1 className="page-title mt-2">Page not found</h1>
      <p className="mt-2 font-inter text-gray">The page you are looking for does not exist.</p>
      <Link href="/" className="btn-primary mt-6">Back to home</Link>
    </div>
  );
}
