"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CircleCheck, CircleDashed, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Badge } from "@/components/ui/badge";
import { currentUser, getClient, reminders } from "@/lib/data";
import { cn } from "@/lib/utils";

const priorityStyles = {
  low: { dot: "bg-neutral-400", label: "Baixa" },
  medium: { dot: "bg-orange-500", label: "Média" },
  high: { dot: "bg-rose-600", label: "Alta" },
};

export function Reminders() {
  const [scope, setScope] = useState<"meus" | "equipe">("meus");
  const list = reminders.filter((r) => scope === "equipe" || r.owner.id === currentUser.id);
  const shown = list.slice(0, 3);

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3">
        <div>
          <h2 className="text-sm font-semibold text-neutral-900">Lembretes</h2>
          <p className="text-xs text-neutral-500">Afazeres por usuário, ligados a cada projeto.</p>
        </div>
        <div className="flex items-center gap-2">
          <ToggleGroup
            variant="outline"
            size="sm"
            spacing={0}
            value={[scope]}
            onValueChange={(value) => value[0] && setScope(value[0] as "meus" | "equipe")}
          >
            <ToggleGroupItem value="meus">Meus</ToggleGroupItem>
            <ToggleGroupItem value="equipe">Equipe</ToggleGroupItem>
          </ToggleGroup>
          <Button variant="outline" size="sm">
            <Plus data-icon="inline-start" />
            Novo lembrete
          </Button>
        </div>
      </div>

      <div className="grid gap-3 p-4 md:grid-cols-3">
        {shown.map((reminder) => {
          const client = getClient(reminder.clientId)!;
          const priority = priorityStyles[reminder.priority];
          return (
            <div key={reminder.id} className="flex flex-col gap-2 rounded-xl border border-neutral-200 p-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-2 text-sm font-medium text-neutral-900">
                  <span className={cn("size-2 rounded-full", priority.dot)} />
                  {priority.label}
                </span>
                {reminder.done ? (
                  <CircleCheck className="size-4 text-emerald-500" />
                ) : (
                  <CircleDashed className="size-4 text-neutral-400" />
                )}
              </div>
              <span className="text-xs text-neutral-500">
                {reminder.when}
                {scope === "equipe" && ` · ${reminder.owner.name.split(" ")[0]}`}
              </span>
              <p className={cn("text-sm text-neutral-800", reminder.done && "text-neutral-400 line-through")}>
                {reminder.text}
              </p>
              <Badge
                variant="outline"
                className="mt-auto"
                render={<Link href={`/clientes/${client.id}`} />}
              >
                {client.name}
              </Badge>
            </div>
          );
        })}
      </div>

      {list.length > shown.length && (
        <div className="flex justify-end px-5 pb-4">
          <span className="inline-flex items-center gap-1 text-xs text-neutral-500">
            Ver os outros {list.length - shown.length} lembretes <ArrowRight className="size-3" />
          </span>
        </div>
      )}
    </section>
  );
}
