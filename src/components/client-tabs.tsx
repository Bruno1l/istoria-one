import type { ReactNode } from "react";
import { ExternalLink, MessageCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/components/dashboard";
import type { Client } from "@/lib/data";

export type ExtraTab = { value: string; label: string; content: ReactNode };

/**
 * Abas comuns do cliente (Resumo, Briefing, ICP, Referências, Notas, Time do cliente).
 * Cada overview injeta o conteúdo do "Resumo" e pode acrescentar abas antes dele.
 */
export function ClientTabs({
  client,
  summary,
  leading = [],
}: {
  client: Client;
  summary: ReactNode;
  leading?: ExtraTab[];
}) {
  const tabs: ExtraTab[] = [
    ...leading,
    { value: "resumo", label: "Resumo", content: summary },
    { value: "briefing", label: "Briefing", content: <InfoList items={client.briefing} /> },
    { value: "icp", label: "ICP", content: <InfoList items={client.icp} /> },
    { value: "referencias", label: "Referências concorrente", content: <Competitors client={client} /> },
    { value: "notas", label: "Notas do time", content: <Notes client={client} /> },
    { value: "time-cliente", label: "Time do cliente", content: <ClientContacts client={client} /> },
  ];

  return (
    <Tabs defaultValue={tabs[0].value} className="gap-4">
      <div className="-mx-1 overflow-x-auto px-1 pb-1">
        <TabsList className="bg-neutral-100">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="px-3">
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}

export function Panel({
  title,
  action,
  children,
  className,
}: {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-neutral-200 bg-white ${className ?? ""}`}>
      {title && (
        <div className="flex items-center justify-between gap-2 border-b px-5 py-3">
          <h2 className="text-sm font-semibold text-neutral-900">{title}</h2>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

function InfoList({ items }: { items: { label: string; value: string }[] }) {
  return (
    <Panel>
      <dl className="divide-y">
        {items.map((item) => (
          <div key={item.label} className="grid gap-1 px-5 py-3 sm:grid-cols-[180px_1fr]">
            <dt className="text-sm text-neutral-500">{item.label}</dt>
            <dd className="text-sm text-neutral-900">{item.value}</dd>
          </div>
        ))}
      </dl>
    </Panel>
  );
}

function Competitors({ client }: { client: Client }) {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {client.competitors.map((competitor) => (
        <div key={competitor.name} className="rounded-2xl border border-neutral-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-neutral-900">{competitor.name}</p>
            <ExternalLink className="size-3.5 text-neutral-400" />
          </div>
          <p className="text-xs text-neutral-500">{competitor.domain}</p>
          <p className="mt-3 text-sm text-neutral-700">{competitor.note}</p>
        </div>
      ))}
    </div>
  );
}

function Notes({ client }: { client: Client }) {
  return (
    <Panel>
      <ul className="divide-y">
        {client.notes.map((note) => (
          <li key={note.date} className="flex gap-3 px-5 py-4">
            <Avatar size="sm">
              <AvatarFallback className="bg-neutral-200 text-[10px] text-neutral-700">{note.author.initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs text-neutral-500">
                <span className="font-medium text-neutral-900">{note.author.name}</span> · {formatDate(note.date)}
              </p>
              <p className="mt-1 text-sm text-neutral-800">{note.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function ClientContacts({ client }: { client: Client }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {client.contacts.map((contact) => (
        <div key={contact.name} className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4">
          <Avatar size="lg">
            <AvatarFallback className="bg-neutral-900 text-xs text-white">{contact.initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-neutral-900">{contact.name}</p>
            <p className="text-xs text-neutral-500">{contact.role}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
            <MessageCircle className="size-3.5" />
            {contact.whatsapp}
          </span>
        </div>
      ))}
    </div>
  );
}
