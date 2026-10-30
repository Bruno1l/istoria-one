// Dados de exemplo — ainda sem backend. Toda a interface lê daqui.

export type ProjectType = "recorrente" | "implementacao" | "inadimplente";
export type ClientStatus = "ativo" | "inativo";
export type Level = "baixa" | "media" | "alta";
export type TaskStatus = "feito" | "andamento" | "a-fazer";

export type Member = {
  id: string;
  name: string;
  role: string;
  initials: string;
};

export type ClientContact = {
  name: string;
  role: string;
  whatsapp: string;
  initials: string;
};

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  assignee: Member;
  due: string;
};

export type Phase = {
  id: string;
  title: string;
  tasks: Task[];
};

export type Analysis = {
  score: number;
  pagespeedMobile: number;
  pagespeedDesktop: number;
  conversion: number;
  conversionDelta: number;
  sessions: string;
  clarityBugs: number;
  lcp: string;
  inp: string;
  cls: string;
  areas: { label: string; score: number }[];
  opportunities: {
    title: string;
    description: string;
    impact: "alto" | "medio" | "baixo";
    score: number;
  }[];
  actionPlan: { title: string; gain: string }[];
  clarity: { rageClicks: number; deadClicks: number; scrollDepth: string };
  status: "em-andamento" | "atencao" | "ativo";
};

export type Client = {
  id: string;
  name: string;
  domain: string;
  platform: "Shopify" | "Nuvemshop";
  segment: string;
  type: ProjectType;
  status: ClientStatus;
  projectId: string;
  startDate: string;
  endDate: string;
  nps: number | null;
  priority: Level;
  opportunity: Level;
  links: { drive: string; whatsapp: string; freelup: string };
  summary: string;
  briefing: { label: string; value: string }[];
  icp: { label: string; value: string }[];
  competitors: { name: string; domain: string; note: string }[];
  notes: { author: Member; date: string; text: string }[];
  contacts: ClientContact[];
  team: Member[];
  phases: Phase[];
  analysis: Analysis;
};

export const members: Member[] = [
  { id: "isaac", name: "Isaac Scheffer", role: "Head de projetos", initials: "IS" },
  { id: "bruno", name: "Bruno Lima", role: "Desenvolvedor Shopify", initials: "BL" },
  { id: "marina", name: "Marina Costa", role: "Designer", initials: "MC" },
  { id: "rafael", name: "Rafael Duarte", role: "Integrações", initials: "RD" },
  { id: "ana", name: "Ana Prado", role: "Conteúdo & SEO", initials: "AP" },
];

const m = (id: string) => members.find((member) => member.id === id)!;

// Tarefas-base do board, divididas nas 4 fases.
const phaseTemplate: { id: string; title: string; tasks: string[] }[] = [
  {
    id: "fase-01",
    title: "Fase 01 · Início / Setup inicial",
    tasks: [
      "Criar grupo no WhatsApp",
      "Criar o Drive",
      "Pegar/criar acessos",
      "Referências",
      "Preencher briefing (ICP, cores, brandbook, oferta)",
    ],
  },
  {
    id: "fase-02",
    title: "Fase 02 · Integrações",
    tasks: [
      "Integrar checkout",
      "Integrar logística",
      "Integrar pagamento",
      "Integrar ERP",
      "Clarity / PageSpeed / nosso app / apps gerais",
    ],
  },
  {
    id: "fase-03",
    title: "Fase 03 · Implementação",
    tasks: [
      "Políticas",
      "Menus",
      "App de review",
      "Organizar coleções/categorias > menu",
      "Produtos > sincronizar SKU com ERP",
      "SEO básico",
      "Tema",
      "Front · metacampos, banner e copy",
      "Revisão geral",
    ],
  },
  {
    id: "fase-04",
    title: "Fase 04 · Ajustes e final",
    tasks: [
      "Apresentação ao cliente",
      "Ajustes (somente 2 rodadas)",
      "Entrega",
    ],
  },
];

