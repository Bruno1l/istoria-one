"use client";

import { useState } from "react";
import Link from "next/link";
import { Bug, Gauge, Search, TrendingDown, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FilterGroup } from "@/components/clients-browser";
import { ClientMark, GlowFrame, ScoreRing, scoreColor } from "@/components/dashboard";
import { clients, type Analysis } from "@/lib/data";
import { cn } from "@/lib/utils";

const statusStyles: Record<Analysis["status"], { label: string; className: string }> = {
  "em-andamento": { label: "Em andamento", className: "bg-sky-50 text-sky-700" },
  atencao: { label: "Atenção", className: "bg-amber-50 text-amber-700" },
  ativo: { label: "Saudável", className: "bg-emerald-50 text-emerald-700" },
};

export function AnalysisBrowser() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"todos" | "ativo" | "inativo">("ativo");
  const [health, setHealth] = useState<"todos" | Analysis["status"]>("todos");

  const filtered = clients.filter(
    (client) =>
      `${client.name} ${client.domain}`.toLowerCase().includes(query.toLowerCase()) &&
      (status === "todos" || client.status === status) &&
      (health === "todos" || client.analysis.status === health),
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-neutral-400" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar cliente ou domínio..."
            className="h-9 bg-white pl-8"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <FilterGroup
            value={health}
            onChange={setHealth}
            options={[
              ["todos", "Todas"],
              ["atencao", "Atenção"],
              ["em-andamento", "Em andamento"],
              ["ativo", "Saudáveis"],
            ]}
          />
          <FilterGroup
            value={status}
            onChange={setStatus}
            options={[
              ["ativo", "Ativos"],
              ["todos", "Todos"],
              ["inativo", "Inativos"],
            ]}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white py-16 text-center text-sm text-neutral-500">
          Nenhuma análise encontrada com esses filtros.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {filtered.map((client) => {
            const { analysis } = client;
            const state = statusStyles[analysis.status];
            const up = analysis.conversionDelta >= 0;
            return (
              <Link key={client.id} href={`/analise/${client.id}`} className="block">
                <GlowFrame>
                  <div className="flex h-full flex-col">
                    <div className="flex items-center gap-3 border-b bg-neutral-50/60 p-4">
                      <ClientMark name={client.name} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-neutral-900">{client.name}</p>
                        <p className="truncate text-xs text-neutral-500">{client.domain}</p>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col gap-4 p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-neutral-500">Nota geral</p>
                          <Badge className={cn("mt-1 border-0", state.className)}>{state.label}</Badge>
                        </div>
                        <ScoreRing score={analysis.score} />
                      </div>
                      <dl className="grid grid-cols-3 gap-2 rounded-xl bg-neutral-50 p-3 text-center">
                        <div>
                          <dt className="flex items-center justify-center gap-1 text-[10px] text-neutral-500">
                            <Gauge className="size-3" /> PageSpeed
                          </dt>
                          <dd className={cn("text-sm font-semibold tabular-nums", scoreColor(analysis.pagespeedMobile, 100).text)}>
                            {analysis.pagespeedMobile}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-[10px] text-neutral-500">Conversão</dt>
                          <dd className="inline-flex items-center gap-0.5 text-sm font-semibold tabular-nums text-neutral-900">
                            {analysis.conversion.toFixed(1).replace(".", ",")}%
                            {up ? (
                              <TrendingUp className="size-3 text-emerald-500" />
                            ) : (
                              <TrendingDown className="size-3 text-rose-500" />
                            )}
                          </dd>
                        </div>
                        <div>
                          <dt className="flex items-center justify-center gap-1 text-[10px] text-neutral-500">
                            <Bug className="size-3" /> Clarity
                          </dt>
                          <dd className="text-sm font-semibold tabular-nums text-neutral-900">{analysis.clarityBugs} bugs</dd>
                        </div>
                      </dl>
                      <p className="mt-auto text-xs text-neutral-500">
                        {analysis.opportunities.length} oportunidades · {client.platform}
                      </p>
                    </div>
                  </div>
                </GlowFrame>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
