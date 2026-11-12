/**
 * =============================================================================
 * EXTREME GAMER INFORMÁTICA — TDE PARTE II (PROGRAMAÇÃO FRONT-END)
 * Centro Universitário Nobre (UNIFAN) | Prof. Gean Paulo
 * Equipe: João Lucca Sotero e Kauan Brandão
 *
 * LÓGICA DE DUAS OPÇÕES NO FORMULÁRIO + VALIDAÇÃO COMPLETA DE CAMPOS:
 * - Opção 1 ('pre-montado'): Envia os PCs pré-prontos do carrinho.
 * - Opção 2 ('personalizado'): Escolhe faixa de orçamento e descreve o pedido.
 * - O campo "O que você deseja fazer?" (#campo-servico) fica posicionado no topo
 *   do formulário, atualizando prazos e garantias via switch...case a qualquer momento.
 * - Travas de Segurança: Bloqueia letras no telefone, impede números no nome
 *   e limita a quantidade máxima de caracteres em todos os campos.
 * =============================================================================
 */

const CHAVE_STORAGE = 'extreme_gamer_carrinho';
const WHATSAPP_LOJA = '5575999999999';

// Guarda qual opção está ativa no formulário ('pre-montado' ou 'personalizado')
let modoAtualFormulario = 'pre-montado';

/* 1. TRAVAS DE DIGITAÇÃO NOS CAMPOS (NOME, TELEFONE E LIMITE DE TEXTO) */

// Bloqueia letras no WhatsApp e formata como (75) 3221-1234 (10 dígitos) ou (75) 99999-9999 (11 dígitos)
function mascaraTelefone(campo) {
  let apenasNumeros = campo.value.replace(/\D/g, '');

  if (apenasNumeros.length > 11) {
    apenasNumeros = apenasNumeros.slice(0, 11);
  }

  if (apenasNumeros.length > 10) {
    // 11 dígitos: Celular com 9º dígito
    campo.value = '(' + apenasNumeros.slice(0, 2) + ') ' + apenasNumeros.slice(2, 7) + '-' + apenasNumeros.slice(7);
  } else if (apenasNumeros.length > 6) {
    // Até 10 dígitos: Telefone fixo ou número em digitação
    campo.value = '(' + apenasNumeros.slice(0, 2) + ') ' + apenasNumeros.slice(2, 6) + '-' + apenasNumeros.slice(6);
  } else if (apenasNumeros.length > 2) {
    campo.value = '(' + apenasNumeros.slice(0, 2) + ') ' + apenasNumeros.slice(2);
  } else if (apenasNumeros.length > 0) {
    campo.value = '(' + apenasNumeros;
  } else {
    campo.value = '';
  }
}

// Impede que o cliente digite números no campo de Nome e limita a 80 caracteres
function filtrarCampoNome(campo) {
  campo.value = campo.value.replace(/[0-9]/g, '').slice(0, 80);
}

// Atualiza o contador visual de caracteres da descrição (máximo de 500)
function atualizarContadorTexto(campo) {
  if (campo.value.length > 500) {
    campo.value = campo.value.slice(0, 500);
  }
  const contador = document.getElementById('contador-caracteres');
  if (contador) {
    contador.textContent = campo.value.length;
  }
}

/* =============================================================================
   2. LOCALSTORAGE: LER E SALVAR OS PCS PRÉ-PRONTOS DO CARRINHO (COM TRY...CATCH)
   ============================================================================= */
function obterCarrinho() {
  try {
    const dadosSalvos = localStorage.getItem(CHAVE_STORAGE);
    if (!dadosSalvos) {
      return [];
    }
    const lista = JSON.parse(dadosSalvos);
    return Array.isArray(lista) ? lista : [];
  } catch (erro) {
    console.warn('Dados inválidos no LocalStorage, reinicializando carrinho:', erro);
    return [];
  }
}

