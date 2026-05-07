import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import { useCartStore } from "../store/cartStore";

interface DetailProduct {
  id: string;
  name: string;
  description: string;
  image: string;
  price: number;
  unit: string;
}

const ProductDetail = () => {
  const { id } = useParams();
  const addItem = useCartStore((state) => state.addItem);
  const [product, setProduct] = useState<DetailProduct | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data } = await api.get(`/products/${id}`);
        if (!isMounted) return;

        setProduct({
          id: data._id,
          name: data.name,
          description: data.description || "Fresh farm product",
          image: data.image,
          price: Number(data.price) || 0,
          unit: data.unit || "kg",
        });
      } catch {
        if (!isMounted) return;
        setProduct(null);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    void loadProduct();
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <p className="text-[#451A03]/75 dark:text-[#FAF7F0]/75">Loading product...</p>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Product Not Found
        </h1>
        <p className="mt-4 text-[#451A03]/75 dark:text-[#FAF7F0]/75">The product you are looking for does not exist or was removed.</p>
        <Link to="/shop" className="mt-6 inline-block rounded-2xl bg-[#166534] px-6 py-3 text-sm font-semibold text-[#FAF7F0] hover:bg-[#14532D]">
          Back to Shop
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
      <img
        src={product.image}
        alt={product.name}
        className="h-96 w-full rounded-3xl object-cover shadow-xl"
      />
      <section>
        <p className="text-sm uppercase tracking-[0.16em] text-[#C2410F]">Product Detail</p>
        <h1 className="mt-2 text-4xl font-semibold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          {product.name}
        </h1>
        <p className="mt-4 text-base leading-8 text-[#451A03]/80 dark:text-[#FAF7F0]/80">
          {product.description}
        </p>
        <p className="mt-4 text-3xl font-semibold text-[#166534] dark:text-[#D97706]">₹{product.price}/{product.unit}</p>
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() =>
              addItem({
                id: product.id,
                name: product.name,
                image: product.image,
                price: product.price,
                unit: product.unit,
              })
            }
            className="rounded-2xl bg-[#166534] px-6 py-3 text-sm font-semibold text-[#FAF7F0] hover:bg-[#14532D]"
          >
            Add to Cart
          </button>
          <Link to="/checkout" className="rounded-2xl border border-[#166534]/25 px-6 py-3 text-sm font-semibold hover:border-[#D97706]">
            Buy Now
          </Link>
        </div>
      </section>
    </main>
  );
};

export default ProductDetail;
