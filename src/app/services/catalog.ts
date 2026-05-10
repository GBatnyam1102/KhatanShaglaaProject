import { getSupabaseClient } from "../lib/supabase";
import type {
  Category,
  CategoryFormValues,
  DashboardSummary,
  Inquiry,
  InquiryInput,
  InquiryStatus,
  Product,
  ProductFormValues,
} from "../types/catalog";

interface CategoryRow {
  id: string;
  name: string;
  image_url: string | null;
  description: string | null;
  sort_order: number;
  is_active: boolean;
}

interface ProductRow {
  id: string;
  category_id: string | null;
  name: string;
  price: number;
  description: string | null;
  status: Product["status"];
  is_featured: boolean;
  is_published: boolean;
  sort_order: number;
}

interface ProductImageRow {
  id: string;
  product_id: string;
  url: string;
  path: string | null;
  alt_text: string | null;
  sort_order: number;
}

interface InquiryRow {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string;
  status: InquiryStatus;
  created_at: string;
}

const PRODUCT_IMAGES_BUCKET = "product-images";
const CATEGORY_IMAGES_BUCKET = "category-images";
const BRANDING_BUCKET = "branding";
const BRAND_LOGO_PATH = "logo_main1.png";
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1649300726285-19ac2b1c3654?q=80&w=1080";
const CATEGORY_SELECT = "id, name, image_url, description, sort_order, is_active";
const PRODUCT_SELECT = "id, category_id, name, price, description, status, is_featured, is_published, sort_order";
const PRODUCT_IMAGE_SELECT = "id, product_id, url, path, alt_text, sort_order";
const INQUIRY_SELECT = "id, name, phone, email, message, status, created_at";

function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    image: row.image_url || FALLBACK_IMAGE,
    description: row.description || "",
    sortOrder: row.sort_order,
    isActive: row.is_active,
  };
}

function mapProduct(row: ProductRow, images: ProductImageRow[]): Product {
  const productImages = images
    .filter((image) => image.product_id === row.id)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((image) => image.url);

  return {
    id: row.id,
    name: row.name,
    price: row.price,
    categoryId: row.category_id || "",
    image: productImages[0] || FALLBACK_IMAGE,
    images: productImages.length > 0 ? productImages : [FALLBACK_IMAGE],
    description: row.description || "",
    isFeatured: row.is_featured,
    isPublished: row.is_published,
    status: row.status,
    sortOrder: row.sort_order,
  };
}

function mapInquiry(row: InquiryRow): Inquiry {
  return {
    id: row.id,
    productId: null,
    name: row.name,
    phone: row.phone,
    email: row.email,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function getCategories(): Promise<Category[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("categories")
    .select(CATEGORY_SELECT)
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw error;
  return ((data || []) as CategoryRow[]).map(mapCategory);
}

export async function getAdminCategories(): Promise<Category[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("categories")
    .select(CATEGORY_SELECT)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) throw error;
  return ((data || []) as CategoryRow[]).map(mapCategory);
}

export async function createCategory(values: CategoryFormValues): Promise<Category> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("categories")
    .insert({
      name: values.name,
      image_url: values.image || null,
      description: values.description || null,
      sort_order: values.sortOrder,
      is_active: values.isActive,
    })
    .select(CATEGORY_SELECT)
    .single();

  if (error) throw error;
  return mapCategory(data as CategoryRow);
}

export async function updateCategory(id: string, values: CategoryFormValues): Promise<Category> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("categories")
    .update({
      name: values.name,
      image_url: values.image || null,
      description: values.description || null,
      sort_order: values.sortOrder,
      is_active: values.isActive,
    })
    .eq("id", id)
    .select(CATEGORY_SELECT)
    .single();

  if (error) throw error;
  return mapCategory(data as CategoryRow);
}

export async function deleteCategory(id: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}

