import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from "react";
import { Edit, ImagePlus, Loader2, Plus, Search, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { createCategory, deleteCategory, getAdminCategories, updateCategory, uploadCategoryImage } from "../../services/catalog";
import type { Category, CategoryFormValues } from "../../types/catalog";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const emptyForm: CategoryFormValues = {
  name: "",
  image: "",
  description: "",
  sortOrder: 0,
  isActive: true,
};

export function AdminCategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formValues, setFormValues] = useState<CategoryFormValues>(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getAdminCategories()
      .then((nextCategories) => {
        if (!isMounted) return;
        setCategories(nextCategories);
      })
      .catch((error) => {
        console.error(error);
        toast.error("Ангиллын мэдээлэл уншихад алдаа гарлаа.");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredCategories = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return categories;

    return categories.filter((category) =>
      [category.name, category.description]
        .join(" ")
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [categories, search]);

  const resetForm = () => {
    setEditingId(null);
    setFormValues(emptyForm);
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormValues({
      name: category.name,
      image: category.image,
      description: category.description,
      sortOrder: category.sortOrder ?? 0,
      isActive: category.isActive !== false,
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formValues.name.trim()) {
      toast.error("Ангиллын нэр оруулна уу.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingId) {
        const updatedCategory = await updateCategory(editingId, formValues);
        setCategories((currentCategories) =>
          currentCategories.map((category) => category.id === editingId ? updatedCategory : category)
        );
        toast.success("Ангилал шинэчлэгдлээ");
      } else {
        const createdCategory = await createCategory(formValues);
        setCategories((currentCategories) => [...currentCategories, createdCategory].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)));
        toast.success("Шинэ ангилал нэмэгдлээ");
      }
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error("Ангилал хадгалахад алдаа гарлаа. Admin эрх болон RLS policy-г шалгана уу.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      toast.error("JPG, PNG эсвэл WebP форматын зураг оруулна уу.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      toast.error("Зургийн хэмжээ 5MB-аас бага байх ёстой.");
      return;
    }

    setIsUploadingImage(true);
    try {
      const publicUrl = await uploadCategoryImage(file);
      setFormValues((currentValues) => ({ ...currentValues, image: publicUrl }));
      toast.success("Зураг хуулагдлаа.");
    } catch (error) {
      console.error(error);
      toast.error("Зураг хуулахад алдаа гарлаа. Supabase storage бүхэл бүртгэлийг шалгана уу.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Энэ ангиллыг устгах уу? Холбоотой бүтээгдэхүүнүүд ангилалгүй болно.")) return;

    try {
      await deleteCategory(id);
      setCategories((currentCategories) => currentCategories.filter((category) => category.id !== id));
      if (editingId === id) resetForm();
      toast.success("Ангилал устлаа");
    } catch (error) {
      console.error(error);
      toast.error("Ангилал устгахад алдаа гарлаа.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Ангилал</h1>
          <p className="text-sm text-neutral-500 mt-1">Public каталог дээр харагдах төрлүүдийг удирдана.</p>
        </div>
        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="flex items-center gap-2 px-4 py-2 text-sm border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors"
          >
            <X className="w-4 h-4" /> Засахыг цуцлах
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <form onSubmit={handleSubmit} className="xl:col-span-1 bg-white rounded-xl border border-neutral-200 shadow-sm p-6 space-y-5">
          <div>
            <h2 className="text-lg font-bold text-neutral-900">{editingId ? "Ангилал засах" : "Шинэ ангилал"}</h2>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Нэр *</label>
            <input
              value={formValues.name}
              onChange={(event) => setFormValues((currentValues) => ({ ...currentValues, name: event.target.value }))}
              className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent"
              placeholder="Даалин"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Зураг</label>
            <div className="flex items-start gap-3">
              <div className="w-24 h-24 rounded-lg border border-neutral-200 bg-neutral-50 overflow-hidden flex items-center justify-center">
                {formValues.image ? (
                  <img src={formValues.image} alt="Ангиллын зураг" className="w-full h-full object-contain" />
                ) : (
                  <ImagePlus className="w-6 h-6 text-neutral-300" />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <label className="inline-flex items-center gap-2 px-3 py-2 text-sm border border-neutral-300 rounded-lg cursor-pointer hover:bg-neutral-50 transition-colors">
                  {isUploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImagePlus className="w-4 h-4" />}
                  <span>{isUploadingImage ? "Хуулж байна..." : formValues.image ? "Зураг солих" : "Төхөөрөмжөөс сонгох"}</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    disabled={isUploadingImage}
                    onChange={handleImageChange}
                  />
                </label>
                {formValues.image && (
                  <button
                    type="button"
                    onClick={() => setFormValues((currentValues) => ({ ...currentValues, image: "" }))}
                    className="text-xs text-neutral-500 hover:text-red-600 transition-colors"
                  >
                    Зураг хасах
                  </button>
                )}
                <p className="text-xs text-neutral-400">JPG, PNG, WebP – 5MB-хүртэл</p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Тайлбар</label>
            <textarea
              value={formValues.description}
              onChange={(event) => setFormValues((currentValues) => ({ ...currentValues, description: event.target.value }))}
              rows={4}
              className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Дараалал</label>
            <input
              type="number"
              value={formValues.sortOrder}
              onChange={(event) => setFormValues((currentValues) => ({ ...currentValues, sortOrder: Number(event.target.value) }))}
              className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent"
            />
          </div>

          <label className="flex items-center gap-3 text-sm font-medium text-neutral-700">
            <input
              type="checkbox"
              checked={formValues.isActive}
              onChange={(event) => setFormValues((currentValues) => ({ ...currentValues, isActive: event.target.checked }))}
              className="w-4 h-4 accent-amber-900"
            />
            Public site дээр харуулах
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-900 text-white rounded-lg py-3 font-medium hover:bg-amber-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Plus className="w-4 h-4" /> {isSubmitting ? "Хадгалж байна..." : editingId ? "Шинэчлэх" : "Нэмэх"}
          </button>
        </form>

        <div className="xl:col-span-2 bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-neutral-200 flex justify-between items-center bg-neutral-50">
            <div className="relative w-full max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Ангилал хайх..."
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
                  <th className="px-6 py-4">Ангилал</th>
                  <th className="px-6 py-4">Дараалал</th>
                  <th className="px-6 py-4">Төлөв</th>
                  <th className="px-6 py-4 text-right">Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr key={category.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img src={category.image} alt={category.name} className="w-12 h-12 rounded-md object-cover bg-neutral-100" />
                        <div>
                          <div className="font-medium text-neutral-900">{category.name}</div>
                          <div className="text-xs text-neutral-500 line-clamp-1">{category.description || "Тайлбаргүй"}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-neutral-500">{category.sortOrder ?? 0}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-sm ${category.isActive !== false ? "bg-brand-green/10 text-brand-green" : "bg-neutral-100 text-neutral-500"}`}>
                        {category.isActive !== false ? "Идэвхтэй" : "Нуусан"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button type="button" onClick={() => handleEdit(category)} className="p-2 text-neutral-400 hover:text-amber-900 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button type="button" onClick={() => handleDelete(category.id)} className="p-2 text-neutral-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-16 text-neutral-500">Ангилал олдсонгүй.</div>
          )}
        </div>
      </div>
    </div>
  );
}
