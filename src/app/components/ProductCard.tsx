import { Link } from "react-router";
import type { Product } from "../types/catalog";

export function ProductCard({ product }: { product: Product }) {
  // Determine badge styling based on status
  let badge = null;
  if (product.status === 'Out of Stock') {
    badge = <div className="absolute top-4 left-4 bg-brand-black text-brand-ivory text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-sm">Дууссан</div>;
  } else if (product.status === 'Made to Order') {
    badge = <div className="absolute top-4 left-4 bg-brand-brown text-brand-ivory text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-sm">Захиалгаар</div>;
  } else if (product.isFeatured) {
    badge = <div className="absolute top-4 left-4 bg-brand-red text-brand-ivory text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-sm">Онцлох</div>;
  }

  return (
    <Link to={`/product/${product.id}`} className="group flex flex-col h-full bg-white shadow-sm border border-brand-sand overflow-hidden hover:shadow-xl hover:border-brand-gold/50 transition-all duration-300 rounded-sm">
      <div className="relative aspect-[4/5] overflow-hidden bg-brand-sand/20">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        {badge}
      </div>
      <div className="p-5 flex flex-col flex-1 text-center bg-brand-ivory">
        <h3 className="text-brand-black font-medium mb-2 line-clamp-2">{product.name}</h3>
        <div className="mt-auto">
          <span className="text-brand-brown font-semibold">{product.price.toLocaleString()} ₮</span>
        </div>
      </div>
    </Link>
  );
}