function salvarCarrinho(listaItens) {
  try {
    localStorage.setItem(CHAVE_STORAGE, JSON.stringify(listaItens));
  } catch (erro) {
    console.error('Falha ao salvar carrinho no LocalStorage:', erro);
  }
  atualizarInterface();
}

/* 3. MANIPULAÇÃO DO CARRINHO */
function adicionarAoCarrinho(id, nome, preco, imagem) {
  const carrinho = obterCarrinho();
  let itemJaExiste = false;

  // Laço FOR para verificar se o PC já está no carrinho (limite de 10 unidades)
  for (let i = 0; i < carrinho.length; i++) {
    if (carrinho[i].id === id) {
      if (carrinho[i].quantidade < 10) {
        carrinho[i].quantidade += 1;
      }
      itemJaExiste = true;
      break;
    }
  }

  if (!itemJaExiste) {
    carrinho.push({
      id: id,
      nome: nome,
      preco: Number(preco),
      imagem: imagem,
      quantidade: 1
    });
  }

  // Sincroniza o modo e o select de serviço antes da renderização em ciclo único
  modoAtualFormulario = 'pre-montado';
  const selectServico = document.getElementById('campo-servico');
  if (selectServico) {
    selectServico.value = 'pc-completo';
  }

  salvarCarrinho(carrinho);
  atualizarVisibilidadeModo();
  mostrarNotificacao(nome + ' adicionado à Opção 1 (PC Pré-Pronto)!');
}

function alterarQuantidade(id, mudanca) {
  const carrinho = obterCarrinho();
  const novoCarrinho = [];

  for (let i = 0; i < carrinho.length; i++) {
    if (carrinho[i].id === id) {
      const novaQtd = carrinho[i].quantidade + mudanca;
      if (novaQtd <= 10) {
        carrinho[i].quantidade = novaQtd;
      }
    }
    if (carrinho[i].quantidade > 0) {
      novoCarrinho.push(carrinho[i]);
    }
  }

  salvarCarrinho(novoCarrinho);
}

function removerDoCarrinho(id) {
  const carrinho = obterCarrinho();
  const novoCarrinho = [];

  for (let i = 0; i < carrinho.length; i++) {
    if (carrinho[i].id !== id) {
      novoCarrinho.push(carrinho[i]);
    }
  }

  salvarCarrinho(novoCarrinho);
}

function limparCarrinho() {
  salvarCarrinho([]);
  mostrarNotificacao('Carrinho de PCs pré-prontos limpo.');
}