export async function getProducts(): Promise<Product[]> {
  const supabase = getSupabaseClient();
  const [{ data: products, error: productsError }, { data: images, error: imagesError }] = await Promise.all([
    supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("is_published", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
    supabase
      .from("product_images")
      .select(PRODUCT_IMAGE_SELECT)
      .order("sort_order", { ascending: true }),
  ]);

  if (productsError) throw productsError;
  if (imagesError) throw imagesError;

  return ((products || []) as ProductRow[]).map((product) => mapProduct(product, (images || []) as ProductImageRow[]));
}

export async function getAdminProducts(): Promise<Product[]> {
  const supabase = getSupabaseClient();
  const [{ data: products, error: productsError }, { data: images, error: imagesError }] = await Promise.all([
    supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false }),
    supabase
      .from("product_images")
      .select(PRODUCT_IMAGE_SELECT)
      .order("sort_order", { ascending: true }),
  ]);

  if (productsError) throw productsError;
  if (imagesError) throw imagesError;

  return ((products || []) as ProductRow[]).map((product) => mapProduct(product, (images || []) as ProductImageRow[]));
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = getSupabaseClient();
  const [{ data: product, error: productError }, { data: images, error: imagesError }] = await Promise.all([
    supabase
      .from("products")
      .select(PRODUCT_SELECT)
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("product_images")
      .select(PRODUCT_IMAGE_SELECT)
      .eq("product_id", id)
      .order("sort_order", { ascending: true }),
  ]);

  if (productError) throw productError;
  if (imagesError) throw imagesError;
  if (!product) return null;

  return mapProduct(product as ProductRow, (images || []) as ProductImageRow[]);
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const [products, categories, inquiries] = await Promise.all([getAdminProducts(), getAdminCategories(), getInquiries()]);

  return {
    products,
    categories,
    inquiries,
    publishedProducts: products.filter((product) => product.isPublished !== false).length,
    imageCount: products.reduce((total, product) => total + product.images.length, 0),
    newInquiries: inquiries.filter((inquiry) => inquiry.status === "new").length,
  };
}

export async function createProduct(values: ProductFormValues): Promise<Product> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .insert({
      category_id: values.categoryId || null,
      name: values.name,
      price: values.price,
      description: values.description,
      status: values.status,
      is_featured: values.isFeatured,
      is_published: values.isPublished,
    })
    .select(PRODUCT_SELECT)
    .single();

  if (error) throw error;
  return mapProduct(data as ProductRow, []);
}

export async function updateProduct(id: string, values: ProductFormValues): Promise<Product> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .update({
      category_id: values.categoryId || null,
      name: values.name,
      price: values.price,
      description: values.description,
      status: values.status,
      is_featured: values.isFeatured,
      is_published: values.isPublished,
    })
    .eq("id", id)
    .select(PRODUCT_SELECT)
    .single();

  if (error) throw error;
  return mapProduct(data as ProductRow, []);
}

export async function deleteProduct(id: string): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

export async function uploadProductImages(productId: string, files: File[]): Promise<string[]> {
  const supabase = getSupabaseClient();
  const urls: string[] = [];

  for (const file of files) {
    const extension = file.name.split(".").pop() || "jpg";
    const path = `${productId}/${crypto.randomUUID()}.${extension}`;
    const { error: uploadError } = await supabase.storage.from(PRODUCT_IMAGES_BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path);
    const publicUrl = data.publicUrl;

    const { error: imageError } = await supabase.from("product_images").insert({
      product_id: productId,
      url: publicUrl,
      path,
      alt_text: file.name,
      sort_order: urls.length + 1,
    });

    if (imageError) throw imageError;
    urls.push(publicUrl);
  }

  return urls;
}

export async function createInquiry(values: InquiryInput): Promise<void> {
  const supabase = getSupabaseClient();
  const { error } = await supabase.from("inquiries").insert({
    name: values.name,
    phone: values.phone,
    email: values.email || null,
    message: values.message,
  });

  if (error) throw error;
}

export async function getInquiries(): Promise<Inquiry[]> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("inquiries")
    .select(INQUIRY_SELECT)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return ((data || []) as InquiryRow[]).map(mapInquiry);
}

export async function updateInquiryStatus(id: string, status: InquiryStatus): Promise<Inquiry> {
  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from("inquiries")
    .update({ status })
    .eq("id", id)
    .select(INQUIRY_SELECT)
    .single();

  if (error) throw error;
  return mapInquiry(data as InquiryRow);
}

export async function uploadCategoryImage(file: File): Promise<string> {
  const supabase = getSupabaseClient();
  const extension = file.name.split(".").pop() || "jpg";
  const path = `${crypto.randomUUID()}.${extension}`;

  const { error: uploadError } = await supabase.storage.from(CATEGORY_IMAGES_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from(CATEGORY_IMAGES_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export function getBrandLogoUrl(): string | null {
  try {
    const supabase = getSupabaseClient();
    const { data } = supabase.storage.from(BRANDING_BUCKET).getPublicUrl(BRAND_LOGO_PATH);
    return data.publicUrl;
  } catch {
    return null;
  }
}
