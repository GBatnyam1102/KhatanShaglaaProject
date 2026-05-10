export function CraftStory() {
  return (
    <div>
      <section className="relative h-[60vh] flex items-center justify-center bg-amber-900">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1771409046945-917ec1c2e25a?q=80&w=1920" 
            alt="Craft Story" 
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="relative z-10 text-center px-4 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-serif text-white mb-6">Урлалын түүх</h1>
          <p className="text-xl text-amber-100 font-light">
            Зүү ороох оёдлын гайхамшигт өв
          </p>
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto prose prose-lg prose-neutral">
        <p className="lead text-2xl font-serif text-neutral-900 text-center mb-12">
          Монголчуудын уламжлалт зүү ороох оёдол нь дэлхийн хаана ч байдаггүй, зөвхөн нүүдэлчин монголчуудын дунд үүсэж хөгжсөн өвөрмөц гар урлалын төрөл юм.
        </p>

        <p>
          Энэхүү оёдол нь маш их тэвчээр, нарийн мэдрэмж, ур дүй шаарддаг. Нэг ширхэг даалинг урлахад хээний нарийн, оёдлын нягтаас шалтгаалан сараас жил хүртэлх хугацаа зарцуулагддаг.
        </p>

        <div className="my-16 grid grid-cols-1 md:grid-cols-2 gap-8 not-prose">
          <img src="https://images.unsplash.com/photo-1769192931923-14c28a0a9fa5?q=80&w=800" alt="Detail 1" className="w-full aspect-square object-cover" />
          <img src="https://images.unsplash.com/photo-1625479141767-715ceef6b310?q=80&w=800" alt="Detail 2" className="w-full aspect-square object-cover" />
        </div>

        <h3>Үнэ цэнэ</h3>
        <p>
          Зүү ороож оёсон бүтээл нь хэзээ ч хуучирч мууддаггүй бөгөөд он цаг өнгөрөх тусам үнэ цэнэ нь өсөн нэмэгдэж байдаг. Тийм ч учраас монголчууд даалин, хавтага зэрэг зүү ороомлын бүтээлийг үе дамжуулан нандигнан хадгалсаар ирсэн уламжлалтай.
        </p>
      </section>
    </div>
  );
}
