create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text not null default 'admin' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  image_url text,
  description text,
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  name text not null,
  price integer not null default 0 check (price >= 0),
  description text,
  status text not null default 'In Stock' check (status in ('In Stock', 'Out of Stock', 'Made to Order')),
  is_featured boolean not null default false,
  is_published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  path text,
  alt_text text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'closed')),
  created_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists categories_set_updated_at on public.categories;
create trigger categories_set_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create or replace function public.is_admin(user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = user_id
      and role in ('admin', 'editor')
  );
$$;

alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.inquiries enable row level security;

drop policy if exists profiles_select_own_or_admin on public.profiles;
create policy profiles_select_own_or_admin
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.is_admin(auth.uid()));

drop policy if exists profiles_update_admin on public.profiles;
create policy profiles_update_admin
on public.profiles
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists categories_public_select on public.categories;
create policy categories_public_select
on public.categories
for select
to anon, authenticated
using (is_active = true);

drop policy if exists categories_admin_all on public.categories;
create policy categories_admin_all
on public.categories
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists products_public_select on public.products;
create policy products_public_select
on public.products
for select
to anon, authenticated
using (is_published = true);

drop policy if exists products_admin_all on public.products;
create policy products_admin_all
on public.products
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists product_images_public_select on public.product_images;
create policy product_images_public_select
on public.product_images
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.products
    where products.id = product_images.product_id
      and products.is_published = true
  )
);

drop policy if exists product_images_admin_all on public.product_images;
create policy product_images_admin_all
on public.product_images
for all
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

drop policy if exists inquiries_public_insert on public.inquiries;
create policy inquiries_public_insert
on public.inquiries
for insert
to anon, authenticated
with check (true);

drop policy if exists inquiries_admin_select on public.inquiries;
create policy inquiries_admin_select
on public.inquiries
for select
to authenticated
using (public.is_admin(auth.uid()));

