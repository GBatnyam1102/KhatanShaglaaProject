import { Link } from "react-router";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { CategoryCard } from "../components/CategoryCard";
import { ProductCard } from "../components/ProductCard";
import { motion } from "motion/react";
import { getCategories, getProducts } from "../services/catalog";
import type { Category, Product } from "../types/catalog";

export function Home() {
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

  const featuredProducts = products.filter(p => p.isFeatured).slice(0, 4);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden flex items-center justify-center bg-brand-black">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1649300726285-19ac2b1c3654?q=80&w=1920" 
            alt="Hero Background" 
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-brand-black/30" />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-brand-gold text-sm font-bold tracking-[0.3em] uppercase mb-6 block">
              Хатан шаглаа брэнд
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif text-brand-ivory mb-6 leading-tight">
              Уламжлалаа урлаж,<br/>үнэ цэнийг бүтээнэ
            </h1>
            <p className="text-brand-sand text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light opacity-90">
              Монгол үндэсний зүү ороох оёдлын гайхамшгийг шингээсэн дээд зэрэглэлийн гар урлалын бүтээлүүд
            </p>
            <Link 
              to="/catalog" 
              className="inline-flex items-center gap-2 bg-brand-brown text-brand-ivory px-8 py-4 uppercase tracking-wider text-sm font-semibold hover:bg-brand-brown/90 transition-colors rounded-sm"
            >
              Бүтээгдэхүүн үзэх <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif text-brand-black mb-4">Төрлүүд</h2>
          <div className="w-16 h-1 bg-brand-gold mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-brand-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12 border-b border-brand-sand pb-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-brand-black mb-2">Онцлох бүтээлүүд</h2>
              <p className="text-brand-black/70">Шилдэг ур хийц бүхий дахин давтагдашгүй бүтээлүүд</p>
            </div>
            <Link to="/catalog" className="hidden md:flex items-center gap-2 text-brand-brown font-medium hover:text-brand-gold transition">
              Бүгдийг үзэх <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          
          <div className="mt-8 text-center md:hidden">
            <Link to="/catalog" className="inline-flex items-center gap-2 text-brand-brown font-medium hover:text-brand-gold transition">
              Бүгдийг үзэх <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Story Banner */}
      <section className="py-24 px-4 bg-brand-brown text-brand-ivory relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <img 
            src="https://images.unsplash.com/photo-1760776858841-62bf673b253e?q=80&w=1920" 
            alt="Pattern" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-serif mb-6 text-brand-gold">Зүү ороох оёдлын түүх</h2>
          <p className="text-lg text-brand-sand mb-10 leading-relaxed font-light">
            Монголчуудын уламжлалт зүү ороох оёдол нь нэн эртнээс уламжлагдан ирсэн, дэлхийд ховорхон гар урлалын төрөл юм. Энэхүү оёдол нь маш их тэвчээр, нарийн мэдрэмж шаарддаг бөгөөд нэг бүтээл гарахад хэдэн сар ч зарцуулагдах тохиолдол бий.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link 
              to="/story" 
              className="inline-flex items-center gap-2 border border-brand-gold text-brand-gold px-8 py-4 uppercase tracking-wider text-sm font-semibold hover:bg-brand-gold hover:text-brand-brown transition-colors rounded-sm"
            >
              Дэлгэрэнгүй унших
            </Link>
            <Link 
              to="/contact" 
              className="inline-flex items-center gap-2 bg-brand-gold text-brand-brown px-8 py-4 uppercase tracking-wider text-sm font-semibold hover:bg-brand-sand transition-colors rounded-sm"
            >
              Холбоо барих
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
