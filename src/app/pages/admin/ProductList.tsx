import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { deleteProduct, getAdminProducts, getCategories } from "../../services/catalog";
import type { Category, Product } from "../../types/catalog";

export function AdminProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let isMounted = true;

    Promise.all([getAdminProducts(), getCategories()])
      .then(([nextProducts, nextCategories]) => {
        if (!isMounted) return;
        setProducts(nextProducts);
        setCategories(nextCategories);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Бүтээгдэхүүний мэдээлэл уншихад алдаа гарлаа.");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = async (id: string) => {
    if (!window.confirm("Энэ бүтээгдэхүүнийг устгах уу?")) return;

    try {
      await deleteProduct(id);
      setProducts((currentProducts) => currentProducts.filter((product) => product.id !== id));
      toast.success("Бүтээгдэхүүн устлаа");
    } catch (error) {
      console.error(error);
      toast.error("Бүтээгдэхүүн устгахад алдаа гарлаа.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-neutral-900">Бүтээгдэхүүн</h1>
        <Link 
          to="/admin/products/new" 
          className="flex items-center gap-2 bg-amber-900 text-white px-4 py-2 rounded-lg font-medium hover:bg-amber-800 transition-colors"
        >
          <Plus className="w-4 h-4" /> Шинэ бүтээгдэхүүн
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-neutral-200 flex justify-between items-center bg-neutral-50">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Хайх..." 
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-300 rounded-lg focus:outline-none focus:border-amber-900"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-neutral-500 uppercase bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="px-6 py-4">Бүтээгдэхүүн</th>
                <th className="px-6 py-4">Ангилал</th>
                <th className="px-6 py-4">Үнэ</th>
                <th className="px-6 py-4">Төлөв</th>
                <th className="px-6 py-4 text-right">Үйлдэл</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={product.image} alt={product.name} className="w-10 h-10 rounded-md object-cover" />
                      <span className="font-medium text-neutral-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-neutral-500">
                    {categories.find(category => category.id === product.categoryId)?.name ?? "Ангилалгүй"}
                  </td>
                  <td className="px-6 py-4 font-medium">{product.price.toLocaleString()} ₮</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs rounded-sm ${
                      product.status === 'In Stock' ? 'bg-brand-green/10 text-brand-green' :
                      product.status === 'Out of Stock' ? 'bg-brand-black text-brand-ivory' :
                      'bg-brand-brown/10 text-brand-brown'
                    }`}>
                      {product.status === 'In Stock' ? 'Бэлэн' : product.status === 'Out of Stock' ? 'Дууссан' : 'Захиалгаар'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/admin/products/edit/${product.id}`} className="p-2 text-neutral-400 hover:text-amber-900 transition-colors">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(product.id)} className="p-2 text-neutral-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
