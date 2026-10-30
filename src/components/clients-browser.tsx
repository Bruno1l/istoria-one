"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutGrid, List, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ClientMark,
  GlowFrame,
  MemberStack,
  ProgressBar,
  StatusDot,
  TypeBadge,
  deadlineLabel,
  deadlineTone,
  formatDate,
} from "@/components/dashboard";
import { clients, daysLeft, taskStats, type ProjectType } from "@/lib/data";
import { cn } from "@/lib/utils";

type TypeFilter = "todos" | ProjectType;
type StatusFilter = "todos" | "ativo" | "inativo";

export function ClientsBrowser() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<TypeFilter>("todos");
  const [status, setStatus] = useState<StatusFilter>("ativo");
  const [view, setView] = useState<"cards" | "lista">("cards");

  const filtered = clients.filter((client) => {
    const matchesQuery = `${client.name} ${client.domain} ${client.projectId}`
      .toLowerCase()
      .includes(query.toLowerCase());
    return (
      matchesQuery &&
      (type === "todos" || client.type === type) &&
      (status === "todos" || client.status === status)
    );
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-neutral-400" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Buscar clientes..."
            className="h-9 bg-white pl-8"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <FilterGroup
            value={type}
            onChange={setType}
            options={[
              ["todos", "Todos os tipos"],
              ["recorrente", "Recorrentes"],
              ["implementacao", "Implementação"],
              ["inadimplente", "Inadimplentes"],
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
          <FilterGroup
            value={view}
            onChange={setView}
            options={[
              ["cards", <LayoutGrid key="cards" aria-label="Cards" />],
              ["lista", <List key="lista" aria-label="Lista" />],
            ]}
          />
        </div>
      </div>

      <p className="text-xs text-neutral-500">
        {filtered.length} {filtered.length === 1 ? "cliente" : "clientes"}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white py-16 text-center text-sm text-neutral-500">
          Nenhum cliente encontrado com esses filtros.
        </div>
      ) : view === "cards" ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {filtered.map((client) => (
            <ClientCard key={client.id} clientId={client.id} />
          ))}
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-5">Cliente</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-48">Progresso</TableHead>
                <TableHead>Prazo</TableHead>
                <TableHead className="pr-5">Equipe</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((client) => {
                const stats = taskStats(client);
                const days = daysLeft(client.endDate);
                const tone = deadlineTone(days);
                return (
                  <TableRow key={client.id} className="cursor-pointer">
                    <TableCell className="pl-5">
                      <Link href={`/clientes/${client.id}`} className="flex items-center gap-3">
                        <ClientMark name={client.name} className="size-8" />
                        <div>
                          <p className="font-medium text-neutral-900">{client.name}</p>
                          <p className="text-xs text-neutral-500">{client.projectId}</p>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell>
                      <TypeBadge type={client.type} />
                    </TableCell>
                    <TableCell>
                      <StatusDot active={client.status === "ativo"} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <ProgressBar value={stats.progress} className={tone.bar} />
                        <span className="w-9 text-right text-xs tabular-nums text-neutral-600">{stats.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn("border-0", tone.badge)}>{deadlineLabel(days)}</Badge>
                    </TableCell>
                    <TableCell className="pr-5">
                      <MemberStack team={client.team} max={3} />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function ClientCard({ clientId }: { clientId: string }) {
  const client = clients.find((c) => c.id === clientId)!;
  const stats = taskStats(client);
  const days = daysLeft(client.endDate);
  const tone = deadlineTone(days);

  return (
    <Link href={`/clientes/${client.id}`} className="block">
      <GlowFrame>
        <div className="flex h-full flex-col">
          <div className="flex items-start gap-3 border-b bg-neutral-50/60 p-4">
            <ClientMark name={client.name} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-neutral-900">{client.name}</p>
              <p className="truncate text-xs text-neutral-500">
                {client.platform} · {client.projectId}
              </p>
            </div>
          </div>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex items-center justify-between">
              <TypeBadge type={client.type} />
              <StatusDot active={client.status === "ativo"} />
            </div>
            <p className="text-xs text-neutral-500">
              {formatDate(client.startDate, { day: "2-digit", month: "short" })} → {formatDate(client.endDate)}
            </p>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-600">Progresso</span>
                <span className="font-semibold tabular-nums text-neutral-900">{stats.progress}%</span>
              </div>
              <ProgressBar value={stats.progress} className={tone.bar} />
            </div>
            <div className="mt-auto flex items-center justify-between gap-2">
              <MemberStack team={client.team} max={2} />
              <Badge className={cn("border-0", tone.badge)}>{deadlineLabel(days)}</Badge>
            </div>
          </div>
        </div>
      </GlowFrame>
    </Link>
  );
}

export function FilterGroup<T extends string>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
  options: [T, React.ReactNode][];
}) {
  return (
    <ToggleGroup
      variant="outline"
      size="sm"
      spacing={0}
      value={[value]}
      onValueChange={(next) => next[0] && onChange(next[0] as T)}
      className="bg-white"
    >
      {options.map(([optionValue, label]) => (
        <ToggleGroupItem key={optionValue} value={optionValue} className="px-2.5 text-xs">
          {label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
