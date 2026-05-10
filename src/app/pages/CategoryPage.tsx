import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { ProductCard } from "../components/ProductCard";
import { getCategories, getProducts } from "../services/catalog";
import type { Category, Product } from "../types/catalog";

export function CategoryPage() {
  const { id } = useParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    let isMounted = true;

    Promise.all([getCategories(), getProducts()])
      .then(([nextCategories, nextProducts]) => {
        if (!isMounted) return;
        setCategories(nextCategories);
        setProducts(nextProducts);
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const category = categories.find(c => c.id === id);
  const categoryProducts = products.filter(p => p.categoryId === id);

  if (!category) return <div className="p-24 text-center">Ангилал олдсонгүй</div>;

  return (
    <div>
      {/* Category Header */}
      <div className="relative h-64 md:h-80 w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 text-center px-4">
          <h1 className="text-4xl md:text-5xl font-serif text-white mb-4">{category.name}</h1>
          <p className="text-neutral-200 text-lg max-w-2xl mx-auto">{category.description}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {categoryProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {categoryProducts.length === 0 && (
          <div className="text-center py-24 text-neutral-500">
            Энэ ангилалд бүтээгдэхүүн олдсонгүй.
          </div>
        )}
      </div>
    </div>
  );
}
