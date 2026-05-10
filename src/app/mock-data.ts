import type { Category, Product } from "./types/catalog";

export type { Category, Product };

export const CATEGORIES: Category[] = [
  { id: 'c1', name: 'Даалин', image: 'https://images.unsplash.com/photo-1717528609573-e1130ec0bf26?q=80&w=1080', description: 'Уламжлалт хөөрөгний даалин', isActive: true, sortOrder: 1 },
  { id: 'c2', name: 'Хавтага', image: 'https://images.unsplash.com/photo-1761739744009-0fc7974ea19f?q=80&w=1080', description: 'Эмэгтэй хүний гоёлын хавтага', isActive: true, sortOrder: 2 },
  { id: 'c3', name: 'Торго, утас', image: 'https://images.unsplash.com/photo-1625479141767-715ceef6b310?q=80&w=1080', description: 'Дээд зэргийн чанартай торго, зүү ороох утас', isActive: true, sortOrder: 3 },
  { id: 'c4', name: 'Бэлдэц', image: 'https://images.unsplash.com/photo-1769192931923-14c28a0a9fa5?q=80&w=1080', description: 'Оёход бэлэн бэлдэц, хээний хуулбар', isActive: true, sortOrder: 4 }
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Хаан хээтэй их гарын даалин',
    price: 1500000,
    categoryId: 'c1',
    image: 'https://images.unsplash.com/photo-1717528609573-e1130ec0bf26?q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1717528609573-e1130ec0bf26?q=80&w=1080', 'https://images.unsplash.com/photo-1649300726285-19ac2b1c3654?q=80&w=1080'],
    description: 'Зүү ороох оёдлоор бүтэн 6 сар урласан, хаан хээтэй, дээд зэрэглэлийн торгон даалин.',
    isFeatured: true,
    status: 'In Stock'
  },
  {
    id: 'p2',
    name: 'Хатан хээт дунд гарын хавтага',
    price: 850000,
    categoryId: 'c2',
    image: 'https://images.unsplash.com/photo-1761739744009-0fc7974ea19f?q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1761739744009-0fc7974ea19f?q=80&w=1080'],
    description: 'Гар аргаар нямбайлан оёсон гоёмсог хавтага. Эмэгтэй хүний гоёлын салшгүй хэсэг.',
    isFeatured: true,
    status: 'Made to Order'
  },
  {
    id: 'p3',
    name: 'Зүү ороох утасны иж бүрдэл',
    price: 120000,
    categoryId: 'c3',
    image: 'https://images.unsplash.com/photo-1625479141767-715ceef6b310?q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1625479141767-715ceef6b310?q=80&w=1080'],
    description: 'Уламжлалт зүү ороох оёдолд зориулсан 24 өнгийн бат бөх торгон утас.',
    isFeatured: false,
    status: 'In Stock'
  },
  {
    id: 'p4',
    name: 'Даалингийн бэлдэц - Угалз хээ',
    price: 45000,
    categoryId: 'c4',
    image: 'https://images.unsplash.com/photo-1769192931923-14c28a0a9fa5?q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1769192931923-14c28a0a9fa5?q=80&w=1080'],
    description: 'Өөрөө оёх хүсэлтэй хүмүүст зориулсан хээг нь буулгасан даалингийн бэлдэц.',
    isFeatured: true,
    status: 'In Stock'
  },
  {
    id: 'p5',
    name: 'Шүрэн чимэглэлтэй хавтага',
    price: 950000,
    categoryId: 'c2',
    image: 'https://images.unsplash.com/photo-1772124713992-1e9a31d59194?q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1772124713992-1e9a31d59194?q=80&w=1080'],
    description: 'Гоёмсог шүр, сувдан чимэглэлтэй дээд зэрэглэлийн хавтага.',
    isFeatured: false,
    status: 'In Stock'
  },
  {
    id: 'p6',
    name: 'Алтан утаст даалин',
    price: 2100000,
    categoryId: 'c1',
    image: 'https://images.unsplash.com/photo-1649300726285-19ac2b1c3654?q=80&w=1080',
    images: ['https://images.unsplash.com/photo-1649300726285-19ac2b1c3654?q=80&w=1080'],
    description: 'Жинхэнэ алтан утсаар хээлж урласан цор ганц бүтээл.',
    isFeatured: true,
    status: 'Out of Stock'
  }
];