export const TOTAL_TASKS = phaseTemplate.reduce((sum, p) => sum + p.tasks.length, 0);

function buildPhases(doneCount: number, team: Member[], startDate: string): Phase[] {
  let index = 0;
  const start = new Date(startDate);
  return phaseTemplate.map((phase) => ({
    id: phase.id,
    title: phase.title,
    tasks: phase.tasks.map((title) => {
      const position = index++;
      const due = new Date(start);
      due.setDate(start.getDate() + position * 3 + 2);
      return {
        id: `${phase.id}-${position}`,
        title,
        status:
          position < doneCount
            ? "feito"
            : position === doneCount
              ? "andamento"
              : "a-fazer",
        assignee: team[position % team.length],
        due: due.toISOString().slice(0, 10),
      };
    }),
  }));
}

type Seed = Omit<Client, "phases" | "briefing" | "icp" | "competitors" | "notes" | "summary"> & {
  doneCount: number;
  product: string;
};

const seeds: Seed[] = [
  {
    id: "vinci-society",
    name: "Vinci Society",
    domain: "vincisociety.com",
    platform: "Shopify",
    segment: "Moda masculina",
    product: "camisaria premium",
    type: "implementacao",
    status: "ativo",
    projectId: "IST-0142",
    startDate: "2026-09-08",
    endDate: "2026-11-28",
    nps: 9,
    priority: "alta",
    opportunity: "alta",
    links: { drive: "#", whatsapp: "#", freelup: "#" },
    contacts: [
      { name: "Lucas Vinci", role: "Fundador", whatsapp: "(11) 98877-1020", initials: "LV" },
      { name: "Paula Reis", role: "Marketing", whatsapp: "(11) 97766-4410", initials: "PR" },
    ],
    team: [m("isaac"), m("bruno"), m("marina")],
    doneCount: 15,
    analysis: {
      score: 7.4,
      pagespeedMobile: 82,
      pagespeedDesktop: 94,
      conversion: 3.8,
      conversionDelta: 0.6,
      sessions: "48,2 mil",
      clarityBugs: 3,
      lcp: "1,9s",
      inp: "160ms",
      cls: "0,04",
      areas: [
        { label: "CRO e Conversão", score: 7.8 },
        { label: "Design e UX", score: 7.2 },
        { label: "Branding", score: 8.1 },
        { label: "Produto e Conteúdo", score: 6.9 },
        { label: "Performance", score: 7.5 },
        { label: "Tecnologia", score: 7.0 },
      ],
      opportunities: [
        { title: "Página de produto (PDP)", description: "Falta prova social visível e tabela de medidas acima da dobra.", impact: "alto", score: 5.8 },
        { title: "Jornada de compra", description: "Frete só aparece no checkout; antecipar cálculo na PDP.", impact: "medio", score: 6.4 },
        { title: "SEO e conteúdo", description: "Coleções sem texto de apoio e meta descriptions duplicadas.", impact: "baixo", score: 7.1 },
      ],
      actionPlan: [
        { title: "Adicionar reviews e tabela de medidas na PDP", gain: "+20% conversão" },
        { title: "Calculadora de frete na página de produto", gain: "+12% conversão" },
        { title: "Textos de coleção e metas únicas", gain: "+10% tráfego orgânico" },
      ],
      clarity: { rageClicks: 42, deadClicks: 118, scrollDepth: "54%" },
      status: "em-andamento",
    },
  },
  {
    id: "cicatribem",
    name: "Cicatribem",
    domain: "cicatribem.com.br",
    platform: "Nuvemshop",
    segment: "Saúde e cuidados",
    product: "dermocosméticos",
    type: "recorrente",
    status: "ativo",
    projectId: "IST-0128",
    startDate: "2026-06-02",
    endDate: "2026-12-15",
    nps: 10,
    priority: "media",
    opportunity: "alta",
    links: { drive: "#", whatsapp: "#", freelup: "#" },
    contacts: [
      { name: "Renata Alves", role: "Diretora comercial", whatsapp: "(21) 99812-3300", initials: "RA" },
    ],
    team: [m("ana"), m("marina"), m("rafael")],
    doneCount: 19,
    analysis: {
      score: 6.2,
      pagespeedMobile: 64,
      pagespeedDesktop: 88,
      conversion: 2.1,
      conversionDelta: -0.4,
      sessions: "22,1 mil",
      clarityBugs: 5,
      lcp: "3,4s",
      inp: "240ms",
      cls: "0,12",
      areas: [
        { label: "CRO e Conversão", score: 5.9 },
        { label: "Design e UX", score: 6.5 },
        { label: "Branding", score: 7.2 },
        { label: "Produto e Conteúdo", score: 6.0 },
        { label: "Performance", score: 4.8 },
        { label: "Tecnologia", score: 6.6 },
      ],
      opportunities: [
        { title: "Velocidade do site", description: "Imagens sem compressão elevam o LCP para 3,4s no mobile.", impact: "alto", score: 4.5 },
        { title: "Página de produto (PDP)", description: "Benefícios do produto escondidos em abas pouco visíveis.", impact: "alto", score: 5.2 },
        { title: "Checkout", description: "Campos excessivos no cadastro antes do pagamento.", impact: "medio", score: 6.1 },
      ],
      actionPlan: [
        { title: "Comprimir e servir imagens em WebP", gain: "+15% conversão" },
        { title: "Benefícios em bullets acima do botão de compra", gain: "+10% conversão" },
        { title: "Simplificar cadastro no checkout", gain: "-25% abandono" },
      ],
      clarity: { rageClicks: 87, deadClicks: 204, scrollDepth: "41%" },
      status: "atencao",
    },
  },
  {
    id: "spinnaker",
    name: "Spinnaker",
    domain: "spinnaker.com.br",
    platform: "Shopify",
    segment: "Relógios",
    product: "relógios esportivos",
    type: "implementacao",
    status: "ativo",
    projectId: "IST-0151",
    startDate: "2026-10-01",
    endDate: "2026-12-20",
    nps: null,
    priority: "alta",
    opportunity: "media",
    links: { drive: "#", whatsapp: "#", freelup: "#" },
    contacts: [
      { name: "Fernando Muller", role: "CEO", whatsapp: "(47) 99123-8890", initials: "FM" },
      { name: "Júlia Kato", role: "E-commerce", whatsapp: "(47) 98456-1200", initials: "JK" },
    ],
    team: [m("bruno"), m("rafael"), m("isaac"), m("marina")],
    doneCount: 7,
    analysis: {
      score: 6.6,
      pagespeedMobile: 58,
      pagespeedDesktop: 86,
      conversion: 4.2,
      conversionDelta: 0.5,
      sessions: "61,4 mil",
      clarityBugs: 1,
      lcp: "3,1s",
      inp: "210ms",
      cls: "0,08",
      areas: [
        { label: "CRO e Conversão", score: 7.8 },
        { label: "Design e UX", score: 6.2 },
        { label: "Branding", score: 5.9 },
        { label: "Produto e Conteúdo", score: 8.1 },
        { label: "Performance", score: 4.7 },
        { label: "Tecnologia", score: 7.0 },
      ],
      opportunities: [
        { title: "Velocidade do site", description: "Tempo de carregamento acima do ideal no mobile (3,1s).", impact: "alto", score: 4.5 },
        { title: "Página de produto (PDP)", description: "Falta de prova social, vídeo do produto e informações técnicas organizadas.", impact: "alto", score: 4.2 },
        { title: "Hierarquia visual e identidade", description: "O design tem boa base, mas pode explorar melhor a força da marca.", impact: "medio", score: 6.1 },
        { title: "SEO e conteúdo", description: "Boa base técnica, mas pode melhorar títulos e conteúdo de blog.", impact: "baixo", score: 7.0 },
      ],
      actionPlan: [
        { title: "Otimizar página de produto (PDP)", gain: "+20% conversão" },
        { title: "Implementar prova social e UGC", gain: "+15% conversão" },
        { title: "Melhorar velocidade do site", gain: "+10% conversão" },
        { title: "Fortalecer identidade da marca", gain: "+20% reconhecimento" },
      ],
      clarity: { rageClicks: 23, deadClicks: 96, scrollDepth: "62%" },
      status: "ativo",
    },
  },
  {
    id: "voy-shoes",
    name: "Voy Shoes",
    domain: "voyshoes.com.br",
    platform: "Shopify",
    segment: "Calçados",
    product: "tênis casuais",
    type: "recorrente",
    status: "ativo",
    projectId: "IST-0117",
    startDate: "2026-04-14",
    endDate: "2026-11-14",
    nps: 8,
    priority: "baixa",
    opportunity: "media",
    links: { drive: "#", whatsapp: "#", freelup: "#" },
    contacts: [
      { name: "Diego Rocha", role: "Sócio", whatsapp: "(31) 99700-5522", initials: "DR" },
    ],
    team: [m("marina"), m("ana")],
    doneCount: 21,
    analysis: {
      score: 7.9,
      pagespeedMobile: 76,
      pagespeedDesktop: 93,
      conversion: 3.2,
      conversionDelta: 0.3,
      sessions: "33,5 mil",
      clarityBugs: 2,
      lcp: "2,3s",
      inp: "180ms",
      cls: "0,05",
      areas: [
        { label: "CRO e Conversão", score: 8.0 },
        { label: "Design e UX", score: 8.4 },
        { label: "Branding", score: 8.2 },
        { label: "Produto e Conteúdo", score: 7.6 },
        { label: "Performance", score: 7.1 },
        { label: "Tecnologia", score: 7.9 },
      ],
      opportunities: [
        { title: "Busca interna", description: "Busca não reconhece sinônimos (tênis/sapatênis).", impact: "medio", score: 6.8 },
        { title: "Recompra", description: "Sem fluxo de pós-venda para segunda compra.", impact: "medio", score: 6.5 },
      ],
      actionPlan: [
        { title: "Configurar sinônimos na busca", gain: "+8% conversão" },
        { title: "Fluxo de e-mail de recompra", gain: "+12% receita" },
      ],
      clarity: { rageClicks: 15, deadClicks: 64, scrollDepth: "67%" },
      status: "ativo",
    },
  },
  {
    id: "outra-marca",
    name: "Outra Marca",
    domain: "outramarca.com.br",
    platform: "Nuvemshop",
    segment: "Decoração",
    product: "objetos de decoração",
    type: "inadimplente",
    status: "ativo",
    projectId: "IST-0109",
    startDate: "2026-03-03",
    endDate: "2026-10-20",
    nps: 6,
    priority: "media",
    opportunity: "baixa",
    links: { drive: "#", whatsapp: "#", freelup: "#" },
    contacts: [
      { name: "Camila Torres", role: "Proprietária", whatsapp: "(41) 99234-7788", initials: "CT" },
    ],
    team: [m("rafael"), m("bruno")],
    doneCount: 17,
    analysis: {
      score: 5.4,
      pagespeedMobile: 52,
      pagespeedDesktop: 79,
      conversion: 1.4,
      conversionDelta: -0.2,
      sessions: "9,8 mil",
      clarityBugs: 4,
      lcp: "3,9s",
      inp: "290ms",
      cls: "0,18",
      areas: [
        { label: "CRO e Conversão", score: 5.1 },
        { label: "Design e UX", score: 5.8 },
        { label: "Branding", score: 6.4 },
        { label: "Produto e Conteúdo", score: 5.0 },
        { label: "Performance", score: 4.2 },
        { label: "Tecnologia", score: 5.9 },
      ],
      opportunities: [
        { title: "Estabilidade de layout", description: "Banners sem altura definida causam CLS alto.", impact: "alto", score: 4.0 },
        { title: "Fotos de produto", description: "Fotos sem ambientação e sem escala de tamanho.", impact: "alto", score: 4.6 },
      ],
      actionPlan: [
        { title: "Definir dimensões fixas para banners", gain: "+8% conversão" },
        { title: "Fotos ambientadas nos produtos mais vendidos", gain: "+15% conversão" },
      ],
      clarity: { rageClicks: 64, deadClicks: 150, scrollDepth: "38%" },
      status: "atencao",
    },
  },
  {
    id: "bora-cafe",
    name: "Bora Café",
    domain: "boracafe.com.br",
    platform: "Shopify",
    segment: "Alimentos e bebidas",
    product: "cafés especiais",
    type: "recorrente",
    status: "ativo",
    projectId: "IST-0133",
    startDate: "2026-07-07",
    endDate: "2027-01-07",
    nps: 9,
    priority: "baixa",
    opportunity: "alta",
    links: { drive: "#", whatsapp: "#", freelup: "#" },
    contacts: [
      { name: "Tiago Mendes", role: "Fundador", whatsapp: "(35) 99811-2040", initials: "TM" },
    ],
    team: [m("ana"), m("isaac")],
    doneCount: 12,
    analysis: {
      score: 7.1,
      pagespeedMobile: 71,
      pagespeedDesktop: 90,
      conversion: 2.9,
      conversionDelta: 0.4,
      sessions: "18,7 mil",
      clarityBugs: 2,
      lcp: "2,6s",
      inp: "190ms",
      cls: "0,06",
      areas: [
        { label: "CRO e Conversão", score: 7.0 },
        { label: "Design e UX", score: 7.4 },
        { label: "Branding", score: 8.3 },
        { label: "Produto e Conteúdo", score: 6.8 },
        { label: "Performance", score: 6.6 },
        { label: "Tecnologia", score: 6.9 },
      ],
      opportunities: [
        { title: "Assinatura", description: "Plano de assinatura pouco destacado na home.", impact: "alto", score: 5.5 },
        { title: "Kits e combos", description: "Sem sugestões de compra conjunta no carrinho.", impact: "medio", score: 6.2 },
      ],
      actionPlan: [
        { title: "Destacar assinatura na home e PDP", gain: "+18% receita recorrente" },
        { title: "Cross-sell de kits no carrinho", gain: "+9% ticket médio" },
      ],
      clarity: { rageClicks: 19, deadClicks: 72, scrollDepth: "58%" },
      status: "ativo",
    },
  },
  {
    id: "linea-casa",
    name: "Línea Casa",
    domain: "lineacasa.com.br",
    platform: "Shopify",
    segment: "Cama, mesa e banho",
    product: "enxoval",
    type: "implementacao",
    status: "inativo",
    projectId: "IST-0098",
    startDate: "2026-01-12",
    endDate: "2026-04-30",
    nps: 7,
    priority: "baixa",
    opportunity: "baixa",
    links: { drive: "#", whatsapp: "#", freelup: "#" },
    contacts: [
      { name: "Helena Brito", role: "Gerente de loja", whatsapp: "(19) 99654-3321", initials: "HB" },
    ],
    team: [m("bruno"), m("marina")],
    doneCount: 22,
    analysis: {
      score: 6.8,
      pagespeedMobile: 69,
      pagespeedDesktop: 89,
      conversion: 2.4,
      conversionDelta: 0.1,
      sessions: "12,3 mil",
      clarityBugs: 1,
      lcp: "2,7s",
      inp: "200ms",
      cls: "0,07",
      areas: [
        { label: "CRO e Conversão", score: 6.7 },
        { label: "Design e UX", score: 7.1 },
        { label: "Branding", score: 7.0 },
        { label: "Produto e Conteúdo", score: 6.5 },
        { label: "Performance", score: 6.4 },
        { label: "Tecnologia", score: 7.0 },
      ],
      opportunities: [
        { title: "Guia de tamanhos", description: "Clientes em dúvida entre medidas de lençol e colchão.", impact: "medio", score: 6.0 },
      ],
      actionPlan: [
        { title: "Guia de medidas interativo", gain: "-15% trocas" },
      ],
      clarity: { rageClicks: 11, deadClicks: 40, scrollDepth: "52%" },
      status: "ativo",
    },
  },
  {
    id: "mar-aberto",
    name: "Mar Aberto",
    domain: "marabertosurf.com.br",
    platform: "Nuvemshop",
    segment: "Esportes",
    product: "moda surf",
    type: "inadimplente",
    status: "inativo",
    projectId: "IST-0087",
    startDate: "2025-11-03",
    endDate: "2026-03-15",
    nps: 5,
    priority: "baixa",
    opportunity: "media",
    links: { drive: "#", whatsapp: "#", freelup: "#" },
    contacts: [
      { name: "André Sales", role: "Sócio", whatsapp: "(13) 99102-6677", initials: "AS" },
    ],
    team: [m("rafael")],
    doneCount: 14,
    analysis: {
      score: 5.9,
      pagespeedMobile: 55,
      pagespeedDesktop: 81,
      conversion: 1.7,
      conversionDelta: -0.3,
      sessions: "7,4 mil",
      clarityBugs: 3,
      lcp: "3,6s",
      inp: "260ms",
      cls: "0,11",
      areas: [
        { label: "CRO e Conversão", score: 5.6 },
        { label: "Design e UX", score: 6.2 },
        { label: "Branding", score: 6.8 },
        { label: "Produto e Conteúdo", score: 5.5 },
        { label: "Performance", score: 4.9 },
        { label: "Tecnologia", score: 6.3 },
      ],
      opportunities: [
        { title: "Velocidade do site", description: "Scripts de apps desativados ainda carregam no tema.", impact: "alto", score: 4.8 },
      ],
      actionPlan: [
        { title: "Remover scripts de apps antigos", gain: "+10% conversão" },
      ],
      clarity: { rageClicks: 38, deadClicks: 97, scrollDepth: "44%" },
      status: "atencao",
    },
  },
];

