import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Check,
  CircleDot,
  Circle,
  FolderOpen,
  Link2,
  MessageCircle,
  Star,
} from "lucide-react";
import { ClientTabs, Panel } from "@/components/client-tabs";
import {
  ClientMark,
  LevelBadge,
  StatusDot,
  TypeBadge,
  deadlineLabel,
  formatDate,
} from "@/components/dashboard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { buttonVariants } from "@/components/ui/button";
import {
  clients,
  daysLeft,
  getClient,
  levelLabels,
  taskStats,
  type Client,
  type TaskStatus,
} from "@/lib/data";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return clients.map((client) => ({ id: client.id }));
}

export default async function ClientOverviewPage({ params }: PageProps<"/clientes/[id]">) {
  const { id } = await params;
  const client = getClient(id);
  if (!client) notFound();

  const stats = taskStats(client);
  const days = daysLeft(client.endDate);

  return (
    <div className="flex flex-col gap-6">
      <Link href="/clientes" className="inline-flex w-fit items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900">
        <ArrowLeft className="size-4" /> Clientes
      </Link>

      {/* Cabeçalho: identidade, prazo e progresso do projeto */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex gap-4">
            <ClientMark name={client.name} className="size-12 text-sm" />
            <div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                <TypeBadge type={client.type} />
                <StatusDot active={client.status === "ativo"} />
                <span>· {deadlineLabel(days)}</span>
              </div>
              <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-neutral-900">{client.name}</h1>
              <p className="text-sm text-neutral-500">
                {client.domain} · {client.segment}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={client.links.whatsapp} className={buttonVariants({ variant: "outline", size: "sm" })}>
              <MessageCircle data-icon="inline-start" /> Grupo WhatsApp
            </a>
            <a href={client.links.drive} className={buttonVariants({ variant: "outline", size: "sm" })}>
              <FolderOpen data-icon="inline-start" /> Drive
            </a>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500">
              Progresso do projeto · {stats.done} de {stats.total} tarefas
            </span>
            <span className="font-semibold tabular-nums text-neutral-900">{stats.progress}%</span>
          </div>
          <Progress value={stats.progress} className="[&_[data-slot=progress-indicator]]:bg-neutral-900 [&_[data-slot=progress-track]]:h-2" />
          <div className="flex justify-between text-xs text-neutral-500">
            <span>Início {formatDate(client.startDate)}</span>
            <span>Entrega {formatDate(client.endDate)}</span>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="min-w-0">
          <ClientTabs client={client} summary={<Summary client={client} />} />
        </div>

        <aside className="flex flex-col gap-4">
          <Team client={client} />
          <ProjectInfo client={client} />
          <Evaluation client={client} />
        </aside>
      </div>
    </div>
  );
}

function Summary({ client }: { client: Client }) {
  const stats = taskStats(client);
  const days = daysLeft(client.endDate);
  const metrics = [
    { value: stats.total, label: "Tarefas no total" },
    { value: stats.done, label: "Concluídas" },
    { value: stats.pending, label: "Pendentes" },
    { value: Math.max(days, 0), label: days < 0 ? "Prazo vencido" : "Dias até a entrega" },
  ];

  return (
    <div className="flex flex-col gap-4">
      <Panel title="Sobre o projeto">
        <p className="px-5 py-4 text-sm leading-relaxed text-neutral-700">{client.summary}</p>
      </Panel>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="rounded-2xl border border-neutral-200 bg-white p-4">
            <p className="text-2xl font-semibold tabular-nums text-neutral-900">{metric.value}</p>
            <p className="text-xs text-neutral-500">{metric.label}</p>
          </div>
        ))}
      </div>

      {client.phases.map((phase) => {
        const done = phase.tasks.filter((task) => task.status === "feito").length;
        return (
          <Panel
            key={phase.id}
            title={phase.title}
            action={
              <span className="text-xs tabular-nums text-neutral-500">
                {done}/{phase.tasks.length}
              </span>
            }
          >
            <ul className="divide-y">
              {phase.tasks.map((task) => (
                <li key={task.id} className="flex items-center gap-3 px-5 py-2.5">
                  <TaskIcon status={task.status} />
                  <span
                    className={cn(
                      "min-w-0 flex-1 truncate text-sm text-neutral-800",
                      task.status === "feito" && "text-neutral-400 line-through",
                    )}
                  >
                    {task.title}
                  </span>
                  <TaskBadge status={task.status} />
                  <span className="hidden w-16 text-right text-xs text-neutral-500 sm:block">
                    {formatDate(task.due, { day: "2-digit", month: "short" })}
                  </span>
                  <Avatar size="sm">
                    <AvatarFallback className="bg-neutral-200 text-[10px] text-neutral-700">
                      {task.assignee.initials}
                    </AvatarFallback>
                  </Avatar>
                </li>
              ))}
            </ul>
          </Panel>
        );
      })}
    </div>
  );
}