/* 4. ALTERNAR ENTRE AS OPÇÕES DE MONTAR PC E VISIBILIDADE DE SERVIÇOS*/
function atualizarVisibilidadeModo() {
  const tipoServico = document.getElementById('campo-servico').value;
  const seletorModo = document.getElementById('seletor-modo-pc');
  const btnPronto = document.getElementById('btn-modo-pronto');
  const btnPersonalizado = document.getElementById('btn-modo-personalizado');
  const blocoModoPronto = document.getElementById('bloco-modo-pronto');
  const grupoOrcamento = document.getElementById('grupo-faixa-orcamento');
  const grupoPagamento = document.getElementById('grupo-pagamento');
  const labelMensagem = document.getElementById('label-mensagem');
  const campoMensagem = document.getElementById('campo-mensagem');
  const btnEnviar = document.getElementById('btn-enviar-form');

  // As opções de Montar PC aparecem SOMENTE se a opção for "Compra / Montagem de PC Gamer Completo"
  if (tipoServico === 'pc-completo') {
    if (seletorModo) seletorModo.style.display = 'block';

    if (modoAtualFormulario === 'pre-montado') {
      btnPronto.classList.add('active');
      btnPersonalizado.classList.remove('active');

      blocoModoPronto.style.display = 'block';
      grupoOrcamento.style.display = 'none';
      if (grupoPagamento) {
        grupoPagamento.classList.add('full-width');
      }

      labelMensagem.textContent = 'Observações Adicionais (Periféricos, Alteração de Gabinete, etc.)';
      campoMensagem.placeholder = 'Opcional: escreva se quiser adicionar monitor, periféricos ou tirar dúvidas sobre o PC escolhido...';
      campoMensagem.required = false;
      btnEnviar.innerHTML = '<i class="bi bi-whatsapp me-2"></i> ENVIAR PEDIDO DO PC PRÉ-PRONTO NO WHATSAPP';
    } else {
      btnPersonalizado.classList.add('active');
      btnPronto.classList.remove('active');

      blocoModoPronto.style.display = 'none';
      grupoOrcamento.style.display = 'flex';
      if (grupoPagamento) {
        grupoPagamento.classList.remove('full-width');
      }

      labelMensagem.textContent = 'Descreva o que você quer no seu PC (Jogos, Peças ou Sintomas) *';
      campoMensagem.placeholder = 'Ex: Quero montar um PC dentro desse orçamento para rodar Warzone e GTA no Ultra, de preferência com Ryzen e gabinete branco...';
      campoMensagem.required = true;
      btnEnviar.innerHTML = '<i class="bi bi-whatsapp me-2"></i> ENVIAR MEU ORÇAMENTO E DESCRIÇÃO NO WHATSAPP';
    }
  } else {
    // Serviços Técnicos (Upgrade, Limpeza, Diagnóstico): oculta blocos exclusivos de Montar PC
    if (seletorModo) seletorModo.style.display = 'none';
    blocoModoPronto.style.display = 'none';
    grupoOrcamento.style.display = 'none';
    if (grupoPagamento) {
      grupoPagamento.classList.add('full-width');
    }

    labelMensagem.textContent = 'Descreva os Detalhes do Serviço ou Sintomas do Aparelho *';
    campoMensagem.placeholder = 'Ex: PC desligando sozinho após 10 minutos de jogo, ou quero trocar para pasta térmica Arctic MX-4...';
    campoMensagem.required = true;
    btnEnviar.innerHTML = '<i class="bi bi-whatsapp me-2"></i> SOLICITAR ATENDIMENTO NO WHATSAPP';
  }

  atualizarPainelResumo();
}

function alternarModoFormulario(modoEscolhido) {
  modoAtualFormulario = modoEscolhido;
  const selectServico = document.getElementById('campo-servico');
  if (selectServico) {
    selectServico.value = 'pc-completo';
  }
  atualizarVisibilidadeModo();
}

/* =============================================================================
   5. RENDERIZAÇÃO DO CARRINHO (GAVETA + OPÇÃO 1 DO FORMULÁRIO) COM FOR
   ============================================================================= */
