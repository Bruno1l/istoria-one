import Link from "next/link";
import { AlertTriangle, Ban, Repeat, Rocket, Users } from "lucide-react";
import { Reminders } from "@/components/reminders";
import { ClientMark, PageHeader, StatCard } from "@/components/dashboard";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { currentUser, getClient, overviewStats, urgentDemands } from "@/lib/data";

export default function OverviewPage() {
  const stats = overviewStats();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Olá, ${currentUser.name.split(" ")[0]}`}
        description="Visão geral dos clientes, projetos e do que precisa de atenção hoje."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Clientes"
          value={stats.total}
          icon={<Users />}
          hint={
            <span className="flex gap-3">
              <span>
                <span className="font-medium text-emerald-600">{stats.active}</span> ativos
              </span>
              <span>
                <span className="font-medium text-neutral-700">{stats.inactive}</span> inativos
              </span>
            </span>
          }
        />
        <StatCard label="Projetos recorrentes" value={stats.recorrente} icon={<Repeat />} tone="sky" hint="Contratos mensais em andamento" />
        <StatCard label="Em implementação" value={stats.implementacao} icon={<Rocket />} tone="emerald" hint="Lojas sendo construídas" />
        <StatCard label="Inadimplentes" value={stats.inadimplente} icon={<Ban />} tone="rose" hint="Pagamentos em aberto" />
      </div>

      <Reminders />

      <section className="rounded-2xl border border-neutral-200 bg-white">
        <div className="flex items-center justify-between border-b px-5 py-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="size-4 text-rose-600" />
            <h2 className="text-sm font-semibold text-neutral-900">Demandas urgentes</h2>
            <Badge className="border-0 bg-rose-50 text-rose-700">{urgentDemands.length}</Badge>
          </div>
          <span className="text-xs text-neutral-500">Ordenadas por prazo</span>
        </div>
        <ul className="divide-y">
          {urgentDemands.map((demand) => {
            const client = getClient(demand.clientId)!;
            return (
              <li key={demand.id}>
                <Link
                  href={`/clientes/${client.id}`}
                  className="flex flex-wrap items-center gap-3 px-5 py-3 transition-colors hover:bg-neutral-50 sm:flex-nowrap"
                >
                  <ClientMark name={client.name} className="size-8" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-neutral-900">{demand.title}</p>
                    <p className="text-xs text-neutral-500">
                      {client.name} · {client.projectId}
                    </p>
                  </div>
                  <Badge
                    className={
                      demand.severity === "critico"
                        ? "border-0 bg-rose-50 text-rose-700"
                        : "border-0 bg-amber-50 text-amber-700"
                    }
                  >
                    {demand.severity === "critico" ? "Crítico" : "Alto"}
                  </Badge>
                  <span className="w-16 text-right text-xs text-neutral-500">{demand.due}</span>
                  <Avatar size="sm">
                    <AvatarFallback className="bg-neutral-200 text-[10px] text-neutral-700">
                      {demand.assignee.initials}
                    </AvatarFallback>
                  </Avatar>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
