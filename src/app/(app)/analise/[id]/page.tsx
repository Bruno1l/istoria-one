import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Download,
  Gauge,
  Monitor,
  MousePointerClick,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Store,
  TrendingUp,
} from "lucide-react";
import { ClientTabs, Panel } from "@/components/client-tabs";
import { ClientMark, ScoreRing, formatDate, scoreColor } from "@/components/dashboard";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { TODAY, clients, getClient, type Client } from "@/lib/data";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return clients.map((client) => ({ id: client.id }));
}

export default async function PageSpeedOverviewPage({ params }: PageProps<"/analise/[id]">) {
  const { id } = await params;
  const client = getClient(id);
  if (!client) notFound();

  const { analysis } = client;

  return (
    <div className="flex flex-col gap-6">
      <Link href="/analise" className="inline-flex w-fit items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-900">
        <ArrowLeft className="size-4" /> Análise
      </Link>

      {/* Cabeçalho do diagnóstico + nota geral */}
      <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
        <section className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5 md:flex-row md:p-6">
          <ClientMark name={client.name} className="size-14 text-base" />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-neutral-500">Diagnóstico Istoria</span>
              <Badge className="border-0 bg-emerald-50 text-emerald-700">Gratuito</Badge>
            </div>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-neutral-900">{client.domain}</h1>
            <p className="mt-1 max-w-xl text-sm text-neutral-500">
              Análise do e-commerce com base em critérios de CRO, UX, design, branding, performance e tecnologia.
            </p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-neutral-600">
              <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-1">
                <Store className="size-3" /> E-commerce {client.platform}
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-1">
                <ShoppingBag className="size-3" /> {client.segment}
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-neutral-100 px-2 py-1">
                <CalendarDays className="size-3" /> Análise de {formatDate(TODAY)}
              </span>
            </div>
          </div>
          <div className="flex gap-2 md:flex-col">
            <span className={buttonVariants({ variant: "outline", size: "sm" })}>
              <Download data-icon="inline-start" /> Baixar PDF
            </span>
          </div>
        </section>

        <section className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white p-5 text-center">
          <span className="text-xs font-medium text-neutral-500">Nota geral</span>
          <ScoreRing score={analysis.score} size={112} stroke={9} label="de 10" />
          <p className="text-xs text-neutral-500">
            {analysis.opportunities.length} oportunidades encontradas
          </p>
        </section>
      </div>

      {/* Notas por área */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {analysis.areas.map((area) => (
          <div key={area.label} className="flex flex-col items-center gap-2 rounded-2xl border border-neutral-200 bg-white p-4 text-center">
            <span className="text-xs text-neutral-600">{area.label}</span>
            <ScoreRing score={area.score} size={60} />
          </div>
        ))}
      </div>

      <ClientTabs
        client={client}
        leading={[
          { value: "diagnostico", label: "Visão geral", content: <Diagnosis client={client} /> },
          { value: "pagespeed", label: "PageSpeed", content: <PageSpeed client={client} /> },
          { value: "clarity", label: "Clarity", content: <Clarity client={client} /> },
        ]}
        summary={
          <Panel title="Sobre o cliente">
            <p className="px-5 py-4 text-sm leading-relaxed text-neutral-700">{client.summary}</p>
          </Panel>
        }
      />
    </div>
  );
}

const impactStyles = {
  alto: { label: "Alto impacto", className: "bg-rose-50 text-rose-700" },
  medio: { label: "Médio impacto", className: "bg-amber-50 text-amber-700" },
  baixo: { label: "Baixo impacto", className: "bg-emerald-50 text-emerald-700" },
};

function Diagnosis({ client }: { client: Client }) {
  const { analysis } = client;
  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <Panel title="Principais oportunidades" action={<span className="text-xs text-neutral-500">Ordenadas por impacto</span>}>
        <ul className="divide-y">
          {analysis.opportunities.map((item) => {
            const impact = impactStyles[item.impact];
            return (
              <li key={item.title} className="flex items-center gap-4 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-neutral-900">{item.title}</p>
                  <p className="mt-0.5 text-xs text-neutral-500">{item.description}</p>
                </div>
                <Badge className={cn("hidden border-0 sm:inline-flex", impact.className)}>{impact.label}</Badge>
                <ScoreRing score={item.score} size={44} stroke={4} />
              </li>
            );
          })}
        </ul>
      </Panel>

      <div className="flex flex-col gap-4">
        <Panel title="Plano de ação recomendado">
          <ol className="divide-y">
            {analysis.actionPlan.map((step, index) => (
              <li key={step.title} className="flex items-center gap-3 px-5 py-3">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full border text-xs text-neutral-600">
                  {index + 1}
                </span>
                <span className="min-w-0 flex-1 text-sm text-neutral-800">{step.title}</span>
                <Badge className="border-0 bg-emerald-50 text-emerald-700">{step.gain}</Badge>
                <ChevronRight className="size-4 text-neutral-300" />
              </li>
            ))}
          </ol>
        </Panel>

        <Panel title="Potencial de resultado">
          <div className="grid grid-cols-3 gap-3 p-4">
            {[
              { value: "+30%", label: "Conversão de vendas", tone: "text-emerald-600" },
              { value: "+25%", label: "Receita mensal", tone: "text-emerald-600" },
              { value: "−40%", label: "Taxa de rejeição", tone: "text-rose-600" },
            ].map((result) => (
              <div key={result.label} className="rounded-xl bg-neutral-50 p-3">
                <p className={cn("text-xl font-semibold tabular-nums", result.tone)}>{result.value}</p>
                <p className="text-[11px] text-neutral-500">{result.label}</p>
              </div>
            ))}
          </div>
        </Panel>
      </div>

      <div className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-violet-200 bg-violet-50 p-5 sm:flex-row sm:items-center lg:col-span-2">
        <div className="flex items-center gap-3">
          <Sparkles className="size-5 text-violet-600" />
          <div>
            <p className="text-sm font-semibold text-neutral-900">Quer entender o resultado em detalhes?</p>
            <p className="text-xs text-neutral-600">Agende uma call com o especialista para definir o plano de ação ideal.</p>
          </div>
        </div>
        <span className={buttonVariants({ size: "sm" })}>
          Agendar call <ArrowRight data-icon="inline-end" />
        </span>
      </div>
    </div>
  );
}

