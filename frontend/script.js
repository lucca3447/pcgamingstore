/**
 * =============================================================================
 * EXTREME GAMER INFORMÁTICA — SISTEMA DE INTERATIVIDADE E ORÇAMENTOS
 * -----------------------------------------------------------------------------
 * Trabalho Discente Efetivo (TDE Parte II) — Programação Front-End
 * Centro Universitário Nobre (UNIFAN) | Prof. Gean Paulo
 * Estudantes: João Lucca Sotero e Kauan Brandão
 * 
 * ESTRUTURAS JAVASCRIPT UTILIZADAS NO PROJETO:
 * - if...else (Validações, regras de desconto Pix e filtros)
 * - switch...case (Cálculo dinâmico de prazos, procedimentos e garantias)
 * - for (Iteração sobre produtos do catálogo e cálculo de itens no carrinho)
 * - function (Funções modulares e reutilizáveis)
 * - DOM / document.getElementById (Manipulação reativa da interface)
 * - localStorage (Persistência do carrinho e preferências do cliente)
 * - Eventos (click, change, submit, DOMContentLoaded)
 * =============================================================================
 */

// =============================================================================
// Módulos: Estado da Aplicação, Filtro do Catálogo e Gerenciador de LocalStorage
// =============================================================================

// Chave utilizada para persistência no navegador
const STORAGE_KEY = 'extreme_gamer_carrinho';

/**
 * 1.1. Gerenciamento do LocalStorage (Carregar e Salvar)
 */
function obterCarrinhoStorage() {
  try {
    const dados = localStorage.getItem(STORAGE_KEY);
    if (dados) {
      return JSON.parse(dados);
    } else {
      return [];
    }
  } catch (erro) {
    console.warn('Dados inválidos no LocalStorage, reinicializando carrinho:', erro);
    return [];
  }
}

function salvarCarrinhoStorage(itens) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(itens));
  atualizarInterfaceCarrinho();
}

/**
 * 1.2. Manipulação de Itens no Carrinho (Adicionar, Remover e Limpar)
 */
function adicionarAoCarrinho(id, nome, preco, imagem) {
  const carrinho = obterCarrinhoStorage();
  
  // Verifica se o item já existe no carrinho para incrementar a quantidade
  let encontrado = false;
  for (let i = 0; i < carrinho.length; i++) {
    if (carrinho[i].id === id) {
      carrinho[i].quantidade += 1;
      encontrado = true;
      break;
    }
  }

  // Se for um item novo, adiciona ao array
  if (!encontrado) {
    carrinho.push({
      id: id,
      nome: nome,
      preco: parseFloat(preco),
      imagem: imagem,
      quantidade: 1
    });
  }

  salvarCarrinhoStorage(carrinho);
  exibirNotificacao(`${nome} adicionado ao orçamento!`);
}

function removerDoCarrinho(id) {
  const carrinho = obterCarrinhoStorage();
  const carrinhoAtualizado = [];

  // Filtra removendo o item selecionado
  for (let i = 0; i < carrinho.length; i++) {
    if (carrinho[i].id !== id) {
      carrinhoAtualizado.push(carrinho[i]);
    }
  }

  salvarCarrinhoStorage(carrinhoAtualizado);
}

function limparCarrinho() {
  if (confirm('Deseja realmente limpar todos os itens do orçamento?')) {
    salvarCarrinhoStorage([]);
    exibirNotificacao('Orçamento limpo com sucesso.');
  }
}

/**
 * 1.3. Renderização Dinâmica do Carrinho no DOM (Uso de for e getElementById)
 */
