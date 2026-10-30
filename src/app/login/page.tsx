import Link from "next/link";
import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-white px-4">
      <BackgroundRippleEffect rows={20} cols={30} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,white_70%)]" />

      <div className="relative z-10 w-full max-w-sm rounded-2xl border border-neutral-200 bg-white/90 p-8 shadow-xl shadow-neutral-200/60 backdrop-blur">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex size-10 items-center justify-center rounded-lg bg-neutral-900 text-sm font-bold text-white">
            I1
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-neutral-900">
              ISTORIA <span className="text-neutral-400">ONE</span>
            </h1>
            <p className="mt-1 text-sm text-neutral-500">Acompanhe seus projetos em um só lugar.</p>
          </div>
        </div>

        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" placeholder="voce@empresa.com.br" className="h-10" />
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Senha</Label>
              <span className="text-xs text-neutral-500 hover:text-neutral-900">Esqueci a senha</span>
            </div>
            <Input id="password" type="password" placeholder="••••••••" className="h-10" />
          </div>
          {/* Sem autenticação por enquanto: o botão só leva para a Visão geral. */}
          <Link href="/" className={cn(buttonVariants({ size: "lg" }), "mt-2 h-10 w-full")}>
            Entrar
          </Link>
        </form>
      </div>
    </div>
  );
}