function PageSpeed({ client }: { client: Client }) {
  const { analysis } = client;
  const vitals = [
    { label: "LCP", value: analysis.lcp, hint: "Maior elemento visível" },
    { label: "INP", value: analysis.inp, hint: "Resposta à interação" },
    { label: "CLS", value: analysis.cls, hint: "Estabilidade do layout" },
  ];
  return (
    <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
      <Panel title="Google PageSpeed Insights">
        <div className="grid grid-cols-2 gap-4 p-5">
          <div className="flex flex-col items-center gap-2">
            <ScoreRing score={analysis.pagespeedMobile} max={100} size={88} stroke={8} />
            <span className="inline-flex items-center gap-1 text-xs text-neutral-600">
              <Smartphone className="size-3.5" /> Mobile
            </span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ScoreRing score={analysis.pagespeedDesktop} max={100} size={88} stroke={8} />
            <span className="inline-flex items-center gap-1 text-xs text-neutral-600">
              <Monitor className="size-3.5" /> Desktop
            </span>
          </div>
        </div>
      </Panel>
      <Panel title="Core Web Vitals" action={<Gauge className="size-4 text-neutral-400" />}>
        <div className="grid gap-3 p-4 sm:grid-cols-3">
          {vitals.map((vital) => (
            <div key={vital.label} className="rounded-xl bg-neutral-50 p-4">
              <p className="text-xs font-medium text-neutral-500">{vital.label}</p>
              <p className={cn("mt-1 text-2xl font-semibold tabular-nums", scoreColor(analysis.pagespeedMobile, 100).text)}>
                {vital.value}
              </p>
              <p className="text-[11px] text-neutral-500">{vital.hint}</p>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function Clarity({ client }: { client: Client }) {
  const { analysis } = client;
  const metrics = [
    { label: "Sessões (30d)", value: analysis.sessions, icon: TrendingUp },
    { label: "Rage clicks", value: analysis.clarity.rageClicks, icon: MousePointerClick },
    { label: "Dead clicks", value: analysis.clarity.deadClicks, icon: MousePointerClick },
    { label: "Profundidade de rolagem", value: analysis.clarity.scrollDepth, icon: ArrowRight },
  ];
  return (
    <Panel title="Microsoft Clarity" action={<span className="text-xs text-neutral-500">{analysis.clarityBugs} bugs detectados</span>}>
      <div className="grid grid-cols-2 gap-3 p-4 md:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl bg-neutral-50 p-4">
            <Icon className="size-4 text-neutral-400" />
            <p className="mt-2 text-2xl font-semibold tabular-nums text-neutral-900">{value}</p>
            <p className="text-[11px] text-neutral-500">{label}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}
