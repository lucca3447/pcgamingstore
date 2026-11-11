# Landing Page Interativa — Extreme Gamer Informática

> **Trabalho Discente Efetivo (TDE Parte II) — Programação Front-End**  
> **Centro Universitário Nobre (UNIFAN)**  
> **Professor:** Gean Paulo  
> **Estudantes:** João Lucca Sotero e Kauan Brandão  
> **Apresentação:** 17/11/2026 | **Local:** Feira de Santana, Bahia — 2026  

---

## 📌 Sobre o Projeto

O projeto **Extreme Gamer Informática** é uma aplicação web completa desenvolvida com **HTML5, CSS3 autoral e JavaScript puro (Vanilla JS)** para uma loja e laboratório técnico de alta performance localizado em Feira de Santana, Bahia.

Na **Parte II**, a aplicação recebeu uma camada completa de interatividade funcional:
- **Catálogo Filtrável:** Filtro instantâneo de computadores por categoria (eSports, Streamer, Alta Performance 4K e Todos).
- **Orçamento / Carrinho com LocalStorage:** Adição de máquinas ao carrinho com contadores no cabeçalho, persistência de dados no navegador, soma automática e cálculo de desconto de 10% no Pix.
- **Simulador Dinâmico de Atendimento:** Reatividade em tempo real às escolhas do cliente no formulário, alterando prazos, procedimentos e garantias técnicas.
- **Integração Real com WhatsApp:** Consolidação dos dados preenchidos e dos itens selecionados em uma mensagem codificada enviada diretamente para o WhatsApp oficial da loja.

---

## 🚀 Requisitos e Estruturas JavaScript (UNIFAN)

Todas as estruturas solicitadas pelo **Prof. Gean Paulo** foram implementadas de maneira semântica, limpa e modular em [`frontend/script.js`](frontend/script.js):

| Estrutura | Aplicação Prática no Projeto |
| :--- | :--- |
| **`if...else`** | Validação de campos obrigatórios no formulário; verificação de existência prévia de item no carrinho; cálculo do desconto de 10% no Pix vs parcelamento em 12x no cartão; verificação de correspondência no filtro de cards. |
| **`switch...case`** | Função `atualizarDetalhesServico(tipoServico)` no simulador, definindo dinamicamente prazo de entrega, cobertura de garantia e procedimento técnico para cada serviço (Montagem de PC, Limpeza Preventiva, Diagnóstico ou Upgrade). |
| **`for` (Laço de Repetição)** | Iteração sobre os cards do catálogo para aplicar os filtros visuais (`display: flex/none`); iteração sobre o array do `localStorage` para calcular subtotais, soma geral e renderizar os cards na gaveta do orçamento. |
| **`function`** | Funções modulares bem delimitadas: `obterCarrinhoStorage()`, `salvarCarrinhoStorage()`, `adicionarAoCarrinho()`, `removerDoCarrinho()`, `atualizarInterfaceCarrinho()`, `inicializarFiltrosCatalogo()`, `atualizarDetalhesServico()`, `calcularCondicaoPagamento()` e `processarEnvioOrcamento()`. |
| **`document.getElementById`** | Seleção direta e manipulação do DOM para botões, badges contadores, campos de formulário, resumo reativo e gaveta do orçamento. |
| **`localStorage`** | Persistência do array de itens orçados na chave `'extreme_gamer_carrinho'`, mantendo o orçamento salvo mesmo se o usuário recarregar ou fechar o navegador. |
| **Eventos (`addEventListener`)** | Escuta de eventos `click` (adicionar/remover do carrinho, filtros e abertura da gaveta), `change` (atualização imediata de serviços e formas de pagamento), `submit` (processamento e envio) e `DOMContentLoaded` (inicialização). |

---

## 👥 Roteiro de Apresentação em Dupla (Slides)

Para a apresentação do dia **17/11/2026**, o código foi dividido didaticamente para que ambos os alunos demonstrem domínio técnico:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                       EXTREME GAMER — APRESENTAÇÃO                          │
├──────────────────────────────────────┬──────────────────────────────────────┤
│ PARTE 1: JOÃO LUCCA SOTERO           │ PARTE 2: KAUAN BRANDÃO               │
├──────────────────────────────────────┼──────────────────────────────────────┤
│ • Catálogo e Filtros de Máquinas     │ • Simulador Reativo de Serviços      │
│ • Laço 'for' para percorrer produtos │ • Estrutura 'switch...case' (prazos) │
│ • 'if...else' nas categorias         │ • 'if...else' no cálculo de Pix 10%  │
│ • LocalStorage (persistência)        │ • Manipulação do DOM (resumo)        │
│ • 'for' para somar itens do carrinho │ • Validação e Disparo para WhatsApp  │
│ • document.getElementById e cliques  │ • Eventos 'change' e 'submit'        │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

---

## 📂 Estrutura de Diretórios Atualizada

```text
pcgamingstore/
├── frontend/
│   ├── img/
│   │   ├── pc-h9-titan.png            # Top de linha 4K (NZXT H9 Flow RGB)
│   │   ├── pc-h7-white.png            # Streamer White Edition (NZXT H7 Vidro Curvo)
│   │   ├── pc-tigeryt.jpg             # eSports Entrada (Gabinete Aquário)
│   │   ├── pc-custom-ryzen.jpg        # Full Custom Ryzen 7000 AM5
│   │   ├── servico-pasta-termica.jpg  # Limpeza & Troca de Pasta Térmica
│   │   ├── servico-diagnostico.jpg    # Diagnóstico e Bancada Técnica
│   │   ├── servico-montagem.jpg       # Montagem e Upgrades Cirúrgicos
│   │   ├── aquario-amber.jpg          # Gabinete Aquário iluminação Âmbar
│   │   └── hardware-rtx.jpg           # Placas de Vídeo GeForce RTX
│   ├── index.html                     # Estrutura HTML5, filtros, gaveta e semântica
│   ├── style.css                      # Estilização CSS3, variáveis, gaveta e responsividade
│   └── script.js                      # Toda a lógica JavaScript (TDE Parte II)
├── index.html                         # Redirecionamento amigável para hospedagem
├── previewprototipo.png               # Mockup de referência visual
└── readme.md                          # Documentação e guia acadêmico do projeto
```

---

## 🖥️ Como Visualizar e Testar Localmente

1. Abra a pasta `pcgamingstore/frontend/` no navegador ou execute via **Live Server** no VS Code.
2. **Teste dos Filtros:** Clique nos botões `eSports & Entrada`, `Streamer & Criação` e `Alta Performance 4K` para ver a filtragem dinâmica em ação via laço `for` e `if...else`.
3. **Teste do LocalStorage:** Clique em "Quero Este" em qualquer PC, abra a gaveta do orçamento, recarregue a página (F5) e observe que os itens permanecem salvos com totais calculados.
4. **Teste do Simulador:** No formulário de orçamento, alterne o tipo de serviço pretendido e a condição de pagamento para ver os prazos, procedimentos e descontos se atualizarem em tempo real via `switch...case` e `if...else`.
5. **Envio:** Preencha os campos e envie para testar a montagem automática da mensagem no WhatsApp.

---

## 🌐 Hospedagem

- **Vercel / GitHub Pages:** Aplicação versionada e pronta para execução em nuvem.

---

## 👥 Autores

- **João Lucca Sotero**
- **Kauan Brandão**

Curso de Tecnologia em Análise e Desenvolvimento de Sistemas — **UNIFAN (Centro Universitário Nobre)**  
Disciplina: **Programação Front-End** | Orientador: **Prof. Gean Paulo**
