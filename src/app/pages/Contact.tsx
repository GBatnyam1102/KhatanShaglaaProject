import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router";
import { toast } from "sonner";
import { Facebook, Send } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { createInquiry } from "../services/catalog";

const FACEBOOK_URL = "https://facebook.com/khatanshaglaa";

interface ContactForm {
  name: string;
  phone: string;
  email: string;
  message: string;
}

interface ContactLocationState {
  productName?: string;
}

export function Contact() {
  const location = useLocation();
  const productName = (location.state as ContactLocationState | null)?.productName;
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm<ContactForm>({
    defaultValues: {
      message: productName ? `Сайн байна уу. "${productName}" бүтээгдэхүүний талаар лавлах байна.` : "",
    },
  });

  useEffect(() => {
    if (productName) {
      setValue("message", `Сайн байна уу. "${productName}" бүтээгдэхүүний талаар лавлах байна.`);
    }
  }, [productName, setValue]);

  const onSubmit = async (data: ContactForm) => {
    try {
      await createInquiry(data);
      toast.success("Таны зурвасыг хүлээж авлаа. Бид удахгүй холбогдох болно.");
      reset();
    } catch (error) {
      console.error(error);
      toast.error("Зурвас илгээхэд алдаа гарлаа. Дахин оролдоно уу.");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        <div>
          <h1 className="text-4xl font-serif text-brand-black mb-6">Холбоо барих</h1>
          <p className="text-brand-black/70 mb-12">
            Танд асуух зүйл байна уу? Эсвэл захиалгаар бүтээл хийлгэхийг хүсвэл бидэнтэй холбогдоорой.
          </p>

          <div className="space-y-6 text-brand-black">
            <div>
              <h3 className="font-bold uppercase tracking-wider text-sm text-brand-brown mb-1">Утас</h3>
              <p>+976 8538-3888</p>
            </div>
            <div>
              <h3 className="font-bold uppercase tracking-wider text-sm text-brand-brown mb-1">И-мэйл</h3>
              <p>info@khatanshaglaa.mn</p>
            </div>
            <div>
              <h3 className="font-bold uppercase tracking-wider text-sm text-brand-brown mb-1">Хаяг</h3>
              <p>Өвөрхангай ,Арвайхээр сум Оргилын Ундраа төвийн 1 давхарт</p>
            </div>
            <div>
              <h3 className="font-bold uppercase tracking-wider text-sm text-brand-brown mb-2">Сошиал</h3>
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-brand-sand rounded-sm text-sm hover:bg-brand-sand/20 transition-colors"
              >
                <Facebook className="w-4 h-4 text-brand-brown" />
                <span>Facebook page</span>
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 md:p-10 shadow-sm border border-brand-sand rounded-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-brand-black mb-2">Нэр *</label>
              <Input 
                {...register("name", { required: "Нэрээ оруулна уу" })}
                placeholder="Таны нэр"
                error={errors.name?.message}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-brand-black mb-2">Утас *</label>
                <Input 
                  {...register("phone", { required: "Утасны дугаараа оруулна уу" })}
                  placeholder="Утасны дугаар"
                  error={errors.phone?.message}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-black mb-2">И-мэйл</label>
                <Input 
                  {...register("email")}
                  placeholder="И-мэйл хаяг"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-black mb-2">Зурвас *</label>
              <textarea 
                {...register("message", { required: "Зурвасаа оруулна уу" })}
                className={`w-full border rounded-sm py-2 px-3 focus:outline-none focus:ring-2 transition-colors bg-white min-h-[100px] resize-y ${errors.message ? "border-brand-red focus:ring-brand-red" : "border-neutral-300 focus:ring-brand-gold focus:border-brand-gold"}`}
                placeholder="Бидэнд илгээх зурвасаа энд бичнэ үү..."
              />
              {errors.message && <span className="text-brand-red text-xs mt-1 block">{errors.message.message}</span>}
            </div>

            <Button 
              type="submit"
              isLoading={isSubmitting}
              className="w-full h-12"
            >
              Илгээх <Send className="ml-2 w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