function atualizarInterface() {
  const carrinho = obterCarrinho();

  const listaGaveta = document.getElementById('lista-carrinho');
  const badgeTopo = document.getElementById('badge-carrinho');
  const badgeMobile = document.getElementById('badge-carrinho-mobile');
  const totalGaveta = document.getElementById('total-carrinho');
  const totalPixGaveta = document.getElementById('total-pix');
  const listaForm = document.getElementById('lista-carrinho-form');
  const qtdItensForm = document.getElementById('qtd-itens-form');

  let somaTotal = 0;
  let quantidadeTotal = 0;

  listaGaveta.innerHTML = '';
  listaForm.innerHTML = '';

  if (carrinho.length === 0) {
    listaGaveta.innerHTML = '<p class="text-muted text-center py-4">Nenhum PC pré-pronto selecionado.</p>';
    listaForm.innerHTML = `
      <div class="d-flex flex-wrap align-items-center justify-content-between gap-2 py-2">
        <span class="text-muted small">Você ainda não escolheu um PC pré-pronto no catálogo acima.</span>
        <div class="d-flex gap-2">
          <a href="#produtos" class="btn btn-sm btn-outline-servico py-1 px-3">Escolher PC no Catálogo</a>
          <button type="button" class="btn btn-sm btn-secundario py-1 px-3" onclick="alternarModoFormulario('personalizado')">Ou Montar pelo Meu Orçamento</button>
        </div>
      </div>
    `;
  } else {
    for (let i = 0; i < carrinho.length; i++) {
      const item = carrinho[i];
      const subtotal = item.preco * item.quantidade;
      somaTotal += subtotal;
      quantidadeTotal += item.quantidade;

      const precoFormatado = subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 });

      // Renderiza na Gaveta Lateral
      listaGaveta.innerHTML += `
        <div class="carrinho-item d-flex align-items-center justify-content-between mb-3">
          <div class="d-flex align-items-center gap-2">
            <img src="${item.imagem}" alt="${item.nome}" class="carrinho-item-img">
            <div>
              <h6 class="m-0 text-white">${item.nome}</h6>
              <div class="d-flex align-items-center gap-1 mt-1">
                <button type="button" class="btn-qtd" onclick="alterarQuantidade('${item.id}', -1)">-</button>
                <span class="px-2 small">${item.quantidade}x</span>
                <button type="button" class="btn-qtd" onclick="alterarQuantidade('${item.id}', 1)">+</button>
              </div>
            </div>
          </div>
          <div class="text-end">
            <span class="d-block text-orange fw-bold">R$ ${precoFormatado}</span>
            <button type="button" class="btn btn-link text-danger p-0 small" onclick="removerDoCarrinho('${item.id}')">Remover</button>
          </div>
        </div>
      `;

      // Renderiza na Opção 1 dentro do Formulário
      listaForm.innerHTML += `
        <div class="item-form-card">
          <div class="d-flex align-items-center gap-2">
            <img src="${item.imagem}" alt="${item.nome}" class="carrinho-item-img">
            <div>
              <strong class="text-white d-block">${item.nome}</strong>
              <span class="text-muted small">Quantidade: ${item.quantidade} unidade(s)</span>
            </div>
          </div>
          <div class="d-flex align-items-center gap-3">
            <div class="d-flex align-items-center gap-1">
              <button type="button" class="btn-qtd" onclick="alterarQuantidade('${item.id}', -1)">-</button>
              <button type="button" class="btn-qtd" onclick="alterarQuantidade('${item.id}', 1)">+</button>
            </div>
            <strong class="text-orange">R$ ${precoFormatado}</strong>
            <button type="button" class="btn btn-sm btn-outline-danger py-0 px-2" onclick="removerDoCarrinho('${item.id}')">&times;</button>
          </div>
        </div>
      `;
    }
  }

  badgeTopo.textContent = quantidadeTotal;
  badgeMobile.textContent = quantidadeTotal;
  qtdItensForm.textContent = quantidadeTotal;

  totalGaveta.textContent = 'R$ ' + somaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  totalPixGaveta.textContent = 'R$ ' + (somaTotal * 0.90).toLocaleString('pt-BR', { minimumFractionDigits: 2 });

  atualizarPainelResumo();
}