drop policy if exists inquiries_admin_update on public.inquiries;
create policy inquiries_admin_update
on public.inquiries
for update
to authenticated
using (public.is_admin(auth.uid()))
with check (public.is_admin(auth.uid()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists product_images_storage_public_select on storage.objects;
create policy product_images_storage_public_select
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'product-images');

drop policy if exists product_images_storage_admin_insert on storage.objects;
create policy product_images_storage_admin_insert
on storage.objects
for insert
to authenticated
with check (bucket_id = 'product-images' and public.is_admin(auth.uid()));

drop policy if exists product_images_storage_admin_update on storage.objects;
create policy product_images_storage_admin_update
on storage.objects
for update
to authenticated
using (bucket_id = 'product-images' and public.is_admin(auth.uid()))
with check (bucket_id = 'product-images' and public.is_admin(auth.uid()));

drop policy if exists product_images_storage_admin_delete on storage.objects;
create policy product_images_storage_admin_delete
on storage.objects
for delete
to authenticated
using (bucket_id = 'product-images' and public.is_admin(auth.uid()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('category-images', 'category-images', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists category_images_storage_public_select on storage.objects;
create policy category_images_storage_public_select
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'category-images');

drop policy if exists category_images_storage_admin_insert on storage.objects;
create policy category_images_storage_admin_insert
on storage.objects
for insert
to authenticated
with check (bucket_id = 'category-images' and public.is_admin(auth.uid()));

drop policy if exists category_images_storage_admin_update on storage.objects;
create policy category_images_storage_admin_update
on storage.objects
for update
to authenticated
using (bucket_id = 'category-images' and public.is_admin(auth.uid()))
with check (bucket_id = 'category-images' and public.is_admin(auth.uid()));

drop policy if exists category_images_storage_admin_delete on storage.objects;
create policy category_images_storage_admin_delete
on storage.objects
for delete
to authenticated
using (bucket_id = 'category-images' and public.is_admin(auth.uid()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('branding', 'branding', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'])
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists branding_storage_public_select on storage.objects;
create policy branding_storage_public_select
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'branding');

drop policy if exists branding_storage_admin_insert on storage.objects;
create policy branding_storage_admin_insert
on storage.objects
for insert
to authenticated
with check (bucket_id = 'branding' and public.is_admin(auth.uid()));

drop policy if exists branding_storage_admin_update on storage.objects;
create policy branding_storage_admin_update
on storage.objects
for update
to authenticated
using (bucket_id = 'branding' and public.is_admin(auth.uid()))
with check (bucket_id = 'branding' and public.is_admin(auth.uid()));

drop policy if exists branding_storage_admin_delete on storage.objects;
create policy branding_storage_admin_delete
on storage.objects
for delete
to authenticated
using (bucket_id = 'branding' and public.is_admin(auth.uid()));

insert into public.categories (id, name, image_url, description, sort_order, is_active)
values
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'Даалин', 'https://images.unsplash.com/photo-1717528609573-e1130ec0bf26?q=80&w=1080', 'Уламжлалт хөөрөгний даалин', 1, true),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'Хавтага', 'https://images.unsplash.com/photo-1761739744009-0fc7974ea19f?q=80&w=1080', 'Эмэгтэй хүний гоёлын хавтага', 2, true),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3', 'Торго, утас', 'https://images.unsplash.com/photo-1625479141767-715ceef6b310?q=80&w=1080', 'Дээд зэргийн чанартай торго, зүү ороох утас', 3, true),
  ('aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4', 'Бэлдэц', 'https://images.unsplash.com/photo-1769192931923-14c28a0a9fa5?q=80&w=1080', 'Оёход бэлэн бэлдэц, хээний хуулбар', 4, true)
on conflict (id) do update set
  name = excluded.name,
  image_url = excluded.image_url,
  description = excluded.description,
  sort_order = excluded.sort_order,
  is_active = excluded.is_active;

insert into public.products (id, category_id, name, price, description, status, is_featured, is_published, sort_order)
values
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'Хаан хээтэй их гарын даалин', 1500000, 'Зүү ороох оёдлоор бүтэн 6 сар урласан, хаан хээтэй, дээд зэрэглэлийн торгон даалин.', 'In Stock', true, true, 1),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'Хатан хээт дунд гарын хавтага', 850000, 'Гар аргаар нямбайлан оёсон гоёмсог хавтага. Эмэгтэй хүний гоёлын салшгүй хэсэг.', 'Made to Order', true, true, 2),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb3', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3', 'Зүү ороох утасны иж бүрдэл', 120000, 'Уламжлалт зүү ороох оёдолд зориулсан 24 өнгийн бат бөх торгон утас.', 'In Stock', false, true, 3),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb4', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4', 'Даалингийн бэлдэц - Угалз хээ', 45000, 'Өөрөө оёх хүсэлтэй хүмүүст зориулсан хээг нь буулгасан даалингийн бэлдэц.', 'In Stock', true, true, 4),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb5', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', 'Шүрэн чимэглэлтэй хавтага', 950000, 'Гоёмсог шүр, сувдан чимэглэлтэй дээд зэрэглэлийн хавтага.', 'In Stock', false, true, 5),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb6', 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', 'Алтан утаст даалин', 2100000, 'Жинхэнэ алтан утсаар хээлж урласан цор ганц бүтээл.', 'Out of Stock', true, true, 6)
on conflict (id) do update set
  category_id = excluded.category_id,
  name = excluded.name,
  price = excluded.price,
  description = excluded.description,
  status = excluded.status,
  is_featured = excluded.is_featured,
  is_published = excluded.is_published,
  sort_order = excluded.sort_order;

insert into public.product_images (product_id, url, path, alt_text, sort_order)
values
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'https://images.unsplash.com/photo-1717528609573-e1130ec0bf26?q=80&w=1080', null, 'Хаан хээтэй их гарын даалин', 1),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', 'https://images.unsplash.com/photo-1649300726285-19ac2b1c3654?q=80&w=1080', null, 'Хаан хээтэй их гарын даалин', 2),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2', 'https://images.unsplash.com/photo-1761739744009-0fc7974ea19f?q=80&w=1080', null, 'Хатан хээт дунд гарын хавтага', 1),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb3', 'https://images.unsplash.com/photo-1625479141767-715ceef6b310?q=80&w=1080', null, 'Зүү ороох утасны иж бүрдэл', 1),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb4', 'https://images.unsplash.com/photo-1769192931923-14c28a0a9fa5?q=80&w=1080', null, 'Даалингийн бэлдэц - Угалз хээ', 1),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb5', 'https://images.unsplash.com/photo-1772124713992-1e9a31d59194?q=80&w=1080', null, 'Шүрэн чимэглэлтэй хавтага', 1),
  ('bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb6', 'https://images.unsplash.com/photo-1649300726285-19ac2b1c3654?q=80&w=1080', null, 'Алтан утаст даалин', 1)
on conflict do nothing;