export const clients: Client[] = seeds.map(({ doneCount, product, ...seed }) => ({
  ...seed,
  summary: `${seed.name} é uma marca de ${product} no segmento de ${seed.segment.toLowerCase()}. O projeto na ${seed.platform} cobre setup, integrações e implementação da loja, com foco em conversão e em uma operação organizada para o time do cliente.`,
  briefing: [
    { label: "Oferta", value: `Linha principal de ${product}, frete grátis acima de R$ 299.` },
    { label: "Cores", value: "Preto, off-white e um tom de destaque da marca." },
    { label: "Brandbook", value: "Disponível no Drive do projeto." },
    { label: "Tom de voz", value: "Próximo, direto e confiante." },
    { label: "Objetivo do projeto", value: "Aumentar conversão e organizar a operação da loja." },
  ],
  icp: [
    { label: "Perfil", value: "25 a 44 anos, classes A e B, compra pelo celular." },
    { label: "Dores", value: "Insegurança com tamanho/qualidade e prazo de entrega." },
    { label: "Desejos", value: "Produto com identidade, entrega rápida e troca fácil." },
    { label: "Canais", value: "Instagram, Google Shopping e indicação." },
  ],
  competitors: [
    { name: "Concorrente A", domain: "concorrentea.com.br", note: "PDP com vídeo e reviews em destaque." },
    { name: "Concorrente B", domain: "concorrenteb.com.br", note: "Checkout em uma página, frete na PDP." },
    { name: "Concorrente C", domain: "concorrentec.com.br", note: "Forte em conteúdo e SEO de coleção." },
  ],
  notes: [
    { author: seed.team[0], date: "2026-10-28", text: "Cliente aprovou as referências. Seguimos para o tema." },
    { author: seed.team[seed.team.length - 1], date: "2026-10-22", text: "Acessos do ERP liberados; aguardando token de produção." },
  ],
  phases: buildPhases(doneCount, seed.team, seed.startDate),
}));

