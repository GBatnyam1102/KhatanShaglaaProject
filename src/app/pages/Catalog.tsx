import { useEffect, useMemo, useState } from "react";
import { Filter, ChevronDown, Check, Search, X } from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { AnimatePresence, motion } from "motion/react";
import { Button } from "../components/ui/button";
import { getCategories, getProducts } from "../services/catalog";
import type { Category, Product, ProductStatus } from "../types/catalog";

type PriceBucketId = "lt100" | "100-500" | "gt500";
type StatusFilter = "all" | ProductStatus;

const PRICE_BUCKETS: { id: PriceBucketId; label: string; min: number; max: number }[] = [
  { id: "lt100", label: "0 - 100,000 ₮", min: 0, max: 100000 },
  { id: "100-500", label: "100,000 - 500,000 ₮", min: 100000, max: 500000 },
  { id: "gt500", label: "500,000 ₮ - дээш", min: 500000, max: Number.POSITIVE_INFINITY },
];

const STATUS_OPTIONS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "Бүх төлөв" },
  { id: "In Stock", label: "Бэлэн" },
  { id: "Made to Order", label: "Захиалгаар" },
  { id: "Out of Stock", label: "Дууссан" },
];

export function Catalog() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [priceBuckets, setPriceBuckets] = useState<PriceBucketId[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    setIsLoading(true);
    Promise.all([getCategories(), getProducts()])
      .then(([nextCategories, nextProducts]) => {
        if (!isMounted) return;
        setCategories(nextCategories);
        setProducts(nextProducts);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const togglePriceBucket = (bucket: PriceBucketId) => {
    setPriceBuckets((currentBuckets) =>
      currentBuckets.includes(bucket)
        ? currentBuckets.filter((value) => value !== bucket)
        : [...currentBuckets, bucket]
    );
  };

  const resetFilters = () => {
    setActiveCategory("all");
    setStatusFilter("all");
    setPriceBuckets([]);
    setSearch("");
  };

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const activeBuckets = PRICE_BUCKETS.filter((bucket) => priceBuckets.includes(bucket.id));

    const filtered = products.filter((product) => {
      if (activeCategory !== "all" && product.categoryId !== activeCategory) return false;
      if (statusFilter !== "all" && product.status !== statusFilter) return false;
      if (
        activeBuckets.length > 0 &&
        !activeBuckets.some((bucket) => product.price >= bucket.min && product.price < bucket.max)
      ) {
        return false;
      }
      if (normalizedSearch) {
        const haystack = [
          product.name,
          product.description,
          product.material ?? "",
          product.color ?? "",
          product.size ?? "",
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(normalizedSearch)) return false;
      }
      return true;
    });

    if (sortBy === "price-low") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-high") {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name, "mn"));
    }

    return filtered;
  }, [products, activeCategory, statusFilter, priceBuckets, search, sortBy]);

  const hasActiveFilters = activeCategory !== "all" || statusFilter !== "all" || priceBuckets.length > 0 || search.trim().length > 0;

  const FilterContent = () => (
    <div className="space-y-8">
      <div>
        <h3 className="font-bold uppercase tracking-wider text-sm mb-4 border-b border-brand-sand pb-2 text-brand-black">Хайлт</h3>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-brand-black/40" />
          <input
            type="text"
            placeholder="Нэр, материал, өнгөөр хайх..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-brand-sand rounded-sm focus:outline-none focus:border-brand-brown text-brand-black"
          />
        </div>
      </div>

      <div>
        <h3 className="font-bold uppercase tracking-wider text-sm mb-4 border-b border-brand-sand pb-2 text-brand-black">Ангилал</h3>
        <ul className="space-y-3">
          <li>
            <button 
              onClick={() => setActiveCategory("all")}
              className={`text-left w-full flex items-center justify-between transition-colors ${activeCategory === "all" ? "text-brand-brown font-medium" : "text-brand-black/70 hover:text-brand-brown"}`}
            >
              Бүгд
              {activeCategory === "all" && <Check className="w-4 h-4" />}
            </button>
          </li>
          {categories.map(cat => (
            <li key={cat.id}>
              <button 
                onClick={() => setActiveCategory(cat.id)}
                className={`text-left w-full flex items-center justify-between transition-colors ${activeCategory === cat.id ? "text-brand-brown font-medium" : "text-brand-black/70 hover:text-brand-brown"}`}
              >
                {cat.name}
                {activeCategory === cat.id && <Check className="w-4 h-4" />}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h3 className="font-bold uppercase tracking-wider text-sm mb-4 border-b border-brand-sand pb-2 text-brand-black">Үнэ</h3>
        <div className="space-y-3">
          {PRICE_BUCKETS.map((bucket) => (
            <label key={bucket.id} className="flex items-center gap-2 cursor-pointer text-sm text-brand-black/70 hover:text-brand-brown">
              <input
                type="checkbox"
                className="w-4 h-4 accent-brand-brown"
                checked={priceBuckets.includes(bucket.id)}
                onChange={() => togglePriceBucket(bucket.id)}
              />
              <span>{bucket.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold uppercase tracking-wider text-sm mb-4 border-b border-brand-sand pb-2 text-brand-black">Төлөв</h3>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((option) => {
            const isActive = statusFilter === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setStatusFilter(option.id)}
                className={`px-3 py-1 text-xs uppercase tracking-wider border rounded-sm transition-colors ${
                  isActive
                    ? "bg-brand-brown text-brand-ivory border-brand-brown"
                    : "border-brand-sand text-brand-black/70 hover:border-brand-brown hover:text-brand-brown"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={resetFilters}
          className="w-full text-xs uppercase tracking-wider text-brand-brown border border-brand-brown/50 rounded-sm py-2 hover:bg-brand-brown hover:text-brand-ivory transition-colors"
        >
          Шүүлтүүр цэвэрлэх
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-12 text-center md:text-left">
        <h1 className="text-4xl font-serif text-brand-black mb-4 uppercase">Бүтээгдэхүүн</h1>
        <p className="text-brand-black/70 max-w-2xl">
          Бидний урласан бүтээгдэхүүнүүдтэй танилцана уу. Бүтээл бүр цор ганц бөгөөд давтагдашгүй.
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Mobile Filter Toggle */}
        <Button 
          variant="outline"
          className="md:hidden w-full flex justify-between"
          onClick={() => setIsMobileFilterOpen(true)}
        >
          <span className="flex items-center gap-2"><Filter className="w-5 h-5" /> Шүүлтүүр</span>
          <ChevronDown className="w-5 h-5" />
        </Button>

        {/* Mobile Filter Bottom Sheet */}
        <AnimatePresence>
          {isMobileFilterOpen && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-brand-black/50 z-50 md:hidden"
                onClick={() => setIsMobileFilterOpen(false)}
              />
              <motion.div 
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed bottom-0 left-0 right-0 bg-brand-ivory z-50 rounded-t-2xl p-6 pb-12 max-h-[85vh] overflow-y-auto md:hidden"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-serif text-brand-black">Шүүлтүүр</h2>
                  <button onClick={() => setIsMobileFilterOpen(false)} className="p-2 text-brand-black/50 hover:text-brand-black">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <FilterContent />
                <div className="mt-8">
                  <Button variant="primary" className="w-full" onClick={() => setIsMobileFilterOpen(false)}>Үр дүн харах</Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Desktop Sidebar Filter */}
        <aside className="hidden md:block w-64 flex-shrink-0">
          <div className="sticky top-28">
            <FilterContent />
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm text-brand-black/50">{filteredProducts.length} үр дүн</span>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-brand-black/50 hidden sm:inline">Эрэмбэлэх:</span>
              <select 
                className="text-sm border border-brand-sand rounded-sm py-2 px-3 focus:outline-none focus:border-brand-brown bg-white text-brand-black"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="newest">Шинэ нь эхэндээ</option>
                <option value="price-low">Үнэ өсөхөөр</option>
                <option value="price-high">Үнэ буурахаар</option>
                <option value="name">Нэрээр (А-Я)</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="aspect-[4/5] bg-brand-sand/30 animate-pulse rounded-sm" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!isLoading && filteredProducts.length === 0 && (
            <div className="text-center py-24 text-brand-black/50">
              Таны хайсан бүтээгдэхүүн олдсонгүй.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
