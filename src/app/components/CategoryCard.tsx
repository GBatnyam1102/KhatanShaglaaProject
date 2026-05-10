import { Link } from "react-router";
import type { Category } from "../types/catalog";

export function CategoryCard({ category, isActive }: { category: Category; isActive?: boolean }) {
  return (
    <Link to={`/category/${category.id}`} className={`group relative block w-full aspect-[3/4] overflow-hidden rounded-sm transition-all duration-300 ${isActive ? 'ring-4 ring-brand-gold ring-offset-2' : ''}`}>
      <img 
        src={category.image} 
        alt={category.name}
        className={`absolute inset-0 w-full h-full object-cover transition-transform duration-1000 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}
      />
      <div className={`absolute inset-0 transition-opacity duration-300 ${isActive ? 'bg-black/60' : 'bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100'}`}></div>
      <div className="absolute inset-0 p-6 flex flex-col justify-end text-brand-ivory text-center">
        <h3 className="text-2xl font-serif mb-2 tracking-wide text-brand-gold">{category.name}</h3>
        <p className={`text-sm text-brand-sand transform transition-all duration-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0'}`}>
          {category.description}
        </p>
      </div>
    </Link>
  );
}
