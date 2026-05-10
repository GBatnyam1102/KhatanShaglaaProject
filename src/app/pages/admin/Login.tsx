import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { signInAdmin } from "../../services/auth";

interface AdminLoginForm {
  email: string;
  password: string;
}

export function AdminLogin() {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<AdminLoginForm>();

  const onSubmit = async (values: AdminLoginForm) => {
    try {
      await signInAdmin(values.email, values.password);
      toast.success("Амжилттай нэвтэрлээ");
      navigate("/admin");
    } catch (error) {
      console.error(error);
      toast.error("Нэвтрэх мэдээлэл буруу байна эсвэл admin эрх тохируулагдаагүй байна.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex items-center justify-center p-4">
      <div className="bg-white max-w-md w-full p-8 rounded-xl shadow-lg border border-neutral-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-serif text-amber-900 mb-2 uppercase">Хатан шаглаа</h1>
          <p className="text-neutral-500 text-sm">Удирдлагын хэсэгт нэвтрэх</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">И-мэйл</label>
            <input 
              type="email"
              {...register("email", { required: true })}
              className="w-full border border-neutral-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent"
              placeholder="admin@example.com"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Нууц үг</label>
            <input 
              type="password"
              {...register("password", { required: true })}
              className="w-full border border-neutral-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-900 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-900 text-white rounded-lg py-3 font-medium hover:bg-amber-800 transition-colors mt-4"
          >
            {isSubmitting ? "Нэвтэрч байна..." : "Нэвтрэх"}
          </button>
        </form>
        
        <div className="mt-6 text-center text-xs text-neutral-400">
          * Энэхүү хэсэг нь зөвхөн админд зориулагдсан
        </div>
      </div>
    </div>
  );
}
