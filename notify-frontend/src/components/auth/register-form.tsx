import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateUser } from "@/http/routes/user/create-user";

const registerSchema = z
  .object({
    email: z.email("E-mail inválido"),
    full_name: z.string(),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z
      .string()
      .min(6, "A senha deve ter no mínimo 6 caracteres"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const { mutate } = useCreateUser();

  const onSubmit = (data: RegisterFormData) => {
    const userData = { name: data.full_name, ...data };
    mutate(userData);
    reset();
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
        <Label>Nome Completo</Label>
        <Input
          placeholder="Seu Nome"
          type="text"
          className="text-zinc-950 border-2 border-zinc-950/50 rounded-sm"
          {...register("full_name")}
        />
        {errors.full_name && (
          <span className="text-sm text-red-500">
            {errors.full_name.message}
          </span>
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

      <div className="flex flex-col gap-2 text-zinc-950">
        <Label>Confirmar Senha</Label>
        <Input
          placeholder="example123"
          type="password"
          className="text-zinc-950 border-2 border-zinc-950/50 rounded-sm"
          {...register("confirmPassword")}
        />
        {errors.confirmPassword && (
          <span className="text-sm text-red-500">
            {errors.confirmPassword.message}
          </span>
        )}
      </div>

      <Button
        className="font-bold cursor-pointer bg-zinc-950 text-white hover:bg-zinc-950/50"
        type="submit"
        variant="default"
      >
        Cadastrar
      </Button>
    </form>
  );
}
