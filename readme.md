# Landing Page Interativa — Extreme Gamer Informática

> **Trabalho Discente Efetivo (TDE Parte II) — Programação Front-End**  
> **Centro Universitário Nobre (UNIFAN)**  
> **Professor:** Gean Paulo  
> **Estudantes:** João Lucca Sotero e Kauan Brandão  
> **Data de Apresentação:** 17 de Novembro de 2026 (Envio até 16/11/2026)  
> **Apresentação de Slides Interativa:** [slides.html](slides.html)

---

## 🖥️ Sobre o Projeto

O projeto **Extreme Gamer Informática** é uma aplicação web completa desenvolvida com **HTML5 Semântico, CSS3 autoral e JavaScript puro (Vanilla JS)** para uma loja e laboratório técnico gamer localizado em Feira de Santana, Bahia.

Na **Parte II**, a aplicação recebeu uma camada completa de interatividade funcional:
- **Catálogo Filtrável:** Filtro instantâneo de computadores por categoria (eSports, Streamer, Alta Performance 4K e Todos) com laço `for` e `if...else`.
- **Orçamento / Carrinho com LocalStorage:** Adição de máquinas ao carrinho com contadores no cabeçalho, persistência de dados no navegador (`localStorage`), deduplicação, soma automática e cálculo de desconto de 10% no Pix.
- **Simulador Dinâmico de Atendimento:** Reatividade em tempo real às escolhas do cliente no formulário via `switch...case`, alterando dinamicamente prazos, procedimentos laboratoriais e garantias técnicas.
- **Integração Real com WhatsApp:** Consolidação dos dados preenchidos e dos itens selecionados com validação defensiva e codificação segura via `encodeURIComponent()`, abrindo diretamente a API oficial do WhatsApp.

---

## 📊 Apresentação de Slides (TDE II)

O projeto conta com um slide deck interativo e responsivo construído em HTML5/CSS3/JS, pronto para ser projetado em sala de aula ou exportado para PDF:
- **Arquivo dos Slides:** [`slides.html`](slides.html)
- **Modo Tela Cheia:** Pressione `F11` ou clique no botão *Tela Cheia*.
- **Anotações de Fala (Speaker Notes):** Pressione a tecla `N` ou clique em *Anotações de Fala* para exibir o roteiro verbal de cada slide.
- **Navegação:** Setas `←` e `→`, barra de espaço ou botões na barra inferior.
- **Exportação para PDF / Impressão:** Pressione `Ctrl + P` para gerar o documento formatado para entrega impressa.

---

## 📁 Estrutura do Repositório

```text
pcgamingstore/
├── frontend/
│   ├── index.html        # Estrutura semântica HTML5 completa
│   ├── style.css         # Design System autoral com 28 variáveis em :root e CSS Grid
│   ├── script.js         # Lógica Vanilla JS pura (11 laços for, switch, LocalStorage)
│   └── img/              # Imagens e fotos dos setups e serviços
├── slides.html           # Deck de 12 slides interativos para a defesa oral
├── AUDIT_TDE_PARTE2.md   # Relatório forense e caderno de apoio para a banca
├── index.html            # Ponto de entrada com redirecionamento automático
└── readme.md             # Documentação do projeto
```
