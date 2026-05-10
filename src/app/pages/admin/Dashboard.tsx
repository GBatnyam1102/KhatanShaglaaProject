import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Archive, Eye, Inbox, Package } from "lucide-react";
import { getDashboardSummary } from "../../services/catalog";
import type { Category, Inquiry, Product } from "../../types/catalog";

export function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [publishedProducts, setPublishedProducts] = useState(0);
  const [newInquiries, setNewInquiries] = useState(0);

  useEffect(() => {
    let isMounted = true;

    getDashboardSummary()
      .then((summary) => {
        if (!isMounted) return;
        setProducts(summary.products);
        setCategories(summary.categories);
        setInquiries(summary.inquiries);
        setPublishedProducts(summary.publishedProducts);
        setNewInquiries(summary.newInquiries);
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = [
    { name: "Нийт бүтээгдэхүүн", value: products.length.toString(), icon: Package, meta: "Каталогийн бараа" },
    { name: "Нийтлэгдсэн", value: publishedProducts.toString(), icon: Eye, meta: "Public site дээр харагдана" },
    { name: "Ангилал", value: categories.length.toString(), icon: Archive, meta: "Даалин, хавтага, материал" },
    { name: "Шинэ хүсэлт", value: newInquiries.toString(), icon: Inbox, meta: "Холбогдоогүй inquiries" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-neutral-900">Хянах самбар</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-neutral-500 mb-1">{stat.name}</p>
                  <h3 className="text-2xl font-bold text-neutral-900">{stat.value}</h3>
                </div>
                <div className="p-3 bg-amber-50 rounded-lg">
                  <Icon className="w-5 h-5 text-amber-900" />
                </div>
              </div>
              <div className="mt-4 text-sm text-neutral-500">{stat.meta}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
          <h2 className="text-lg font-bold text-neutral-900 mb-4">Сүүлийн бүтээгдэхүүнүүд</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-neutral-500 uppercase bg-neutral-50">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">Бүтээгдэхүүн</th>
                  <th className="px-4 py-3">Үнэ</th>
                  <th className="px-4 py-3">Ангилал</th>
                  <th className="px-4 py-3 rounded-tr-lg">Төлөв</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 4).map((product) => (
                  <tr key={product.id} className="border-b border-neutral-100 last:border-b-0">
                    <td className="px-4 py-4 font-medium text-neutral-900">{product.name}</td>
                    <td className="px-4 py-4">{product.price.toLocaleString()} ₮</td>
                    <td className="px-4 py-4">{categories.find(category => category.id === product.categoryId)?.name ?? "Ангилалгүй"}</td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        product.status === "In Stock" ? "bg-emerald-100 text-emerald-800" :
                        product.status === "Out of Stock" ? "bg-neutral-900 text-white" :
                        "bg-amber-100 text-amber-800"
                      }`}>
                        {product.status === "In Stock" ? "Бэлэн" : product.status === "Out of Stock" ? "Дууссан" : "Захиалгаар"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-neutral-900">Сүүлийн хүсэлтүүд</h2>
            <Link to="/admin/inquiries" className="text-xs text-amber-900 hover:underline">Бүгдийг үзэх</Link>
          </div>
          {inquiries.length === 0 ? (
            <div className="min-h-32 bg-neutral-50 rounded-lg border border-neutral-100 text-neutral-500 text-sm p-5">
              Одоогоор хүсэлт ирээгүй байна.
            </div>
          ) : (
            <ul className="space-y-3">
              {inquiries.slice(0, 5).map((inquiry) => (
                <li key={inquiry.id} className="border border-neutral-100 rounded-lg p-3 bg-neutral-50">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-neutral-900 text-sm">{inquiry.name}</span>
                    <span className={`px-2 py-0.5 text-[10px] rounded-sm uppercase tracking-wider ${
                      inquiry.status === "new" ? "bg-brand-red/10 text-brand-red" :
                      inquiry.status === "replied" ? "bg-brand-green/10 text-brand-green" :
                      "bg-brand-brown/10 text-brand-brown"
                    }`}>
                      {inquiry.status}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">{inquiry.phone}</p>
                  <p className="text-xs text-neutral-600 mt-1 line-clamp-2">{inquiry.message}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