/* 6. PAINEL REATIVO DO FORMULÁRIO (SWITCH...CASE + IF...ELSE)*/
function atualizarPainelResumo() {
  const tipoServico = document.getElementById('campo-servico').value;
  const resumoTitulo = document.getElementById('resumo-titulo-servico');
  const prazoEstimado = document.getElementById('prazo-estimado');
  const garantiaEstimada = document.getElementById('garantia-estimada');
  const procedimentoEstimado = document.getElementById('procedimento-estimado');
  const boxPagamento = document.getElementById('pagamento-estimado');
  const formaPagamento = document.getElementById('campo-pagamento').value;

  // 1) Estrutura SWITCH...CASE obrigatória do TDE avaliando "O que você deseja fazer?"
  switch (tipoServico) {
    case 'pc-completo':
      resumoTitulo.textContent = 'Compra / Montagem de PC Gamer Completo';
      prazoEstimado.textContent = '1 a 3 dias úteis';
      garantiaEstimada.textContent = '2 Anos (24 Meses) de Garantia Premium';
      procedimentoEstimado.textContent = 'Montagem com cable management cirúrgico, BIOS atualizada e stress test de 24h.';
      break;

    case 'upgrade':
      resumoTitulo.textContent = 'Upgrade de Componentes & Calibração';
      prazoEstimado.textContent = 'Mesmo dia ou 24 horas';
      garantiaEstimada.textContent = 'Garantia oficial das peças + suporte técnico';
      procedimentoEstimado.textContent = 'Instalação de placa de vídeo, SSD, fonte ou memória com organização de cabos.';
      break;

    case 'limpeza':
      resumoTitulo.textContent = 'Limpeza Preventiva & Troca de Pasta Térmica';
      prazoEstimado.textContent = '24 horas úteis';
      garantiaEstimada.textContent = '90 Dias de Garantia de Bancada';
      procedimentoEstimado.textContent = 'Desmontagem completa, higienização e aplicação de pasta Arctic MX-4.';
      break;

    default:
      resumoTitulo.textContent = 'Diagnóstico Técnico & Reparo Especializado';
      prazoEstimado.textContent = '24 a 48 horas';
      garantiaEstimada.textContent = '90 Dias sobre o reparo realizado';
      procedimentoEstimado.textContent = 'Diagnóstico preciso na bancada para PCs, notebooks e videogames.';
      break;
  }

  // 2) Calcula a condição de pagamento (apenas se for compra de PC completo na Opção 1)
  let somaCarrinho = 0;
  const deveExibirPrecoCarrinho = (tipoServico === 'pc-completo' && modoAtualFormulario === 'pre-montado');

  if (deveExibirPrecoCarrinho) {
    const carrinho = obterCarrinho();
    for (let i = 0; i < carrinho.length; i++) {
      somaCarrinho += carrinho[i].preco * carrinho[i].quantidade;
    }
  }

  const exibirValoresCalculados = deveExibirPrecoCarrinho && (somaCarrinho > 0);

  if (formaPagamento === 'pix') {
    if (exibirValoresCalculados) {
      const valorPix = somaCarrinho * 0.90;
      boxPagamento.textContent = 'R$ ' + valorPix.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + ' no Pix (10% OFF)';
    } else {
      boxPagamento.textContent = '10% de Desconto Especial à Vista no Pix';
    }
    boxPagamento.className = 'resumo-dado text-success fw-bold';
  } else if (formaPagamento === 'cartao') {
    if (exibirValoresCalculados) {
      const parcela = somaCarrinho / 12;
      boxPagamento.textContent = '12x de R$ ' + parcela.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + ' sem juros';
    } else {
      boxPagamento.textContent = 'Parcelamento em até 12x Sem Juros no Cartão';
    }
    boxPagamento.className = 'resumo-dado text-warning fw-bold';
  } else {
    if (exibirValoresCalculados) {
      boxPagamento.textContent = 'R$ ' + somaCarrinho.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + ' no Boleto';
    } else {
      boxPagamento.textContent = 'Valor à vista no Boleto Bancário';
    }
    boxPagamento.className = 'resumo-dado text-info fw-bold';
  }
}

/* 7. FILTRO DO CATÁLOGO E ATALHOS DE SERVIÇOS (FOR + IF...ELSE)*/
function filtrarCatalogo(categoriaEscolhida, botaoClicado) {
  const botoes = document.getElementsByClassName('btn-filtro');
  const cards = document.getElementsByClassName('produto-card');

  for (let i = 0; i < botoes.length; i++) {
    botoes[i].classList.remove('active');
  }
  botaoClicado.classList.add('active');

  for (let i = 0; i < cards.length; i++) {
    const categoriaCard = cards[i].getAttribute('data-categoria');
    if (categoriaEscolhida === 'todos' || categoriaCard === categoriaEscolhida) {
      cards[i].style.display = 'flex';
    } else {
      cards[i].style.display = 'none';
    }
  }
}

