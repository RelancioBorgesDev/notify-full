import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthenticateUser } from "@/http/routes/user/authenticate-user";

const loginSchema = z.object({
  email: z.email("E-mail inválido"),
  password: z.string().min(1, "O campo senha é obrigatório"),
});
type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });
  const { mutate } = useAuthenticateUser();

  const onSubmit = (data: LoginFormData) => {
    mutate(data);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-[75%] flex flex-col gap-4 max-lg:w-full"
    >
      <div className="flex flex-col gap-2 text-zinc-950">
        <Label>Email</Label>
        <Input
          placeholder="email@example.com"
          type="email"
          autoComplete={"email"}
          className="text-zinc-950 border-2 border-zinc-950/50 rounded-sm"
          {...register("email")}
        />
        {errors.email && (
          <span className="text-sm text-red-500">{errors.email.message}</span>
        )}
      </div>

      <div className="flex flex-col gap-2 text-zinc-950">
        <Label>Senha</Label>
        <Input
          placeholder="example123"
          type="password"
          className="text-zinc-950 border-2 border-zinc-950/50 rounded-sm"
          {...register("password")}
        />
        {errors.password && (
          <span className="text-sm text-red-500">
            {errors.password.message}
          </span>
        )}
      </div>

      <Button
        className="font-bold cursor-pointer bg-zinc-950 text-white hover:bg-zinc-950/50"
        type="submit"
      >
        Entrar
      </Button>
    </form>
  );
}
