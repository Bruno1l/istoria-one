import { AlertTriangle, Ban, Repeat, Rocket, Users } from "lucide-react";
import { AnalysisBrowser } from "@/components/analysis-browser";
import { PageHeader, StatCard } from "@/components/dashboard";
import { overviewStats, urgentDemands } from "@/lib/data";

export default function AnalysisPage() {
  const stats = overviewStats();

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Análise"
        description="Performance e saúde das lojas: PageSpeed, conversão e Clarity de cada cliente."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          label="Clientes"
          value={stats.total}
          icon={<Users />}
          hint={`${stats.active} ativos · ${stats.inactive} inativos`}
        />
        <StatCard label="Recorrentes" value={stats.recorrente} icon={<Repeat />} tone="sky" />
        <StatCard label="Implementação" value={stats.implementacao} icon={<Rocket />} tone="emerald" />
        <StatCard label="Inadimplentes" value={stats.inadimplente} icon={<Ban />} tone="rose" />
        <StatCard label="Demandas urgentes" value={urgentDemands.length} icon={<AlertTriangle />} tone="rose" />
      </div>

      <AnalysisBrowser />
    </div>
  );
}