export function getClient(id: string) {
  return clients.find((client) => client.id === id);
}

export function taskStats(client: Client) {
  const tasks = client.phases.flatMap((phase) => phase.tasks);
  const done = tasks.filter((task) => task.status === "feito").length;
  return {
    total: tasks.length,
    done,
    pending: tasks.length - done,
    progress: Math.round((done / tasks.length) * 100),
  };
}

export function daysLeft(endDate: string, today = TODAY) {
  const diff = new Date(endDate).getTime() - new Date(today).getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export const TODAY = "2026-10-30";

export const typeLabels: Record<ProjectType, string> = {
  recorrente: "Recorrente",
  implementacao: "Implementação",
  inadimplente: "Inadimplente",
};

export const levelLabels: Record<Level, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
};

export function overviewStats() {
  return {
    total: clients.length,
    active: clients.filter((c) => c.status === "ativo").length,
    inactive: clients.filter((c) => c.status === "inativo").length,
    recorrente: clients.filter((c) => c.type === "recorrente").length,
    implementacao: clients.filter((c) => c.type === "implementacao").length,
    inadimplente: clients.filter((c) => c.type === "inadimplente").length,
  };
}

export type Reminder = {
  id: string;
  priority: "low" | "medium" | "high";
  when: string;
  text: string;
  clientId: string;
  owner: Member;
  done: boolean;
};

