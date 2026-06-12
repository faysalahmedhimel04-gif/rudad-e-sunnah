import { Product, Category } from './types';

// Curated premium products for Rudad E Sunnah
// Images sourced from high-quality free photography (Unsplash) for luxury feel
// TODO: Replace with real product photography when available. All prices in USD.

export const products: Product[] = [
  {
    id: 1,
    name: "Classic White Thobe",
    price: 89,
    image: "https://images.unsplash.com/photo-1609505848912-b7c3b8b7da3a?w=800&q=80",
    category: "Thobes",
    description: "Premium Egyptian cotton thobe with subtle embroidery. Perfect for daily prayers and Eid.",
    inStock: true,
  },
  {
    id: 2,
    name: "Embroidered Midnight Thobe",
    price: 129,
    image: "https://images.unsplash.com/photo-1581054953454-113f2a2a7f4c?w=800&q=80",
    category: "Thobes",
    description: "Luxurious deep navy thobe featuring handcrafted gold thread embroidery on the collar and cuffs.",
    inStock: true,
  },
  {
    id: 3,
    name: "Damascus Prayer Mat",
    price: 65,
    image: "https://images.unsplash.com/photo-1564769625688-6f2d85aac352?w=800&q=80",
    category: "Prayer Mats",
    description: "Handwoven premium prayer rug from Damascus. Soft, durable, with intricate traditional Islamic geometric patterns.",
    inStock: true,
  },
  {
    id: 4,
    name: "Saffron Gold Prayer Mat",
    price: 78,
    image: "https://images.unsplash.com/photo-1591604466107-4f1b4a3b3a3a?w=800&q=80",
    category: "Prayer Mats",
    description: "Elegant saffron and ivory prayer mat. Plush velvet pile with a beautiful mihrab arch design.",
    inStock: true,
  },
  {
    id: 5,
    name: "Leather-Bound Sahih Bukhari",
    price: 54,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
    category: "Islamic Books",
    description: "Premium English translation of Sahih al-Bukhari in genuine leather binding with gold foil stamping.",
    inStock: true,
  },
  {
    id: 6,
    name: "The Noble Quran - Gold Edition",
    price: 72,
    image: "https://images.unsplash.com/photo-1609599006353-e629aaab1ed3?w=800&q=80",
    category: "Islamic Books",
    description: "Beautiful Arabic-English Quran with luxurious gold-embossed cover and premium satin ribbon marker.",
    inStock: true,
  },
  {
    id: 7,
    name: "Royal Oud Attar",
    price: 95,
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80",
    category: "Attar",
    description: "Exquisite 100% pure oud attar from premium Indonesian agarwood. 12ml hand-blown crystal bottle.",
    inStock: true,
  },
  {
    id: 8,
    name: "Amber Rose Attar",
    price: 68,
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
    category: "Attar",
    description: "Delicate blend of Damascus rose, amber, and saffron. Alcohol-free, long-lasting traditional perfume.",
    inStock: true,
  },
];

// Featured Categories - exactly 4 as per spec
export const categories: Category[] = [
  {
    id: 1,
    name: "Thobes",
    slug: "thobes",
    description: "Premium handcrafted thobes in Egyptian cotton and fine fabrics",
    image: "https://images.unsplash.com/photo-1609505848912-b7c3b8b7da3a?w=800&q=80",
  },
  {
    id: 2,
    name: "Prayer Mats",
    slug: "prayer-mats",
    description: "Beautifully woven prayer rugs with traditional Islamic designs",
    image: "https://images.unsplash.com/photo-1564769625688-6f2d85aac352?w=800&q=80",
  },
  {
    id: 3,
    name: "Islamic Books",
    slug: "islamic-books",
    description: "Timeless Islamic literature, Quran translations and hadith collections",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80",
  },
  {
    id: 4,
    name: "Attar",
    slug: "attar",
    description: "Pure, alcohol-free traditional Arabian & Islamic fragrances",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&q=80",
  },
];
