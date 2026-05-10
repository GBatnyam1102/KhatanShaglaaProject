export function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
      <span className="text-amber-900 font-bold tracking-widest uppercase text-sm mb-4 block">Бидний тухай</span>
      <h1 className="text-4xl md:text-5xl font-serif text-neutral-900 mb-12">Хатан шаглаа брэнд</h1>
      
      <div className="prose prose-lg mx-auto text-neutral-600 text-left">
        <p>
          "Хатан шаглаа" брэнд нь 2020 онд үүсгэн байгуулагдсан бөгөөд Монгол үндэсний уламжлалт зүү ороох оёдлын гайхамшгийг орчин үеийн хэрэглээтэй хослуулан урлаж, түгээн дэлгэрүүлэх зорилготой ажиллаж байна.
        </p>
        <p>
          Бид хамгийн сайн чанарын торго, утас, материалыг ашиглан дахин давтагдашгүй цор ганц бүтээлүүдийг урладаг.
        </p>
        <p>
          Бидний алсын хараа бол Монгол өв соёлоо дэлхийд таниулах, өвлүүлэн үлдээхэд бодит хувь нэмэр оруулах явдал юм.
        </p>
      </div>

      <div className="mt-20">
        <img 
          src="https://images.unsplash.com/photo-1760776858841-62bf673b253e?q=80&w=1200" 
          alt="Brand Heritage" 
          className="w-full aspect-[21/9] object-cover"
        />
      </div>
    </div>
  );
}