export const reminders: Reminder[] = [
  { id: "r1", priority: "high", when: "Hoje, 14:00", text: "Enviar token de produção do ERP para o Rafael.", clientId: "spinnaker", owner: m("isaac"), done: false },
  { id: "r2", priority: "medium", when: "Hoje, 16:30", text: "Revisar banners da home antes da apresentação.", clientId: "vinci-society", owner: m("marina"), done: true },
  { id: "r3", priority: "low", when: "Amanhã, 10:00", text: "Atualizar briefing com a nova oferta de Black Friday.", clientId: "bora-cafe", owner: m("ana"), done: false },
  { id: "r4", priority: "high", when: "Amanhã, 09:00", text: "Cobrar parcela em aberto antes de seguir a fase 04.", clientId: "outra-marca", owner: m("isaac"), done: false },
  { id: "r5", priority: "medium", when: "Seg, 11:00", text: "Configurar Clarity e PageSpeed no painel.", clientId: "cicatribem", owner: m("rafael"), done: false },
];

export type UrgentDemand = {
  id: string;
  title: string;
  clientId: string;
  assignee: Member;
  due: string;
  severity: "critico" | "alto";
};

export const urgentDemands: UrgentDemand[] = [
  { id: "d1", title: "Erro no checkout (botão não finaliza no iOS)", clientId: "vinci-society", assignee: m("bruno"), due: "Hoje", severity: "critico" },
  { id: "d2", title: "SKUs duplicados após sincronização com ERP", clientId: "spinnaker", assignee: m("rafael"), due: "Hoje", severity: "critico" },
  { id: "d3", title: "Imagem distorcida na home (mobile)", clientId: "cicatribem", assignee: m("marina"), due: "Amanhã", severity: "alto" },
  { id: "d4", title: "Política de troca desatualizada", clientId: "voy-shoes", assignee: m("ana"), due: "Amanhã", severity: "alto" },
];

export const currentUser = m("isaac");