function TaskIcon({ status }: { status: TaskStatus }) {
  if (status === "feito")
    return (
      <span className="flex size-4 items-center justify-center rounded-full bg-emerald-500">
        <Check className="size-3 text-white" />
      </span>
    );
  if (status === "andamento") return <CircleDot className="size-4 text-sky-500" />;
  return <Circle className="size-4 text-neutral-300" />;
}

function TaskBadge({ status }: { status: TaskStatus }) {
  const styles = {
    feito: "bg-emerald-50 text-emerald-700",
    andamento: "bg-sky-50 text-sky-700",
    "a-fazer": "bg-neutral-100 text-neutral-600",
  };
  const labels = { feito: "Feito", andamento: "Em andamento", "a-fazer": "A fazer" };
  return <Badge className={cn("hidden border-0 sm:inline-flex", styles[status])}>{labels[status]}</Badge>;
}

function Team({ client }: { client: Client }) {
  const tasks = client.phases.flatMap((phase) => phase.tasks);
  return (
    <Panel title="Equipe" action={<span className="text-xs text-neutral-500">{client.team.length} membros</span>}>
      <ul className="divide-y">
        {client.team.map((member) => {
          const assigned = tasks.filter((task) => task.assignee.id === member.id);
          const done = assigned.filter((task) => task.status === "feito").length;
          return (
            <li key={member.id} className="flex items-center gap-3 px-5 py-3">
              <Avatar>
                <AvatarFallback className="bg-neutral-200 text-xs text-neutral-700">{member.initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-neutral-900">{member.name}</p>
                <p className="truncate text-xs text-neutral-500">{member.role}</p>
              </div>
              <span className="text-xs tabular-nums text-neutral-500">
                {done}/{assigned.length}
              </span>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

function ProjectInfo({ client }: { client: Client }) {
  const rows = [
    { label: "ID do projeto", value: <Badge variant="outline" className="font-mono">{client.projectId}</Badge> },
    { label: "Plataforma", value: client.platform },
    { label: "Início", value: formatDate(client.startDate) },
    { label: "Entrega", value: formatDate(client.endDate) },
  ];
  const links = [
    { label: "Pasta no Drive", href: client.links.drive, icon: FolderOpen },
    { label: "Grupo no WhatsApp", href: client.links.whatsapp, icon: MessageCircle },
    { label: "Freelup", href: client.links.freelup, icon: Link2 },
  ];
  return (
    <Panel title="Info do projeto">
      <dl className="divide-y">
        {rows.map((row) => (
          <div key={row.label} className="flex items-center justify-between px-5 py-2.5 text-sm">
            <dt className="text-neutral-500">{row.label}</dt>
            <dd className="font-medium text-neutral-900">{row.value}</dd>
          </div>
        ))}
      </dl>
      <div className="flex flex-col gap-1 border-t p-3">
        {links.map(({ label, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            className="flex items-center gap-2 rounded-lg px-2 py-2 text-sm text-neutral-700 hover:bg-neutral-50"
          >
            <Icon className="size-4 text-neutral-400" />
            {label}
            <span className="ml-auto font-mono text-[10px] text-neutral-400">{client.projectId}</span>
          </a>
        ))}
      </div>
    </Panel>
  );
}

function Evaluation({ client }: { client: Client }) {
  return (
    <Panel title="Dados avaliativos">
      <dl className="divide-y">
        <div className="flex items-center justify-between px-5 py-2.5 text-sm">
          <dt className="text-neutral-500">NPS do cliente</dt>
          <dd className="inline-flex items-center gap-1 font-semibold text-neutral-900">
            {client.nps === null ? (
              <span className="text-xs font-normal text-neutral-400">Ainda não avaliado</span>
            ) : (
              <>
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                {client.nps}/10
              </>
            )}
          </dd>
        </div>
        <div className="flex items-center justify-between px-5 py-2.5 text-sm">
          <dt className="text-neutral-500">Prioridade</dt>
          <dd>
            <LevelBadge level={client.priority} kind="priority">{levelLabels[client.priority]}</LevelBadge>
          </dd>
        </div>
        <div className="flex items-center justify-between px-5 py-2.5 text-sm">
          <dt className="text-neutral-500">Oportunidade</dt>
          <dd>
            <LevelBadge level={client.opportunity}>{levelLabels[client.opportunity]}</LevelBadge>
          </dd>
        </div>
      </dl>
    </Panel>
  );
}
