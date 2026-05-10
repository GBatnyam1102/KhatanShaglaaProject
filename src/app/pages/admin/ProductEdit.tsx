import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import { Dropzone } from "../../components/Dropzone";
import { createProduct, getCategories, getProductById, updateProduct, uploadProductImages } from "../../services/catalog";
import type { Category, Product, ProductFormValues } from "../../types/catalog";

export function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<ProductFormValues>({
    defaultValues: {
      name: "",
      price: 0,
      categoryId: "",
      status: "In Stock",
      description: "",
      isFeatured: false,
      isPublished: true,
    }
  });

  useEffect(() => {
    let isMounted = true;

    Promise.all([
      getCategories(),
      id ? getProductById(id) : Promise.resolve(null),
    ])
      .then(([nextCategories, nextProduct]) => {
        if (!isMounted) return;
        setCategories(nextCategories);

        const selectedProduct = nextProduct;
        setProduct(selectedProduct);
        setPreviewImages(selectedProduct?.images ?? []);

        if (selectedProduct) {
          reset({
            name: selectedProduct.name,
            price: selectedProduct.price,
            categoryId: selectedProduct.categoryId,
            status: selectedProduct.status,
            description: selectedProduct.description,
            isFeatured: Boolean(selectedProduct.isFeatured),
            isPublished: selectedProduct.isPublished !== false,
          });
        } else if (nextCategories[0]) {
          reset({
            name: "",
            price: 0,
            categoryId: nextCategories[0].id,
            status: "In Stock",
            description: "",
            isFeatured: false,
            isPublished: true,
          });
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Бүтээгдэхүүний мэдээлэл уншихад алдаа гарлаа.");
      });

    return () => {
      isMounted = false;
    };
  }, [id, reset]);

  const handleUpload = (files: File[]) => {
    setPendingFiles((currentFiles) => [...currentFiles, ...files]);
    setPreviewImages((currentImages) => [
      ...currentImages,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const onSubmit = async (data: ProductFormValues) => {
    try {
      const savedProduct = isEdit && id
        ? await updateProduct(id, data)
        : await createProduct(data);

      if (pendingFiles.length > 0) {
        await uploadProductImages(savedProduct.id, pendingFiles);
      }

      toast.success(isEdit ? "Бүтээгдэхүүн шинэчлэгдлээ" : "Шинэ бүтээгдэхүүн нэмэгдлээ");
      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      toast.error("Бүтээгдэхүүн хадгалахад алдаа гарлаа. Supabase admin эрх болон RLS policy-г шалгана уу.");
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-lg border border-neutral-200 text-neutral-600 hover:text-amber-900">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-neutral-900">
          {isEdit ? "Бүтээгдэхүүн засах" : "Шинэ бүтээгдэхүүн"}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-2">Үндсэн мэдээлэл</h2>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Нэр *</label>
                <input 
                  {...register("name", { required: true })}
                  className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Тайлбар</label>
                <textarea 
                  {...register("description")}
                  rows={6}
                  className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent resize-y"
                />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-2">Зураг</h2>
              <Dropzone onUpload={handleUpload} images={previewImages} />
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-2">Төлөв</h2>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Төлөв</label>
                <select 
                  {...register("status")}
                  className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-900"
                >
                  <option value="In Stock">Бэлэн</option>
                  <option value="Out of Stock">Дууссан</option>
                  <option value="Made to Order">Захиалгаар</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="featured"
                  {...register("isFeatured")}
                  className="w-4 h-4 accent-amber-900"
                />
                <label htmlFor="featured" className="text-sm font-medium text-neutral-700">Онцлох бүтээгдэхүүн</label>
              </div>

              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  id="published"
                  {...register("isPublished")}
                  className="w-4 h-4 accent-amber-900"
                />
                <label htmlFor="published" className="text-sm font-medium text-neutral-700">Сайт дээр нийтлэх</label>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-neutral-900 border-b border-neutral-100 pb-2">Ангилал & Үнэ</h2>
              
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Ангилал</label>
                <select 
                  {...register("categoryId")}
                  className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-900"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Үнэ (₮) *</label>
                <input 
                  type="number"
                  {...register("price", { required: true, valueAsNumber: true })}
                  className="w-full border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-900"
                />
              </div>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-900 text-white rounded-lg py-3 font-medium hover:bg-amber-800 transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {isSubmitting ? "Хадгалж байна..." : "Хадгалах"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
