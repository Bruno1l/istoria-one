import { Plus } from "lucide-react";
import { ClientsBrowser } from "@/components/clients-browser";
import { PageHeader } from "@/components/dashboard";
import { Button } from "@/components/ui/button";

export default function ClientsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Clientes"
        description="Todos os projetos da agência. Clique em um card para abrir o overview."
        actions={
          <Button size="sm">
            <Plus data-icon="inline-start" />
            Novo cliente
          </Button>
        }
      />
      <ClientsBrowser />
    </div>
  );
}
