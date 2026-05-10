import { useState } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { ProductCard } from "../components/ProductCard";
import { CategoryCard } from "../components/CategoryCard";
import { CATEGORIES, MOCK_PRODUCTS } from "../mock-data";

export function ComponentsPage() {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-24 bg-brand-ivory min-h-screen">
      <div>
        <h1 className="text-4xl font-serif text-brand-brown mb-4 uppercase tracking-wider">Design System & Components</h1>
        <p className="text-brand-black/70 mb-12 max-w-2xl">
          "Хатан шаглаа" брэндийн дахин ашиглагдах компонент болон дизайны систем. Figma хэв маяг, Auto Layout болон variants-г React дээр хэрэгжүүлсэн байдал.
        </p>
      </div>

      {/* Colors */}
      <section>
        <h2 className="text-2xl font-serif text-brand-black mb-6 border-b border-brand-sand pb-2">Design Tokens (Colors)</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <ColorSwatch name="Brown" hex="#6F4E37" className="bg-brand-brown text-white" />
          <ColorSwatch name="Gold" hex="#B8860B" className="bg-brand-gold text-white" />
          <ColorSwatch name="Black" hex="#1E1814" className="bg-brand-black text-white" />
          <ColorSwatch name="Red" hex="#8B1E1E" className="bg-brand-red text-white" />
          <ColorSwatch name="Green" hex="#2F5D46" className="bg-brand-green text-white" />
          <ColorSwatch name="Ivory" hex="#FAF7F0" className="bg-brand-ivory text-brand-black border border-brand-sand" />
          <ColorSwatch name="Sand" hex="#E8D8B0" className="bg-brand-sand text-brand-black" />
        </div>
      </section>

      {/* Buttons */}
      <section>
        <h2 className="text-2xl font-serif text-brand-black mb-6 border-b border-brand-sand pb-2">Buttons</h2>
        <div className="space-y-8">
          <div className="flex flex-wrap gap-4 items-end">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
          <div className="flex flex-wrap gap-4 items-end">
            <Button disabled>Disabled</Button>
            <Button isLoading>Loading</Button>
          </div>
          <div className="flex flex-wrap gap-4 items-end">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
          </div>
        </div>
      </section>

      {/* Inputs */}
      <section>
        <h2 className="text-2xl font-serif text-brand-black mb-6 border-b border-brand-sand pb-2">Inputs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
          <div>
            <label className="block text-sm font-medium text-brand-black mb-2">Default / Focus</label>
            <Input 
              placeholder="Мэдээлэл оруулна уу..." 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-black mb-2">Error state</label>
            <Input 
              placeholder="Мэдээлэл оруулна уу..." 
              error="Утасны дугаар буруу байна"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-black mb-2">Disabled</label>
            <Input 
              placeholder="Боломжгүй" 
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-brand-black mb-2">Success state</label>
            <Input 
              placeholder="Амжилттай" 
              state="success"
              defaultValue="admin@khatanshaglaa.mn"
            />
          </div>
        </div>
      </section>

      {/* Product Cards */}
      <section>
        <h2 className="text-2xl font-serif text-brand-black mb-6 border-b border-brand-sand pb-2">Product Cards (Variants)</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <p className="text-sm text-brand-black/70 font-medium">Default</p>
            <ProductCard product={MOCK_PRODUCTS.find(p => p.status === 'In Stock' && !p.isFeatured)!} />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-brand-black/70 font-medium">Featured</p>
            <ProductCard product={MOCK_PRODUCTS.find(p => p.isFeatured)!} />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-brand-black/70 font-medium">Sold Out</p>
            <ProductCard product={MOCK_PRODUCTS.find(p => p.status === 'Out of Stock')!} />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-brand-black/70 font-medium">Made to Order</p>
            <ProductCard product={MOCK_PRODUCTS.find(p => p.status === 'Made to Order')!} />
          </div>
        </div>
      </section>

      {/* Category Cards */}
      <section>
        <h2 className="text-2xl font-serif text-brand-black mb-6 border-b border-brand-sand pb-2">Category Cards</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <p className="text-sm text-brand-black/70 font-medium">Default (Hover state inside)</p>
            <CategoryCard category={CATEGORIES[0]} />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-brand-black/70 font-medium">Active</p>
            <CategoryCard category={CATEGORIES[1]} isActive />
          </div>
        </div>
      </section>

    </div>
  );
}

function ColorSwatch({ name, hex, className }: { name: string, hex: string, className?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className={`h-24 rounded-sm shadow-sm flex items-end p-3 ${className}`}>
        <span className="font-medium text-sm">{name}</span>
      </div>
      <div className="text-xs text-brand-black/70 font-mono uppercase">{hex}</div>
    </div>
  );
}
