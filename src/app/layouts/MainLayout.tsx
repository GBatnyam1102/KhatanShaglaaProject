import { Outlet, Link, useLocation } from "react-router";
import { Facebook, Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { getBrandLogoUrl } from "../services/catalog";

const FALLBACK_LOGO = "/logo.png";
const FACEBOOK_URL = "https://facebook.com/khatanshaglaa";

export function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [logoSrc, setLogoSrc] = useState<string>(() => getBrandLogoUrl() ?? FALLBACK_LOGO);

  const navLinks = [
    { name: "Нүүр", path: "/" },
    { name: "Бүтээгдэхүүн", path: "/catalog" },
    { name: "Урлалын түүх", path: "/story" },
    { name: "Бидний тухай", path: "/about" },
    { name: "Холбоо барих", path: "/contact" },
  ];

  return (
    <div className="min-h-screen bg-brand-ivory text-brand-black font-sans selection:bg-brand-brown selection:text-brand-ivory flex flex-col">
      {/* Top Bar */}
      <div className="bg-brand-brown text-brand-ivory text-xs py-2 text-center tracking-wider px-4">
        УЛАМЖЛАЛАА УРЛАЖ, ҮНЭ ЦЭНИЙГ БҮТЭЭНЭ
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 bg-brand-ivory/90 backdrop-blur-md border-b border-brand-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 -ml-2 text-brand-black hover:text-brand-brown transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center gap-3">
            <img
              src={logoSrc}
              alt="Хатан шаглаа"
              onError={() => setLogoSrc(FALLBACK_LOGO)}
              className="h-10 w-10 md:h-12 md:w-12 object-contain"
            />
            <span className="text-xl md:text-2xl font-bold text-brand-brown tracking-tight font-serif uppercase">
              Хатан шаглаа
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm uppercase tracking-wide font-medium transition-colors hover:text-brand-brown ${
                  location.pathname === link.path ? "text-brand-brown border-b-2 border-brand-brown pb-1" : "text-brand-black/70"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="p-2 text-brand-black hover:text-brand-brown transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <Link
              to="/catalog"
              aria-label="Бүтээгдэхүүн хайх"
              className="p-2 text-brand-black hover:text-brand-brown transition-colors"
            >
              <Search className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed inset-0 z-[60] bg-brand-ivory md:hidden"
          >
            <div className="p-4 flex justify-between items-center border-b border-brand-sand">
              <div className="flex items-center gap-2">
                <img
                  src={logoSrc}
                  alt="Хатан шаглаа"
                  onError={() => setLogoSrc(FALLBACK_LOGO)}
                  className="h-9 w-9 object-contain"
                />
                <span className="text-lg font-bold text-brand-brown font-serif uppercase">Хатан шаглаа</span>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-brand-black">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`text-lg uppercase tracking-wide font-medium ${
                    location.pathname === link.path ? "text-brand-brown" : "text-brand-black/70"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 flex flex-col">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-brand-black text-brand-ivory pt-16 pb-8 border-t-4 border-brand-brown">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={logoSrc}
                  alt="Хатан шаглаа"
                  onError={() => setLogoSrc(FALLBACK_LOGO)}
                  className="h-12 w-12 object-contain bg-brand-ivory/10 rounded-sm p-1"
                />
                <span className="text-2xl font-bold text-brand-gold tracking-tight font-serif uppercase">
                  Хатан шаглаа
                </span>
              </div>
              <p className="text-brand-sand text-sm leading-relaxed mb-4 opacity-80">
                Монгол үндэсний зүү ороох оёдлын гайхамшгийг орчин үеийн хэрэглээтэй хослуулан урлав.
              </p>
              <div className="flex items-center gap-3">
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-brand-sand/30 text-brand-sand hover:text-brand-gold hover:border-brand-gold transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-brand-gold mb-4">Холбоос</h3>
              <ul className="space-y-3 text-brand-sand opacity-80 text-sm">
                <li><Link to="/catalog" className="hover:text-brand-gold hover:opacity-100 transition">Бүтээгдэхүүн</Link></li>
                <li><Link to="/story" className="hover:text-brand-gold hover:opacity-100 transition">Урлалын түүх</Link></li>
                <li><Link to="/about" className="hover:text-brand-gold hover:opacity-100 transition">Бидний тухай</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-brand-gold mb-4">Тусламж</h3>
              <ul className="space-y-3 text-brand-sand opacity-80 text-sm">
                <li><Link to="/contact" className="hover:text-brand-gold hover:opacity-100 transition">Холбоо барих</Link></li>
                <li><a href="#" className="hover:text-brand-gold hover:opacity-100 transition">Хүргэлтийн нөхцөл</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-brand-gold mb-4">Холбоо барих</h3>
              <ul className="space-y-3 text-brand-sand opacity-80 text-sm">
                <li>Утас: +976 8538-3888</li>
                <li>И-мэйл: info@khatanshaglaa.mn</li>
                <li>Хаяг: Өвөрхангай, Арвайхээр сум Оргилын Ундраа төвийн 1 давхарт</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-brand-sand/20 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-brand-sand opacity-60">
            <p>&copy; {new Date().getFullYear()} Хатан шаглаа. Бүх эрх хуулиар хамгаалагдсан.</p>
            {/*<div className="mt-4 md:mt-0 flex gap-4">*/}
            {/*  <Link to="/admin/login" className="hover:text-brand-gold hover:opacity-100 transition">Админ нэвтрэх</Link>*/}
            {/*</div>*/}
          </div>
        </div>
      </footer>
    </div>
  );
}