function atualizarInterfaceCarrinho() {
  const carrinho = obterCarrinhoStorage();
  const listaContainer = document.getElementById('lista-carrinho');
  const badgeHeader = document.getElementById('badge-carrinho');
  const badgeMobile = document.getElementById('badge-carrinho-mobile');
  const totalContainer = document.getElementById('total-carrinho');
  const totalPixContainer = document.getElementById('total-pix');

  let totalGeral = 0;
  let quantidadeTotal = 0;

  // Renderiza a lista de itens caso o container exista
  if (listaContainer) {
    listaContainer.innerHTML = '';

    if (carrinho.length === 0) {
      listaContainer.innerHTML = `
        <div class="carrinho-vazio text-center py-4">
          <i class="bi bi-cart-x fs-1 text-muted"></i>
          <p class="mt-2 text-muted">Nenhuma máquina selecionada ainda.</p>
          <a href="#produtos" class="btn btn-outline-servico btn-sm" onclick="fecharGavetaCarrinho()">Ver Catálogo</a>
        </div>
      `;
    } else {
      // Laço FOR para percorrer e somar os itens salvos
      for (let i = 0; i < carrinho.length; i++) {
        const item = carrinho[i];
        const subtotal = item.preco * item.quantidade;
        totalGeral += subtotal;
        quantidadeTotal += item.quantidade;

        const itemElement = document.createElement('div');
        itemElement.className = 'carrinho-item d-flex align-items-center justify-content-between mb-3';
        itemElement.innerHTML = `
          <div class="d-flex align-items-center gap-2">
            <img src="${item.imagem}" alt="${item.nome}" class="carrinho-item-img">
            <div>
              <h6 class="m-0 text-white">${item.nome}</h6>
              <small class="text-muted">${item.quantidade}x R$ ${item.preco.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</small>
            </div>
          </div>
          <div class="text-end">
            <span class="d-block text-orange fw-bold">R$ ${subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
            <button class="btn btn-link text-danger p-0 btn-remover" data-id="${item.id}" title="Remover item">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        `;
        listaContainer.appendChild(itemElement);
      }
    }
  }

  // Atualiza os contadores no cabeçalho
  if (badgeHeader) badgeHeader.textContent = quantidadeTotal;
  if (badgeMobile) badgeMobile.textContent = quantidadeTotal;

  // Atualiza totais formatados
  if (totalContainer) {
    totalContainer.textContent = `R$ ${totalGeral.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  }
  if (totalPixContainer) {
    const valorComDescontoPix = totalGeral * 0.90; // 10% OFF no Pix
    totalPixContainer.textContent = `R$ ${valorComDescontoPix.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  }
}

/**
 * 1.4. Filtro Interativo de Máquinas por Categoria (Laço for + if..else)
 */
function inicializarFiltrosCatalogo() {
  const containerFiltros = document.getElementById('container-filtros');
  if (!containerFiltros) return;

  const botoes = containerFiltros.getElementsByClassName('btn-filtro');
  const cards = document.querySelectorAll('.cards-grid .produto-card');

  for (let i = 0; i < botoes.length; i++) {
    botoes[i].addEventListener('click', function() {
      // Remove classe ativa de todos e adiciona no clicado
      for (let j = 0; j < botoes.length; j++) {
        botoes[j].classList.remove('active');
      }
      this.classList.add('active');

      const categoriaSelecionada = this.getAttribute('data-categoria');

      // Percorre todos os cards aplicando o filtro
      for (let k = 0; k < cards.length; k++) {
        const card = cards[k];
        const categoriaCard = card.getAttribute('data-categoria');

        if (categoriaSelecionada === 'todos' || categoriaCard === categoriaSelecionada) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      }
    });
  }
}

/**
 * 1.5. Sincronização da Barra de Navegação (Scroll Spy e Menu Mobile)
 * Atualiza dinamicamente a classe .active conforme o usuário rola a página,
 * movimentando a bolinha neon e fechando o menu hamburguer no mobile.
 */
function inicializarScrollSpy() {
  const secoes = document.querySelectorAll('section[id]');
  const linksNav = document.querySelectorAll('.navbar-nav .nav-link');
  const menuCollapse = document.getElementById('navbarNavDropdown');

  function atualizarLinkAtivo() {
    let secaoAtual = '';
    const scrollPos = window.scrollY + 140;

    for (let i = 0; i < secoes.length; i++) {
      const secao = secoes[i];
      const topo = secao.offsetTop;
      const altura = secao.offsetHeight;
      if (scrollPos >= topo && scrollPos < topo + altura) {
        secaoAtual = secao.getAttribute('id');
        break;
      }
    }

    // Se estiver no topo da página
    if (!secaoAtual && window.scrollY < 200) {
      secaoAtual = 'inicio';
    }

    if (secaoAtual) {
      for (let j = 0; j < linksNav.length; j++) {
        const link = linksNav[j];
        if (link.getAttribute('href') === `#${secaoAtual}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    }
  }

  // Evento de scroll com listener passivo
  window.addEventListener('scroll', atualizarLinkAtivo, { passive: true });
  atualizarLinkAtivo();

  // Clique nos links: fecha menu mobile automaticamente se aberto
  for (let k = 0; k < linksNav.length; k++) {
    linksNav[k].addEventListener('click', function() {
      for (let m = 0; m < linksNav.length; m++) {
        linksNav[m].classList.remove('active');
      }
      this.classList.add('active');

      if (menuCollapse && menuCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(menuCollapse) || new bootstrap.Collapse(menuCollapse);
        bsCollapse.hide();
      }
    });
  }
}


// =============================================================================
// Módulos: Simulador de Serviços (switch..case), Condições de Pagamento (if..else)
// e Integração do WhatsApp com os dados do LocalStorage
// =============================================================================

/**
 * 2.1. Simulador Dinâmico de Serviços (Estrutura: switch..case)
 */
function atualizarDetalhesServico(tipoServico) {
  const resumoTitulo = document.getElementById('resumo-titulo-servico');
  const prazoEstimado = document.getElementById('prazo-estimado');
  const garantiaEstimada = document.getElementById('garantia-estimada');
  const procedimentoEstimado = document.getElementById('procedimento-estimado');

  if (!resumoTitulo || !prazoEstimado || !garantiaEstimada || !procedimentoEstimado) return;

  // Avaliação do tipo de serviço pretendido com switch..case
  switch (tipoServico) {
    case 'pc-completo':
      resumoTitulo.textContent = 'Montagem de PC Gamer Completo Sob Medida';
      prazoEstimado.textContent = '2 a 3 dias úteis';
      garantiaEstimada.textContent = '2 Anos (24 Meses) de Garantia Premium';
      procedimentoEstimado.textContent = 'Montagem com cable management cirúrgico e stress test de 24h na bancada';
      break;

    case 'limpeza':
      resumoTitulo.textContent = 'Limpeza Preventiva & Otimização Térmica';
      prazoEstimado.textContent = '24 horas úteis';
      garantiaEstimada.textContent = '90 Dias de Garantia de Bancada';
      procedimentoEstimado.textContent = 'Desoxidação química, limpeza dos fans e aplicação de pasta térmica Arctic MX-4';
      break;

    case 'diagnostico':
      resumoTitulo.textContent = 'Diagnóstico Avançado & Reparo de Placas';
      prazoEstimado.textContent = '24 a 48 horas';
      garantiaEstimada.textContent = '90 Dias sobre o reparo realizado';
      procedimentoEstimado.textContent = 'Análise de tensões em osciloscópio, reparo de VRM, regravação de BIOS e testes';
      break;

    case 'upgrade':
      resumoTitulo.textContent = 'Upgrade de Componentes & Calibração';
      prazoEstimado.textContent = 'Mesmo dia ou 24 horas';
      garantiaEstimada.textContent = 'Garantia do fabricante nas peças + suporte de bancada';
      procedimentoEstimado.textContent = 'Instalação de GPU/RAM/SSD, atualização de drivers e otimização para jogos';
      break;

    default:
      resumoTitulo.textContent = 'Atendimento Personalizado Extreme Gamer';
      prazoEstimado.textContent = 'A combinar com a equipe técnica';
      garantiaEstimada.textContent = 'Conforme orçamento';
      procedimentoEstimado.textContent = 'Avaliação presencial em nosso laboratório em Feira de Santana';
      break;
  }
}

/**
 * 2.2. Cálculo de Condições de Pagamento e Desconto (Estrutura: if..else)
 */
function calcularCondicaoPagamento(formaPagamento) {
  const boxPagamento = document.getElementById('pagamento-estimado');
  if (!boxPagamento) return;

  if (formaPagamento === 'pix') {
    boxPagamento.textContent = '10% de Desconto Especial Aplicado à Vista';
    boxPagamento.className = 'resumo-valor text-success fw-bold';
  } else if (formaPagamento === 'cartao') {
    boxPagamento.textContent = 'Parcelamento em até 12x Sem Juros no Cartão';
    boxPagamento.className = 'resumo-valor text-warning fw-bold';
  } else {
    boxPagamento.textContent = 'Valor integral à vista sob consulta';
    boxPagamento.className = 'resumo-valor text-info';
  }
}

/**
 * 2.3. Envio Dinâmico do Formulário para o WhatsApp com Dados do LocalStorage
 */
function processarEnvioOrcamento(evento) {
  evento.preventDefault();

  const nome = document.getElementById('campo-nome').value.trim();
  const whatsapp = document.getElementById('campo-whatsapp').value.trim();
  const selectServico = document.getElementById('campo-servico');
  const selectOrcamento = document.getElementById('campo-orcamento');
  const selectPagamento = document.getElementById('campo-pagamento');
  const mensagemExtra = document.getElementById('campo-mensagem').value.trim();
  const concordo = document.getElementById('campo-concordo').checked;

  const servicoTexto = (selectServico && selectServico.selectedIndex >= 0)
    ? selectServico.options[selectServico.selectedIndex].text
    : (selectServico ? selectServico.value : '');

  const orcamentoTexto = (selectOrcamento && selectOrcamento.selectedIndex >= 0)
    ? selectOrcamento.options[selectOrcamento.selectedIndex].text
    : (selectOrcamento ? selectOrcamento.value : '');

  const pagamentoTexto = (selectPagamento && selectPagamento.selectedIndex >= 0)
    ? selectPagamento.options[selectPagamento.selectedIndex].text
    : (selectPagamento ? selectPagamento.value : '');

  // Validação simples com if..else
  if (!nome || !whatsapp) {
    alert('Por favor, preencha o seu nome e WhatsApp para contato.');
    return;
  }

  if (!concordo) {
    alert('É necessário concordar com os termos para envio do orçamento.');
    return;
  }

  // Recupera itens do carrinho (LocalStorage) para incluir na mensagem
  const carrinho = obterCarrinhoStorage();
  let resumoItens = '';
  let valorTotalCarrinho = 0;

  if (carrinho.length > 0) {
    resumoItens += '\n\n*Máquinas / Componentes no Orçamento:*';
    for (let i = 0; i < carrinho.length; i++) {
      const item = carrinho[i];
      const sub = item.preco * item.quantidade;
      valorTotalCarrinho += sub;
      resumoItens += `\n• ${item.quantidade}x ${item.nome} — R$ ${sub.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    }
    resumoItens += `\n*Total Estimado:* R$ ${valorTotalCarrinho.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
  }

  // Montagem da mensagem estruturada para o WhatsApp
  let textoWhatsApp = `*SOLICITAÇÃO DE ORÇAMENTO — EXTREME GAMER INFORMÁTICA*`;
  textoWhatsApp += `\n\n*Cliente:* ${nome}`;
  textoWhatsApp += `\n*WhatsApp:* ${whatsapp}`;
  textoWhatsApp += `\n*Serviço Escolhido:* ${servicoTexto}`;
  textoWhatsApp += `\n*Faixa de Investimento:* ${orcamentoTexto}`;
  textoWhatsApp += `\n*Forma de Pagamento:* ${pagamentoTexto}`;
  
  if (resumoItens) {
    textoWhatsApp += resumoItens;
  }

  if (mensagemExtra) {
    textoWhatsApp += `\n\n*Detalhes do Setup / Sintomas:* ${mensagemExtra}`;
  }

  textoWhatsApp += `\n\n_Mensagem enviada através da landing page oficial (UNIFAN TDE II)_`;

  // Codificação da URL oficial do WhatsApp
  const urlFinal = `https://wa.me/message/BE3T4MHQ7EM3F1?text=${encodeURIComponent(textoWhatsApp)}`;
  window.open(urlFinal, '_blank');
}


// =============================================================================
// CONTROLE DE INTERFACE, MODAL/DRAWER E INICIALIZAÇÃO GERAL (EVENTOS)
// =============================================================================

function abrirGavetaCarrinho() {
  const painel = document.getElementById('painel-carrinho');
  if (painel) {
    painel.classList.add('aberto');
    painel.setAttribute('aria-hidden', 'false');
  }
}

function fecharGavetaCarrinho() {
  const painel = document.getElementById('painel-carrinho');
  if (painel) {
    painel.classList.remove('aberto');
    painel.setAttribute('aria-hidden', 'true');
  }
}

function exibirNotificacao(texto) {
  let toast = document.getElementById('toast-notificacao');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast-notificacao';
    toast.className = 'toast-notificacao';
    document.body.appendChild(toast);
  }
  toast.textContent = texto;
  toast.classList.add('visivel');
  setTimeout(() => {
    toast.classList.remove('visivel');
  }, 3200);
}

// Inicialização única disparada quando todo o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializa o estado visual do carrinho salvo no LocalStorage
  atualizarInterfaceCarrinho();

  // 2. Inicializa os filtros do catálogo
  inicializarFiltrosCatalogo();

  // 3. Inicializa a sincronização dinâmica da navbar (Scroll Spy e menu mobile)
  inicializarScrollSpy();

  // 4. Configura eventos dos botões "Adicionar ao Orçamento" nos cards
  document.addEventListener('click', (e) => {
    // Botão Adicionar ao Carrinho
    const btnAdd = e.target.closest('.btn-adicionar-carrinho');
    if (btnAdd) {
      const id = btnAdd.getAttribute('data-id');
      const nome = btnAdd.getAttribute('data-nome');
      const preco = btnAdd.getAttribute('data-preco');
      const imagem = btnAdd.getAttribute('data-img');
      adicionarAoCarrinho(id, nome, preco, imagem);
    }

    // Botão Remover Item
    const btnRemover = e.target.closest('.btn-remover');
    if (btnRemover) {
      const id = btnRemover.getAttribute('data-id');
      removerDoCarrinho(id);
    }

    // Botão de Agendamento Rápido em Serviços
    const btnServico = e.target.closest('[data-selecionar-servico]');
    if (btnServico) {
      const servicoId = btnServico.getAttribute('data-selecionar-servico');
      const selectServico = document.getElementById('campo-servico');
      if (selectServico) {
        selectServico.value = servicoId;
        atualizarDetalhesServico(servicoId);
      }
    }
  });

  // 4. Configura abertura e fechamento da gaveta do carrinho
  const btnAbrir = document.getElementById('btn-carrinho');
  const btnAbrirMobile = document.getElementById('btn-carrinho-mobile');
  const btnFechar = document.getElementById('btn-fechar-carrinho');
  const overlay = document.getElementById('carrinho-overlay');
  const btnLimpar = document.getElementById('btn-limpar-carrinho');

  if (btnAbrir) btnAbrir.addEventListener('click', abrirGavetaCarrinho);
  if (btnAbrirMobile) btnAbrirMobile.addEventListener('click', abrirGavetaCarrinho);
  if (btnFechar) btnFechar.addEventListener('click', fecharGavetaCarrinho);
  if (overlay) overlay.addEventListener('click', fecharGavetaCarrinho);
  if (btnLimpar) btnLimpar.addEventListener('click', limparCarrinho);

  // Acessibilidade: Fecha gaveta com a tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      fecharGavetaCarrinho();
    }
  });

  // 5. Configura eventos dinâmicos no Formulário de Orçamento
  const campoServico = document.getElementById('campo-servico');
  const campoPagamento = document.getElementById('campo-pagamento');
  const formOrcamento = document.getElementById('form-orcamento');

  if (campoServico) {
    campoServico.addEventListener('change', (e) => {
      atualizarDetalhesServico(e.target.value);
    });
    // Executa a primeira vez para exibir o estado inicial
    atualizarDetalhesServico(campoServico.value);
  }

  if (campoPagamento) {
    campoPagamento.addEventListener('change', (e) => {
      calcularCondicaoPagamento(e.target.value);
    });
    // Executa no carregamento
    calcularCondicaoPagamento(campoPagamento.value);
  }

  if (formOrcamento) {
    formOrcamento.addEventListener('submit', processarEnvioOrcamento);
  }
});
