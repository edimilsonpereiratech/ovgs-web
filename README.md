# OVGS — Sistema de Gestão de Ordens de Venda

Frontend Sênior challenge: um sistema de **Ordens de Venda e Gestão de Suprimentos**
construído em Next.js + TypeScript, com Clean Architecture, DDD, Smart/Dumb
components, dark mode e uma API REST inteiramente simulada por MSW.

> Não existe backend real neste repositório. Toda a "API" descrita em
> [`public/openapi.yaml`](public/openapi.yaml) e navegável em `/api-docs` é
> servida por [MSW](https://mswjs.io) (`src/infrastructure/mocks`), rodando
> tanto no browser (dev/produção) quanto no Node (testes de integração). Isso
> permite validar o fluxo completo — requisição HTTP real via `axios`,
> serialização, status codes, erros — sem depender de infraestrutura externa.

## Sumário

- [Stack e por quê](#stack-e-por-quê)
- [Arquitetura](#arquitetura)
- [React Query vs. Redux Saga](#react-query-vs-redux-saga)
- [Design system e dark mode](#design-system-e-dark-mode)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Como rodar](#como-rodar)
- [Testes](#testes)
- [Documentação da API](#documentação-da-api)
- [Persistência](#persistência)
- [Escalabilidade e performance](#escalabilidade-e-performance)
- [Observabilidade](#observabilidade)
- [Docker](#docker)
- [CI](#ci)
- [Decisões e trade-offs](#decisões-e-trade-offs)

## Stack e por quê

| Camada               | Escolha                                         | Motivo                                                                                          |
| -------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| Framework            | Next.js 14 (App Router) + TypeScript strict     | SSR/SSG opcional, roteamento por arquivo, base amplamente adotada em vagas sênior               |
| Estado de servidor   | TanStack React Query                            | Cache, revalidação e deduplicação de requisições "de graça" para CRUDs simples                  |
| Estado global/fluxos | Redux Toolkit + Redux Saga                      | Orquestração de fluxos assíncronos com múltiplos passos e efeitos colaterais (ver seção abaixo) |
| Formulários          | React Hook Form + Zod                           | Zod como fonte única da verdade: valida em runtime e gera os tipos estáticos via `z.infer`      |
| Estilo               | Tailwind CSS + CSS variables                    | Design tokens centralizados, dark mode sem duplicar classes                                     |
| Mocks                | MSW v2                                          | Intercepta `fetch`/XHR de verdade — o mesmo código de produção roda em dev e nos testes         |
| Testes               | Jest + React Testing Library                    | Testes de unidade (domínio/aplicação) e integração (containers + MSW)                           |
| Qualidade            | ESLint (+ `eslint-plugin-boundaries`), Prettier | Lint de camadas arquiteturais e formatação consistente                                          |

## Arquitetura

O código segue **Clean Architecture / DDD** com quatro camadas e regras de
dependência **impostas em tempo de lint** por `eslint-plugin-boundaries`
(veja `.eslintrc.json`):

```
domain          → sem dependências externas. Entidades (Zod), value objects,
                   regras de negócio puras (máquina de estados, autorização de
                   transporte, capacidade de agendamento) e erros tipados.
application     → casos de uso que orquestram `domain` através de ports
                   (interfaces de repositório). Não sabe que existe HTTP, MSW
                   ou React.
infrastructure  → implementações concretas dos ports: repositórios HTTP
                   (axios), mapeamento de erros HTTP → erros de domínio, e os
                   mocks MSW (handlers + fixtures) que fazem o papel do backend.
presentation    → React. Cada feature em `presentation/features/<nome>` tem:
                     api/         hooks de React Query (dumb sobre os repositórios)
                     components/  componentes "dumb" — só recebem props, sem fetch
                     containers/  componentes "smart" — buscam dados, decidem o
                                  que renderizar e repassam callbacks
store           → Redux Toolkit + Sagas para os fluxos que não são CRUD simples.
app             → rotas do Next.js (App Router). Só compõe containers de
                   `presentation`, sem lógica própria.
```

Regra de dependência: `domain ← application ← infrastructure ← presentation ← app`,
mais `store` podendo ser usado por `presentation`/`app`. Isso é validado pelo
próprio `next lint`, então uma tentativa de importar `infrastructure` dentro de
`domain`, por exemplo, quebra o CI.

### Imports absolutos

Aliases dedicados por camada (`@domain/*`, `@application/*`,
`@infrastructure/*`, `@presentation/*`, `@store/*`, `@lib/*`, além do `@/*`
genérico) eliminam `../../../..` e, combinados com o `boundaries/elements` do
ESLint, tornam a violação de camada visível já no import.

## React Query vs. Redux Saga

Os dois convivem porque resolvem problemas diferentes:

- **React Query** cobre todo o CRUD simples (clientes, itens, tipos de
  transporte, listagem/detalhe de ordens): uma requisição, um resultado, cache
  e invalidação. Usar Saga aqui seria reimplementar cache manualmente.
- **Redux Saga** entra apenas no fluxo de **agendamento de entrega**
  (`store/sagas/orders.saga.ts`), que é um processo com múltiplos passos e uma
  decisão de negócio no meio do caminho: (1) disparar a confirmação/reagendamento,
  (2) checar client-side se a janela de entrega já está no limite de
  capacidade (`domain/rules/scheduling-capacity.ts`) usando as ordens já
  carregadas, (3) se estiver no limite, pausar e abrir um diálogo de conflito
  perguntando se o usuário quer prosseguir mesmo assim, e só então (4) seguir
  com a chamada HTTP. Esse tipo de orquestração — pausar um efeito no meio,
  esperar uma decisão da UI, retomar — é exatamente o que sagas modelam bem
  com `take`/`put` e é desconfortável de expressar só com hooks de mutação.
  O hook `useSchedulingFlow` (`presentation/features/scheduling/api`) é a ponte:
  ele despacha as actions da saga e, ao observar o estado global mudar,
  atualiza o cache do React Query — assim o restante da aplicação continua
  lendo dados de ordens de uma única fonte.

## Design system e dark mode

Cores, espaçamento e tipografia vivem como CSS variables em `globals.css`,
consumidas pelo Tailwind via `tailwind.config.ts`. Dark mode é a mesma paleta
com os tokens re-mapeados sob a classe `.dark` — nenhum componente conhece a
diferença entre os dois temas, apenas usa classes como `bg-surface` ou
`text-text-muted`. Um script inline no `<head>` (`app/layout.tsx`) aplica a
classe antes da hidratação para evitar flash de tema errado, e a preferência é
persistida em `localStorage` (`presentation/shared/hooks/use-theme.ts`).

## Estrutura de pastas

```
src/
  app/                        rotas (App Router)
  domain/                     entidades, value objects, regras, erros
  application/                casos de uso + ports (interfaces de repositório)
  infrastructure/
    http/                     cliente axios, endpoints, mapeador de erros
    repositories/              implementação HTTP dos ports
    mocks/                    handlers MSW, fixtures e setup do worker/servidor
  presentation/
    features/<feature>/       api (hooks), components (dumb), containers (smart)
    shared/                   design system (button, table, drawer, toast, ...)
    test-utils/                helpers de teste (providers)
  store/                      Redux Toolkit slices + sagas
  lib/                        utilitários genéricos (datas, query keys, cn)
public/
  openapi.yaml                 contrato REST (fonte para o Swagger UI)
  mockServiceWorker.js          service worker gerado pelo MSW
```

## Como rodar

Requer Node 20+.

```bash
npm install
cp .env.example .env.local   # já vem com os defaults corretos
npm run dev
```

Abra http://localhost:3000 — o MSW inicializa automaticamente no browser
(`NEXT_PUBLIC_ENABLE_MSW=true`) e popula um conjunto realista de clientes,
tipos de transporte, itens, ordens (em todos os status) e logs de auditoria.

Scripts disponíveis:

```bash
npm run dev            # ambiente de desenvolvimento
npm run build           # build de produção (standalone)
npm run start            # serve o build de produção
npm run lint              # ESLint + regras de camada
npm run type-check        # tsc --noEmit
npm run test               # Jest (unidade + integração)
npm run test:coverage       # Jest com relatório de cobertura
npm run format              # Prettier --write
npm run format:check         # Prettier --check
```

## Testes

```bash
npm run test
```

- **Unidade** — regras de domínio puras (`order-state-machine`,
  `scheduling-capacity`, `transport-auth`), casos de uso de `application`
  (criação de ordem, avanço de status, agendamento) e o mapeador de erros
  HTTP → domínio, todos testados sem nenhuma dependência de React ou rede.
- **Integração** — containers renderizados com React Testing Library sobre
  providers reais (React Query + Redux), com o MSW interceptando as
  requisições HTTP de fato (mesmos handlers usados em dev). Cobrem, por
  exemplo, listar/criar um tipo de transporte via drawer e criar uma ordem de
  venda respeitando a regra de transporte autorizado por cliente.

MSW v2 depende de APIs Web (`fetch`, `Request`, `BroadcastChannel`, streams)
que o ambiente `jsdom` do Jest não fornece por padrão — `jest.setup.ts`
poliflla essas APIs a partir dos módulos nativos do Node. Os pacotes ESM-only
transitivos do MSW são transpilados via `transpilePackages` no
`next.config.mjs`, mecanismo oficial do `next/jest` para isso (evita duplicar
configuração de Babel/SWC).

## Documentação da API

O contrato REST completo (todos os endpoints, schemas de request/response e
códigos de erro usados pelo `error-mapper`) está em
[`public/openapi.yaml`](public/openapi.yaml) e é navegável interativamente em
`/api-docs` (Swagger UI) — também linkado na sidebar do app. Esse documento é
a referência para uma futura implementação real do backend: os handlers MSW
em `src/infrastructure/mocks/handlers` seguem exatamente esse contrato.

## Persistência

Não há banco de dados: os handlers MSW (`src/infrastructure/mocks/handlers`)
guardam o estado das entidades em arrays em memória, seedados uma vez por
sessão do worker (`src/infrastructure/mocks/fixtures`) e mutados pelos
próprios handlers a cada POST/PATCH — por isso criar uma ordem ou avançar um
status "persiste" durante a sessão do browser, mas é perdido ao recarregar o
service worker do zero. A única persistência real hoje é a preferência de
tema (`localStorage`, `presentation/shared/hooks/use-theme.ts`).

O ponto relevante para uma evolução futura é que nenhuma camada acima de
`infrastructure` sabe disso: `application` só conhece os ports de repositório
(`application/ports/*.repository.ts`), então trocar o MSW por um backend real
com Postgres/Prisma é reescrever `infrastructure/repositories` (a
implementação HTTP já existe e não mudaria) sem tocar em casos de uso,
componentes ou testes de domínio/aplicação.

## Escalabilidade e performance

- **Paginação server-side** — a listagem de ordens (`GET /orders`) aceita
  `page`/`pageSize` e filtros (status, cliente, transporte, período) no
  próprio handler MSW, evitando trazer a base inteira para o cliente; o
  mesmo contrato está documentado em `openapi.yaml` para quando existir uma
  API real.
- **Cache e `staleTime` por tipo de dado** (`lib/query-client.ts`,
  `presentation/features/*/api/*.keys.ts`) — cadastros que mudam pouco
  (clientes, itens, tipos de transporte) e listagens de ordens compartilham o
  mesmo `QueryClient`, mas a invalidação é granular por `queryKey`, então
  atualizar uma ordem não invalida o cache de clientes/itens.
- **Memoização de dados derivados** — mapas (`Map<id, entidade>`) usados para
  cruzar ordens com clientes/itens/tipos de transporte nas telas de detalhe,
  monitoramento e agendamento são construídos com `useMemo`, evitando
  recomputar a cada re-render.
- **Code-splitting automático** — cada rota do App Router já é um chunk
  separado; a página `/api-docs` isola a dependência pesada
  `swagger-ui-react` do bundle principal do dashboard.
- **Próximo passo natural** — se o volume de ordens crescer bastante,
  virtualização de lista (`@tanstack/react-virtual`) na tabela de ordens seria
  o próximo ajuste; não foi feito agora porque a paginação já resolve o
  volume esperado para o desafio.

## Observabilidade

Existe um port `Logger` com um adapter de console (`src/lib/logger.ts`) —
trocar para um provedor real (Sentry, Datadog, um endpoint de log próprio)
significa escrever um novo adapter que implementa a mesma interface, sem
tocar em quem consome `logger`. Ele está conectado em quatro pontos:

- **React Query** (`lib/query-client.ts`) — `QueryCache`/`MutationCache`
  logam toda falha de busca (com a `queryKey`) e toda mutação concluída/com
  erro (com um `mutationKey` por operação, ex. `['orders', 'create']`).
- **Saga de agendamento** (`store/sagas/orders.saga.ts`) — loga os pontos de
  decisão do fluxo: início, conflito de capacidade detectado, resolução do
  usuário (prosseguir ou cancelar) e sucesso/erro final.
- **Web Vitals** (`app/web-vitals-reporter.tsx`, via `next/web-vitals`) —
  reporta métricas de performance (LCP, CLS, INP etc.) assim que disponíveis.
- **Navegação e interações** — `PageViewLogger`
  (`app/page-view-logger.tsx`) loga toda mudança de rota, e o `Button`
  compartilhado aceita uma prop opcional `trackingEvent` que loga a
  interação no clique; ela é usada nas ações de negócio mais relevantes
  (criar ordem, avançar status, atualizar transporte, abrir/confirmar/
  reagendar agendamento) sem exigir alteração nos outros usos do componente.

## Docker

```bash
docker compose up --build
```

O `Dockerfile` usa build multi-stage com a saída `standalone` do Next.js
(imagem final `node:20-alpine` sem devDependencies). Por não haver backend
real, o MSW continua habilitado por padrão dentro do container
(`NEXT_PUBLIC_ENABLE_MSW=true`); para apontar para uma API real, sobrescreva
os build args:

```bash
docker build --build-arg NEXT_PUBLIC_API_URL=https://api.exemplo.com \
             --build-arg NEXT_PUBLIC_ENABLE_MSW=false -t ovgs-web .
```

## CI

`.github/workflows/ci.yml` roda em push/PR para `main`: formatação, lint,
type-check e testes (com cobertura) em um job; build de produção do Next.js
em outro; e um build da imagem Docker (sem publicar) em um terceiro — os três
últimos dependem do primeiro passar. O pipeline usa apenas `npm ci`/scripts
padrão, então portar para Azure Pipelines, GitLab CI ou qualquer outro runner
é uma questão de reescrever a sintaxe dos steps, não a lógica.

## Decisões e trade-offs

- **Sem backend real** — assumido pelo enunciado do desafio; MSW substitui a
  API mantendo o cliente HTTP (`axios`) e o mapeamento de erros idênticos ao
  que seriam contra uma API real.
- **Capacidade de agendamento validada no cliente** — a regra de negócio
  (`domain/rules/scheduling-capacity.ts`) e o diálogo de conflito rodam hoje
  inteiramente no Redux Saga, lendo as ordens já carregadas; o contrato em
  `openapi.yaml` já documenta a resposta `409 SCHEDULING_CAPACITY_EXCEEDED`
  que um backend real deveria validar novamente do lado do servidor.
- **`--forceExit` no Jest** — os interceptors do MSW mantêm um handle de
  timer aberto no Node mesmo após `server.close()`; forçar a saída é o
  ajuste pragmático recomendado pela própria comunidade do MSW para uso com
  Jest, sem impacto nos resultados dos testes.
- **Orquestração event-driven só onde há orquestração de verdade** — Redux
  Saga modela o fluxo de agendamento como uma sequência de eventos
  (`schedulingRequested` → checagem de capacidade → `schedulingConflictDetected`
  → `schedulingConflictAcknowledged` → `schedulingSucceeded`/`schedulingFailed`),
  o que também é o que torna esse fluxo (e só ele) fácil de logar ponto a
  ponto. Os outros 90% da aplicação são CRUD request/response simples via
  React Query; introduzir um barramento de eventos ali seria complexidade sem
  ganho.
- **Otimização de consultas fica nas fronteiras, não em gambiarra de cache** —
  filtro e paginação de ordens/auditoria acontecem no "servidor" (handler
  MSW), não no cliente; o cliente só pede a página que precisa e o React
  Query deduplica/cacheia por `queryKey`. Isso evita tanto over-fetching
  quanto lógica de filtro duplicada entre componentes.
- **Autorização de negócio no domínio, não espalhada pela UI** — a regra de
  "só posso usar um transporte autorizado para aquele cliente"
  (`domain/rules/transport-auth.ts`) é aplicada no caso de uso de criação de
  ordem e refletida na UI apenas como consequência (a lista de transportes
  disponíveis já vem filtrada); a UI nunca decide sozinha o que é permitido.
  Autenticação/autorização de usuário (login, papéis, permissões por rota)
  está fora do escopo do desafio e não foi simulada.
