# OVGS — Sistema de Gestão de Ordens de Venda

Frontend Sênior challenge: um sistema de **Ordens de Venda e Gestão de Suprimentos**
construído em Next.js + TypeScript, com Clean Architecture, DDD, Smart/Dumb
components, dark mode e uma API REST inteiramente simulada por MSW.

> Não existe backend real neste repositório. Toda a "API" descrita em
> [`public/openapi.yaml`](public/openapi.yaml) e navegável em `/api-docs` é
> servida por [MSW](https://mswjs.io) (`src/infrastructure/mocks`), rodando
> tanto no browser (dev/produção) quanto no Node (testes de integração). Assim
> o fluxo completo — requisição HTTP via `axios`, serialização, status codes,
> erros — é validado de ponta a ponta sem depender de infraestrutura externa.

## Sumário

- [Stack e por quê](#stack-e-por-quê)
- [Arquitetura](#arquitetura)
- [Modelagem do domínio](#modelagem-do-domínio)
- [React Query vs. Redux Saga](#react-query-vs-redux-saga)
- [Design system e dark mode](#design-system-e-dark-mode)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Como rodar](#como-rodar)
- [Testes](#testes)
- [Documentação da API](#documentação-da-api)
- [Persistência](#persistência)
- [Escalabilidade e performance](#escalabilidade-e-performance)
- [Observabilidade](#observabilidade)
- [Segurança e autorização](#segurança-e-autorização)
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

O código segue Clean Architecture / DDD com quatro camadas. As regras de
dependência entre elas são impostas em tempo de lint pelo `eslint-plugin-boundaries`
(veja `.eslintrc.json`), não apenas documentadas em texto:

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

A regra de dependência é `domain ← application ← infrastructure ← presentation ← app`,
com `store` liberado para `presentation`/`app`. Uma tentativa de importar
`infrastructure` dentro de `domain`, por exemplo, quebra o lint (e o CI).

### Imports absolutos

Cada camada tem seu próprio alias (`@domain/*`, `@application/*`,
`@infrastructure/*`, `@presentation/*`, `@store/*`, `@lib/*`, mais o `@/*`
genérico para o resto). Isso elimina os `../../../..` de sempre e, combinado
com `boundaries/elements` do ESLint, faz a violação de camada aparecer já no
import, antes de qualquer revisão manual.

## Modelagem do domínio

Cada entidade nasce como um schema Zod em `domain/entities` (`Order`,
`Client`, `Item`, `TransportType`, `Scheduling`, `AuditLog`). O schema é a
fonte única da verdade: o tipo TypeScript é derivado dele via `z.infer`, então
não existe risco de tipo e validação runtime saírem de sincronia — coisa comum
quando se escreve a interface manualmente e a validação separada.

As decisões de negócio, por sua vez, ficam isoladas em `domain/rules` como
funções puras que recebem entidades e devolvem uma decisão, sem tocar em
estado, rede ou React:

- `order-state-machine.ts` decide qual é a próxima transição válida de status
  (`CRIADA → PLANEJADA → AGENDADA → EM_TRANSITO → ENTREGUE`), impedindo saltos
  fora de ordem.
- `transport-auth.ts` verifica se um cliente pode usar determinado tipo de
  transporte.
- `scheduling-capacity.ts` calcula se uma janela de entrega já está no limite
  de pedidos simultâneos.

Violações dessas regras não são apenas `throw new Error('mensagem genérica')`:
cada uma tem uma classe própria em `domain/errors`
(`InvalidTransitionError`, `TransportNotAuthorizedError`,
`SchedulingNotAllowedError`, `DuplicateSkuError`), todas herdando de
`DomainError`. Isso deixa explícito, no tipo do erro, qual regra foi violada —
o `error-mapper` em `infrastructure/http` faz o caminho inverso, traduzindo o
código de erro HTTP mockado de volta para essas mesmas classes, então a UI
trata sempre o mesmo conjunto de erros de domínio, venha ela de uma validação
local ou de uma resposta do "servidor".

Value objects como `OrderStatus` e `DeliveryWindow` carregam sua própria
formatação e configuração de exibição (`ORDER_STATUS_CONFIG`, janelas padrão
de entrega), evitando que cada componente reimplemente "o que esse status
significa" com um `switch` espalhado pela UI.

## React Query vs. Redux Saga

Os dois convivem porque resolvem problemas diferentes.

React Query cobre todo o CRUD simples: clientes, itens, tipos de transporte,
listagem e detalhe de ordens. Uma requisição, um resultado, cache e
invalidação — usar Saga aqui seria reimplementar cache manualmente.

Redux Saga entra apenas no fluxo de agendamento de entrega
(`store/sagas/orders.saga.ts`), porque esse é o único ponto do sistema onde
existe uma orquestração real: disparar a confirmação ou reagendamento; checar
no cliente, com as ordens já carregadas, se a janela de entrega bateu no
limite de capacidade (`domain/rules/scheduling-capacity.ts`); se bateu, pausar
o fluxo e abrir um diálogo de conflito perguntando se o usuário quer seguir
mesmo assim; só então concluir com a chamada HTTP. Pausar um efeito no meio,
esperar uma decisão da UI e retomar é exatamente o que sagas modelam bem com
`take`/`put`, e fica desconfortável de expressar só com callbacks de mutação.

A ponte entre os dois mundos é o hook `useSchedulingFlow`
(`presentation/features/scheduling/api`): ele despacha as actions da saga e,
ao observar o estado global mudar, atualiza o cache do React Query. Assim o
resto da aplicação continua lendo dados de ordens de uma única fonte,
independentemente de qual dos dois mecanismos originou a mudança.

## Design system e dark mode

Cores, espaçamento e tipografia vivem como CSS variables em `globals.css`,
consumidas pelo Tailwind via `tailwind.config.ts`. O dark mode usa a mesma
paleta com os tokens remapeados sob a classe `.dark`; nenhum componente
conhece a diferença entre os dois temas, só usa classes como `bg-surface` ou
`text-text-muted`. Um script inline no `<head>` (`app/layout.tsx`) aplica a
classe antes da hidratação para evitar flash do tema errado, e a preferência
fica salva em `localStorage` (`presentation/shared/hooks/use-theme.ts`).

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
  lib/                        utilitários genéricos (datas, query keys, cn, logger)
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

Abra http://localhost:3000. O MSW inicializa automaticamente no browser
(`NEXT_PUBLIC_ENABLE_MSW=true`) e popula um conjunto realista de clientes,
tipos de transporte, itens, ordens em todos os status e logs de auditoria.

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

Testes de unidade cobrem as regras de domínio puras (`order-state-machine`,
`scheduling-capacity`, `transport-auth`), os casos de uso de `application`
(criação de ordem, avanço de status, agendamento) e o mapeador de erros HTTP →
domínio — nenhum deles depende de React ou de rede, então rodam em
milissegundos e servem de rede de segurança para qualquer refatoração futura
das regras de negócio.

Testes de integração renderizam os containers com React Testing Library sobre
providers reais (React Query + Redux + toasts), com o MSW interceptando as
requisições de fato — os mesmos handlers usados em desenvolvimento. Hoje
cobrem tipos de transporte, clientes (incluindo o checkbox de autorização de
transporte), itens (incluindo a rejeição de SKU duplicado pelo handler) e a
criação de uma ordem de venda respeitando o transporte autorizado por cliente.

MSW v2 depende de APIs Web (`fetch`, `Request`, `BroadcastChannel`, streams)
que o `jsdom` do Jest não fornece por padrão; `jest.setup.ts` faz o polyfill
dessas APIs a partir dos módulos nativos do Node. Os pacotes ESM-only
transitivos do MSW são transpilados via `transpilePackages` no
`next.config.mjs`, o mecanismo oficial do `next/jest` para isso (evita
duplicar configuração de Babel/SWC).

## Documentação da API

O contrato REST completo — endpoints, schemas de request/response e os
códigos de erro usados pelo `error-mapper` — está em
[`public/openapi.yaml`](public/openapi.yaml) e pode ser navegado
interativamente em `/api-docs` (Swagger UI), também linkado na sidebar do
app. Esse documento é a referência para uma futura implementação real do
backend: os handlers MSW em `src/infrastructure/mocks/handlers` seguem
exatamente esse contrato.

## Persistência

Não há banco de dados. Os handlers MSW (`src/infrastructure/mocks/handlers`)
guardam o estado das entidades em arrays em memória, seedados uma vez por
sessão do worker (`src/infrastructure/mocks/fixtures`) e mutados pelos
próprios handlers a cada POST/PATCH. Criar uma ordem ou avançar um status
"persiste" durante a sessão do browser, mas se perde ao recarregar o service
worker do zero. A única persistência real hoje é a preferência de tema
(`localStorage`, `presentation/shared/hooks/use-theme.ts`).

O ponto que importa para uma evolução futura é que nenhuma camada acima de
`infrastructure` sabe disso. `application` só conhece os ports de repositório
(`application/ports/*.repository.ts`); trocar o MSW por um backend real com
Postgres, por exemplo, significa reescrever `infrastructure/repositories`
(a implementação HTTP já existe e não mudaria) sem tocar em casos de uso,
componentes ou testes de domínio/aplicação.

## Escalabilidade e performance

A listagem de ordens (`GET /orders`) aceita `page`/`pageSize` e filtros de
status, cliente, transporte e período no próprio handler MSW, então o cliente
nunca busca a base inteira — o mesmo contrato já está em `openapi.yaml` para
quando existir uma API real por trás. Cadastros que mudam pouco (clientes,
itens, tipos de transporte) e listagens de ordens compartilham o mesmo
`QueryClient`, mas a invalidação é granular por `queryKey`: atualizar uma
ordem não invalida o cache de clientes ou itens.

Dados derivados que cruzam entidades — por exemplo, mapear ordens para seus
clientes e transportes nas telas de detalhe, monitoramento e agendamento —
são construídos com `useMemo` em vez de recalculados a cada render. Cada rota
do App Router já sai como um chunk separado, e a página `/api-docs` isola a
dependência pesada `swagger-ui-react` do bundle principal do dashboard.

Se o volume de ordens crescer além do que a paginação resolve bem, o próximo
ajuste natural seria virtualizar a tabela (`@tanstack/react-virtual`); não fiz
isso agora porque não havia necessidade real no escopo do desafio.

## Observabilidade

Existe um port `Logger` com um adapter de console (`src/lib/logger.ts`).
Trocar para um provedor real — Sentry, Datadog, um endpoint de log próprio —
é escrever um novo adapter que implementa a mesma interface, sem alterar quem
consome `logger`. Ele está ligado em alguns pontos concretos do app:

React Query loga toda falha de busca (com a `queryKey`) e toda mutação
concluída ou com erro (com um `mutationKey` por operação, como
`['orders', 'create']`) direto no `QueryCache`/`MutationCache`
(`lib/query-client.ts`). A saga de agendamento loga seus pontos de decisão —
início do fluxo, conflito de capacidade detectado, resposta do usuário ao
conflito, sucesso ou erro final (`store/sagas/orders.saga.ts`). O
`WebVitalsReporter` (`app/web-vitals-reporter.tsx`) usa `next/web-vitals` para
reportar métricas de performance (LCP, CLS, INP) assim que o browser as
calcula, e o `PageViewLogger` (`app/page-view-logger.tsx`) loga toda mudança
de rota via `usePathname`.

Para interações específicas, o `Button` compartilhado aceita uma prop
opcional `trackingEvent` que loga o clique sem exigir mudança nos outros usos
do componente; está aplicada nas ações de negócio mais relevantes (criar
ordem, avançar status, atualizar transporte, abrir/confirmar/reagendar
agendamento).

Esses logs técnicos (erros, web vitals, navegação, interações) são o lado
"quão bem o sistema está se comportando". O lado "o que está acontecendo com
o negócio" é a página de **Monitoramento Operacional**
(`presentation/features/monitoring`), que cruza as métricas de ordens por
status com os mesmos filtros de cliente, transporte e período usados na
listagem — junto com a **Auditoria** (`presentation/features/audit`), que
registra cada mutação relevante como um evento no histórico da ordem. Juntos,
os dois lados dão tanto o dado agregado para o time de operação quanto o
rastro técnico para debugar um caso específico.

## Segurança e autorização

Autenticação de usuário (login, sessão, papéis) está fora do escopo do
desafio e não foi simulada — não faria sentido montar isso sobre uma API
inteiramente mockada. O que existe, e que é o que efetivamente muda de
comportamento na aplicação, é autorização de negócio: a regra "este cliente
só pode usar estes tipos de transporte" (`domain/rules/transport-auth.ts`) é
aplicada no caso de uso de criação de ordem (`application/orders/create-order.use-case.ts`)
e refletida na UI como consequência — a lista de transportes disponíveis no
formulário já vem filtrada pelo cliente selecionado, então a interface nunca
decide por conta própria o que é permitido.

Toda entrada de formulário passa por um schema Zod antes de chegar em
qualquer lógica de negócio (React Hook Form + `zodResolver`), e o mesmo schema
valida de novo no handler MSW — a mesma dupla validação (cliente e "servidor")
que existiria contra uma API real. Erros do servidor mockado voltam com um
código estruturado (`DUPLICATE_SKU`, `TRANSPORT_NOT_AUTHORIZED`, etc.) que o
`error-mapper` traduz para uma classe de domínio conhecida, em vez de expor
mensagem ou stack trace crus ao usuário.

Em `next.config.mjs`, `headers()` aplica um conjunto básico de headers de
segurança em todas as rotas: `X-Content-Type-Options: nosniff`,
`X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`,
`Permissions-Policy` restringindo câmera/microfone/geolocalização, e uma
Content-Security-Policy. A CSP relaxa `script-src`/`style-src` com
`'unsafe-inline'` de propósito: o script de bootstrap do tema em
`app/layout.tsx` precisa ser inline para rodar antes da hidratação (evitar
flash do tema errado), e o `swagger-ui-react` injeta estilos inline. Uma CSP
mais estrita exigiria nonce por request, o que não se paga para um projeto
sem backend real por trás.

## Docker

```bash
docker compose up --build
```

O `Dockerfile` usa build multi-stage com a saída `standalone` do Next.js
(imagem final `node:20-alpine`, sem devDependencies). Como não há backend
real, o MSW continua habilitado por padrão dentro do container
(`NEXT_PUBLIC_ENABLE_MSW=true`); para apontar para uma API real, sobrescreva
os build args:

```bash
docker build --build-arg NEXT_PUBLIC_API_URL=https://api.exemplo.com \
             --build-arg NEXT_PUBLIC_ENABLE_MSW=false -t ovgs-web .
```

## CI

`.github/workflows/ci.yml` roda em push/PR para `main`: formatação, lint,
type-check e testes com cobertura em um job; build de produção do Next.js em
outro; build da imagem Docker (sem publicar) em um terceiro. Os dois últimos
dependem do primeiro passar. O pipeline usa só `npm ci` e scripts padrão, então
portar para Azure Pipelines, GitLab CI ou qualquer outro runner é reescrever a
sintaxe dos steps, não a lógica.

## Decisões e trade-offs

- **Sem backend real.** Assumido pelo enunciado do desafio. O MSW substitui a
  API mantendo o cliente HTTP (`axios`) e o mapeamento de erros idênticos ao
  que seriam contra uma API de verdade.
- **Capacidade de agendamento validada no cliente.** A regra
  (`domain/rules/scheduling-capacity.ts`) e o diálogo de conflito rodam hoje
  inteiramente no Redux Saga, lendo as ordens já carregadas. O contrato em
  `openapi.yaml` já documenta a resposta `409 SCHEDULING_CAPACITY_EXCEEDED`
  que um backend real deveria validar de novo no servidor — não dá pra
  confiar só na checagem client-side em produção.
- **`--forceExit` no Jest.** Os interceptors do MSW mantêm um handle de timer
  aberto no Node mesmo depois de `server.close()`. Forçar a saída é o ajuste
  recomendado pela própria comunidade do MSW para uso com Jest, e não afeta o
  resultado dos testes.
- **Saga só onde há orquestração de verdade.** O fluxo de agendamento modela
  uma sequência real de eventos (pedido → checagem de capacidade → conflito →
  resposta do usuário → sucesso/erro), o que também é o que torna esse fluxo,
  e só ele, fácil de logar ponto a ponto. Os outros 90% da aplicação são CRUD
  request/response simples via React Query; um barramento de eventos ali
  seria complexidade sem ganho.
- **Filtro e paginação no "servidor", não no cliente.** Isso evita tanto
  over-fetching quanto lógica de filtro duplicada entre componentes — o
  cliente só pede a página que precisa, e o React Query cuida de deduplicar e
  cachear por `queryKey`.
