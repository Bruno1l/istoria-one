import type { ReactNode } from "react";
import { NumberTicker } from "@/components/ui/number-ticker";
import { GlowingEffect } from "@/components/ui/glowing-effect";
import { Badge } from "@/components/ui/badge";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { typeLabels, type Level, type Member, type ProjectType } from "@/lib/data";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-neutral-500">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

/** Moldura com o brilho de borda da Aceternity, usada em cards clicáveis e KPIs. */
export function GlowFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative h-full rounded-2xl border border-neutral-200 p-1", className)}>
      <GlowingEffect spread={36} glow disabled={false} proximity={56} inactiveZone={0.01} borderWidth={2} />
      <div className="relative h-full rounded-xl bg-white">{children}</div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  icon,
  hint,
  tone = "neutral",
}: {
  label: string;
  value: number;
  icon: ReactNode;
  hint?: ReactNode;
  tone?: "neutral" | "emerald" | "sky" | "rose";
}) {
  const tones = {
    neutral: "bg-neutral-100 text-neutral-700",
    emerald: "bg-emerald-50 text-emerald-600",
    sky: "bg-sky-50 text-sky-600",
    rose: "bg-rose-50 text-rose-600",
  };
  return (
    <GlowFrame>
      <div className="flex h-full flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-neutral-500">{label}</span>
          <span className={cn("flex size-8 items-center justify-center rounded-lg [&_svg]:size-4", tones[tone])}>
            {icon}
          </span>
        </div>
        <div>
          <NumberTicker value={value} className="text-3xl font-semibold tracking-tight text-neutral-900" />
          {hint && <div className="mt-1 text-xs text-neutral-500">{hint}</div>}
        </div>
      </div>
    </GlowFrame>
  );
}

const typeStyles: Record<ProjectType, string> = {
  recorrente: "bg-sky-50 text-sky-700 ring-sky-200",
  implementacao: "bg-violet-50 text-violet-700 ring-violet-200",
  inadimplente: "bg-rose-50 text-rose-700 ring-rose-200",
};

export function TypeBadge({ type }: { type: ProjectType }) {
  return (
    <Badge variant="outline" className={cn("border-0 ring-1 ring-inset", typeStyles[type])}>
      {typeLabels[type]}
    </Badge>
  );
}

export function StatusDot({ active }: { active: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-neutral-600">
      <span className={cn("size-1.5 rounded-full", active ? "bg-emerald-500" : "bg-neutral-300")} />
      {active ? "Ativo" : "Inativo"}
    </span>
  );
}

const levelStyles: Record<Level, string> = {
  baixa: "bg-neutral-100 text-neutral-600",
  media: "bg-amber-50 text-amber-700",
  alta: "bg-emerald-50 text-emerald-700",
};

// Para prioridade, "alta" é alerta (vermelho); para oportunidade, "alta" é positivo (verde).
const priorityStyles: Record<Level, string> = {
  baixa: "bg-neutral-100 text-neutral-600",
  media: "bg-amber-50 text-amber-700",
  alta: "bg-rose-50 text-rose-700",
};

export function LevelBadge({
  level,
  kind = "opportunity",
  children,
}: {
  level: Level;
  kind?: "priority" | "opportunity";
  children: ReactNode;
}) {
  const styles = kind === "priority" ? priorityStyles : levelStyles;
  return <Badge className={cn("border-0", styles[level])}>{children}</Badge>;
}

/** Cor da barra de progresso e do selo de prazo, conforme os dias restantes. */
export function deadlineTone(days: number) {
  if (days < 0) return { bar: "bg-rose-500", badge: "bg-rose-500 text-white", label: "Atrasado" };
  if (days <= 14) return { bar: "bg-orange-500", badge: "bg-orange-500 text-white", label: null };
  if (days <= 35) return { bar: "bg-sky-500", badge: "bg-sky-500 text-white", label: null };
  return { bar: "bg-emerald-500", badge: "bg-emerald-500 text-white", label: null };
}

export function deadlineLabel(days: number) {
  if (days < 0) return `${Math.abs(days)} dias atrasado`;
  if (days < 7) return `${days} dias restantes`;
  const weeks = Math.round(days / 7);
  return `${weeks} ${weeks === 1 ? "semana" : "semanas"} restantes`;
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
      <div className={cn("h-full rounded-full", className)} style={{ width: `${value}%` }} />
    </div>
  );
}

export function ClientMark({ name, className }: { name: string; className?: string }) {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("");
  return (
    <div
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-lg bg-neutral-900 text-xs font-semibold text-white",
        className,
      )}
    >
      {initials}
    </div>
  );
}

export function MemberStack({ team, max = 4 }: { team: Member[]; max?: number }) {
  const shown = team.slice(0, max);
  return (
    <AvatarGroup>
      {shown.map((member) => (
        <Tooltip key={member.id}>
          <TooltipTrigger render={<Avatar />}>
            <AvatarFallback className="bg-neutral-200 text-[11px] font-medium text-neutral-700">
              {member.initials}
            </AvatarFallback>
          </TooltipTrigger>
          <TooltipContent>
            {member.name} · {member.role}
          </TooltipContent>
        </Tooltip>
      ))}
      {team.length > max && <AvatarGroupCount>+{team.length - max}</AvatarGroupCount>}
    </AvatarGroup>
  );
}

export function scoreColor(score: number, max = 10) {
  const ratio = score / max;
  if (ratio >= 0.75) return { text: "text-emerald-600", stroke: "stroke-emerald-500", bg: "bg-emerald-50" };
  if (ratio >= 0.55) return { text: "text-amber-600", stroke: "stroke-amber-500", bg: "bg-amber-50" };
  return { text: "text-rose-600", stroke: "stroke-rose-500", bg: "bg-rose-50" };
}

export function ScoreRing({
  score,
  max = 10,
  size = 56,
  stroke = 5,
  label,
}: {
  score: number;
  max?: number;
  size?: number;
  stroke?: number;
  label?: string;
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const color = scoreColor(score, max);
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} strokeWidth={stroke} className="fill-none stroke-neutral-100" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - score / max)}
          className={cn("fill-none", color.stroke)}
        />
      </svg>
      <div className="absolute flex flex-col items-center leading-none">
        <span className={cn("font-semibold tabular-nums", color.text, size >= 96 ? "text-3xl" : "text-sm")}>
          {max === 10 ? score.toFixed(1).replace(".", ",") : score}
        </span>
        {label && <span className="mt-1 text-[10px] text-neutral-500">{label}</span>}
      </div>
    </div>
  );
}

export function formatDate(date: string, options: Intl.DateTimeFormatOptions = { day: "2-digit", month: "short", year: "numeric" }) {
  return new Date(`${date}T12:00:00`).toLocaleDateString("pt-BR", options);
}
