import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../components/ui/button";
import { ProductCard } from "../components/ProductCard";
import { getProductById, getProducts } from "../services/catalog";
import type { Product } from "../types/catalog";

export function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeImage, setActiveImage] = useState("");
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (!id) return;

    setIsLoading(true);
    Promise.all([getProductById(id), getProducts()])
      .then(([nextProduct, nextProducts]) => {
        if (!isMounted) return;
        setProduct(nextProduct);
        setProducts(nextProducts);
      })
      .catch((error) => {
        console.error(error);
        if (isMounted) {
          setProduct(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
    }
  }, [product]);

  if (isLoading) return <div className="p-24 text-center">Бүтээгдэхүүн ачааллаж байна...</div>;
  if (!product) return <div className="p-24 text-center">Бүтээгдэхүүн олдсонгүй</div>;

  const similarProducts = products.filter(p => p.categoryId === product.categoryId && p.id !== product.id).slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-brand-black/50 mb-8 overflow-x-auto whitespace-nowrap pb-2">
        <button onClick={() => navigate(-1)} className="hover:text-brand-brown flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" /> Буцах
        </button>
        <span className="text-brand-sand">|</span>
        <button onClick={() => navigate('/')} className="hover:text-brand-brown">Нүүр</button>
        <ChevronRight className="w-4 h-4" />
        <button onClick={() => navigate('/catalog')} className="hover:text-brand-brown">Бүтээгдэхүүн</button>
        <ChevronRight className="w-4 h-4" />
        <span className="text-brand-black truncate">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        {/* Images - Gallery */}
        <div className="flex flex-col gap-4">
          <div 
            className="aspect-[4/5] bg-brand-sand/20 relative cursor-zoom-in overflow-hidden rounded-sm"
            onClick={() => setIsZoomed(true)}
          >
            <img 
              src={activeImage} 
              alt={product.name} 
              className="w-full h-full object-contain object-center p-4"
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, idx) => (
                <button 
                  key={idx} 
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-24 flex-shrink-0 border-2 rounded-sm overflow-hidden transition-colors ${activeImage === img ? 'border-brand-brown' : 'border-transparent hover:border-brand-sand'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-serif text-brand-black mb-4">{product.name}</h1>
            <div className="text-2xl font-medium text-brand-brown mb-4">{product.price.toLocaleString()} ₮</div>
            
            <div className="flex items-center gap-3 mb-6">
              <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-sm ${
                product.status === 'In Stock' ? 'bg-brand-green/10 text-brand-green' :
                product.status === 'Out of Stock' ? 'bg-brand-black text-brand-ivory' :
                'bg-brand-brown/10 text-brand-brown'
              }`}>
                {product.status === 'In Stock' ? 'Бэлэн байгаа' : product.status === 'Out of Stock' ? 'Дууссан' : 'Захиалгаар'}
              </span>
            </div>
            
            <div className="prose prose-neutral max-w-none text-brand-black/70">
              <p>{product.description}</p>
            </div>
          </div>

          <div className="space-y-4 mt-auto pt-8 border-t border-brand-sand">
            <Button 
              variant="primary" 
              size="lg" 
              className="w-full"
              disabled={product.status === 'Out of Stock'}
              onClick={() => navigate('/contact', { state: { productName: product.name } })}
            >
              {product.status === 'Out of Stock' ? 'Одоогоор дууссан' : 'Захиалга өгөх / Асуух'}
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="w-full"
              onClick={() => navigate('/catalog')}
            >
              Бусад бүтээгдэхүүн үзэх
            </Button>
          </div>

          {/* Details Accordion Mock */}
          <div className="mt-12 space-y-4">
            <div className="border-b border-brand-sand pb-4">
              <h3 className="font-bold text-brand-black mb-2 uppercase tracking-wider text-sm">Хүргэлт</h3>
              <p className="text-sm text-brand-black/70">Орон нутаг болон гадаад руу Монгол шуудангаар илгээх боломжтой.</p>
            </div>
            <div className="border-b border-brand-sand pb-4">
              <h3 className="font-bold text-brand-black mb-2 uppercase tracking-wider text-sm">Арчилгаа</h3>
              <p className="text-sm text-brand-black/70">Ус чийгнээс хамгаалж, нарны шууд тусгалаас хол хадгална уу. Зөвхөн хуурай хими цэвэрлэгээгээр цэвэрлэнэ.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div className="mt-24">
          <h2 className="text-2xl font-serif text-brand-black mb-8 border-b border-brand-sand pb-4">Төстэй бүтээгдэхүүн</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Zoom Image Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-brand-ivory/95 backdrop-blur-sm flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
            onClick={() => setIsZoomed(false)}
          >
            <img src={activeImage} alt="Zoomed" className="max-w-full max-h-full object-contain shadow-2xl rounded-sm" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