function selecionarServicoRapido(servicoId) {
  document.getElementById('campo-servico').value = servicoId;
  atualizarVisibilidadeModo();
}

/* 8. VALIDAÇÃO RIGOROSA E ENVIO PARA O WHATSAPP (IF...ELSE)*/
function enviarOrcamentoWhatsApp(evento) {
  evento.preventDefault();

  const nome = document.getElementById('campo-nome').value.trim();
  const whatsapp = document.getElementById('campo-whatsapp').value.trim();
  const whatsappApenasNumeros = whatsapp.replace(/\D/g, '');
  const selectServico = document.getElementById('campo-servico');
  const servicoTexto = selectServico.options[selectServico.selectedIndex].text;
  const selectPagamento = document.getElementById('campo-pagamento');
  const pagamentoTexto = selectPagamento.options[selectPagamento.selectedIndex].text;
  const descricao = document.getElementById('campo-mensagem').value.trim();
  const concordo = document.getElementById('campo-concordo').checked;

  // 1) Validação do Nome (mínimo 3 letras, máximo 80, sem números)
  if (nome.length < 3 || nome.length > 80) {
    mostrarNotificacao('Por favor, informe um nome válido (entre 3 e 80 caracteres).');
    document.getElementById('campo-nome').focus();
    return;
  }

  // 2) Validação do WhatsApp (exige 10 ou 11 dígitos numéricos com DDD)
  if (whatsappApenasNumeros.length < 10 || whatsappApenasNumeros.length > 11) {
    mostrarNotificacao('Por favor, digite um WhatsApp válido com DDD (ex: (75) 99999-9999).');
    document.getElementById('campo-whatsapp').focus();
    return;
  }

  // 3) Validação de limite da descrição (máximo 500 caracteres)
  if (descricao.length > 500) {
    mostrarNotificacao('A mensagem excedeu o limite máximo de 500 caracteres.');
    document.getElementById('campo-mensagem').focus();
    return;
  }

  // 4) Validação do termo de concordância
  if (!concordo) {
    mostrarNotificacao('Confirme a caixa de concordância para enviar.');
    document.getElementById('campo-concordo').focus();
    return;
  }

  let texto = '*ATENDIMENTO — EXTREME GAMER INFORMÁTICA*\n\n';
  texto += '*Cliente:* ' + nome + '\n';
  texto += '*WhatsApp:* ' + whatsapp + '\n';
  texto += '*O que deseja fazer:* ' + servicoTexto + '\n';

  // IF...ELSE: Monta a mensagem conforme o que foi selecionado
  if (selectServico.value !== 'pc-completo') {
    // Serviços Técnicos (Upgrade, Limpeza, Diagnóstico)
    if (descricao.length < 5) {
      mostrarNotificacao('Por favor, descreva no campo de mensagem o serviço ou sintomas (mínimo 5 caracteres).');
      document.getElementById('campo-mensagem').focus();
      return;
    }

    texto += '*Modalidade:* Solicitação de Serviço / Manutenção Técnica\n';
    texto += '*Forma de Pagamento:* ' + pagamentoTexto + '\n';
    texto += '\n*Detalhes do Serviço / Sintomas:*\n' + descricao + '\n';
  } else if (modoAtualFormulario === 'pre-montado') {
    const carrinho = obterCarrinho();

    if (carrinho.length === 0) {
      mostrarNotificacao('Adicione pelo menos um PC Pré-Pronto no catálogo ou mude para a Opção 2!');
      return;
    }

    let somaTotal = 0;
    texto += '*Modalidade:* Opção 1 — PC Pré-Pronto do Catálogo\n';
    texto += '\n*Máquinas Escolhidas:*\n';

    for (let i = 0; i < carrinho.length; i++) {
      const item = carrinho[i];
      const subtotal = item.preco * item.quantidade;
      somaTotal += subtotal;
      texto += '• ' + item.quantidade + 'x ' + item.nome + ' — R$ ' + subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '\n';
    }

    texto += '\n*Total dos PCs:* R$ ' + somaTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '\n';
    if (selectPagamento.value === 'pix') {
      const valorPix = somaTotal * 0.90;
      texto += '*Valor com 10% OFF no Pix:* R$ ' + valorPix.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) + '\n';
    }
    texto += '*Forma de Pagamento:* ' + pagamentoTexto + '\n';

    if (descricao !== '') {
      texto += '\n*Observações:* ' + descricao + '\n';
    }
  } else {
    // Opção 2 de Montar PC: Exige que o cliente escreva pelo menos 5 caracteres descrevendo o pedido
    if (descricao.length < 5) {
      mostrarNotificacao('Por favor, descreva no campo de mensagem o que deseja no seu PC (mínimo 5 caracteres).');
      document.getElementById('campo-mensagem').focus();
      return;
    }

    const selectOrcamento = document.getElementById('campo-orcamento');
    const orcamentoTexto = selectOrcamento.options[selectOrcamento.selectedIndex].text;

    texto += '*Modalidade:* Opção 2 — Montagem por Orçamento / Sob Medida\n';
    texto += '*Orçamento Disponível:* ' + orcamentoTexto + '\n';
    texto += '*Forma de Pagamento:* ' + pagamentoTexto + '\n';
    texto += '\n*O que o cliente deseja montar / Descrição:*\n' + descricao + '\n';
  }

  const urlWhatsApp = 'https://api.whatsapp.com/send?phone=' + WHATSAPP_LOJA + '&text=' + encodeURIComponent(texto);
  window.open(urlWhatsApp, '_blank');
}

