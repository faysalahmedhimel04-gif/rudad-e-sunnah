import Navbar from '@/components/Navbar';
import CartDrawer from '@/components/CartDrawer';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FDF9F3]">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 pt-16 pb-24">
        <div className="text-center mb-12">
          <div className="uppercase text-[#D4AF37] tracking-[4px] text-sm mb-3">Our Story</div>
          <h1 className="font-serif text-6xl tracking-[-1.8px] text-[#2C2522]">About Rudad E Sunnah</h1>
        </div>

        <div className="prose prose-lg max-w-none text-[#3F362F] leading-relaxed">
          <p className="text-2xl text-[#2C2522] tracking-tight font-serif mb-9">
            We believe that beautiful, intentional products can help us live closer to the Sunnah.
          </p>

          <p>
            Founded in 2018, Rudad E Sunnah began as a small collection of hand-picked prayer mats and attars for our own families. 
            Today, we curate the finest thobes, prayer rugs, Islamic literature, and traditional fragrances from artisans across 
            the Muslim world — all chosen with one purpose: to make following the Sunnah in daily life effortless and beautiful.
          </p>

          <div className="my-12 border-l-4 border-[#D4AF37] pl-7 text-[#5C5248]">
            “The most beloved of deeds to Allah are those done consistently, even if they are small.”<br />
            <span className="text-sm not-italic">— Prophet Muhammad ﷺ (Sahih Bukhari)</span>
          </div>

          <p>
            Every item we sell is tested for quality, sourced responsibly, and packaged with barakah. 
            We hope our collection brings barakah, beauty, and ease to your worship and your home.
          </p>
        </div>

        <div className="mt-16 flex flex-col sm:flex-row gap-4">
          <Link href="/contact" className="btn-gold inline-flex justify-center rounded-full px-9 py-4 text-base">
            Get in Touch
          </Link>
          <Link href="/#products" className="btn-outline inline-flex justify-center rounded-full px-9 py-4 text-base">
            Shop the Collection
          </Link>
        </div>
      </div>

      <CartDrawer />
    </div>
  );
}