/* =============================================================================
   9. CONTROLE DA GAVETA LATERAL E INICIALIZAÇÃO DE EVENTOS
   ============================================================================= */
function abrirGavetaCarrinho() {
  const gaveta = document.getElementById('painel-carrinho');
  if (gaveta) {
    gaveta.classList.add('aberto');
    gaveta.setAttribute('aria-hidden', 'false');
  }
}

function fecharGavetaCarrinho() {
  const gaveta = document.getElementById('painel-carrinho');
  if (gaveta) {
    gaveta.classList.remove('aberto');
    gaveta.setAttribute('aria-hidden', 'true');
  }
}

let timerNotificacao;
function mostrarNotificacao(mensagem) {
  const toast = document.getElementById('toast-notificacao');
  if (!toast) return;
  toast.textContent = mensagem;
  toast.classList.add('visivel');
  clearTimeout(timerNotificacao);
  timerNotificacao = setTimeout(function() {
    toast.classList.remove('visivel');
  }, 3500);
}

document.addEventListener('DOMContentLoaded', function() {
  atualizarInterface();
  alternarModoFormulario('pre-montado');

  // Eventos da Gaveta Lateral
  document.getElementById('btn-carrinho').addEventListener('click', abrirGavetaCarrinho);
  document.getElementById('btn-carrinho-mobile').addEventListener('click', abrirGavetaCarrinho);
  document.getElementById('btn-fechar-carrinho').addEventListener('click', fecharGavetaCarrinho);
  document.getElementById('carrinho-overlay').addEventListener('click', fecharGavetaCarrinho);
  document.getElementById('btn-limpar-carrinho').addEventListener('click', limparCarrinho);
  document.getElementById('btn-finalizar-orcamento').addEventListener('click', function() {
    fecharGavetaCarrinho();
    alternarModoFormulario('pre-montado');
  });

  // Fechamento da gaveta com a tecla Escape
  document.addEventListener('keydown', function(evento) {
    if (evento.key === 'Escape') {
      fecharGavetaCarrinho();
    }
  });

  // Eventos dos Selects do Formulário
  document.getElementById('campo-servico').addEventListener('change', atualizarVisibilidadeModo);
  document.getElementById('campo-pagamento').addEventListener('change', atualizarPainelResumo);
  document.getElementById('form-orcamento').addEventListener('submit', enviarOrcamentoWhatsApp);
});