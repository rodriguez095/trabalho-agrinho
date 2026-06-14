function toggleDarkMode() {
  const body = document.body;
  const button = document.getElementById('darkModeToggle');
  body.classList.toggle('dark-mode');

  if (body.classList.contains('dark-mode')) {
    button.textContent = 'Desativar modo escuro';
  } else {
    button.textContent = 'Ativar modo escuro';
  }
}

function acaoBase() {
  const saida = document.getElementById('saida');
  if (saida) {
    saida.textContent = 'Botão clicado!';
  }
}

function openSidebar() {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebarOverlay').classList.add('open');
}

function closeSidebar() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
}

const fazendaState = {
  coins: 12,
  selectedSeed: null,
  // modo: 'plantar' ou 'colher'
  modo: 'plantar',
  message: 'Compre sementes na loja e plante nos canteiros da fazenda 3x3.',
  inventory: {
    milho: 0,
    cenoura: 0,
    tomate: 0,
  },
  // cada plot: null | { seedKey, pronto: false } | { seedKey, pronto: true }
  plots: Array(9).fill(null),
  harvestQueue: [], // fila de plots prontos para colher
};

const sementesDaLoja = {
  milho: {
    label: 'Milho',
    emoji: '🌽',
    price: 3,
    sellPrice: 7,
    bgImage: 'https://images.unsplash.com/photo-1601593768799-76d3a7c08b06?w=200&q=80',
    bgColor: 'rgba(180, 140, 0, 0.65)',
    growTime: 8000, // ms até ficar pronto
  },
  cenoura: {
    label: 'Cenoura',
    emoji: '🥕',
    price: 4,
    sellPrice: 9,
    bgImage: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?w=200&q=80',
    bgColor: 'rgba(180, 70, 0, 0.65)',
    growTime: 12000,
  },
  tomate: {
    label: 'Tomate',
    emoji: '🍅',
    price: 5,
    sellPrice: 12,
    bgImage: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=200&q=80',
    bgColor: 'rgba(160, 20, 10, 0.65)',
    growTime: 16000,
  },
};

// Timers de crescimento por plot
const growTimers = {};

const conteudosDasSecoes = {
  introducao: `
    <p>Somos alunos do Colégio Estadual Wolff Klabin, e estamos apresentando este site para o projeto Agrinho 2026.</p>
    <p>Nosso objetivo é explorar a relação entre o campo, a cidade e as inovações tecnológicas, além de discutir a importância da sustentabilidade. E o que é o Agrinho? O Agrinho é um programa educacional que visa promover a conscientização sobre a agricultura, o meio ambiente e a cidadania entre os jovens. Ele incentiva os estudantes a se envolverem com temas relacionados ao campo, à cidade e à tecnologia, promovendo uma compreensão mais profunda das questões agrícolas e ambientais. Através de atividades interativas, jogos e projetos, o Agrinho busca inspirar os jovens a se tornarem agentes de mudança em suas comunidades, promovendo práticas sustentáveis e valorizando a importância do campo para a sociedade.</p>
    <p>Este site é uma forma de compartilhar informações sobre o campo e a cidade, as inovações tecnológicas e a sustentabilidade, além de oferecer uma experiência interativa para os visitantes. Esperamos que este conteúdo seja útil e inspirador para todos que acessarem o site, promovendo uma reflexão sobre a importância do campo e da cidade, e incentivando ações positivas em prol do meio ambiente e da sociedade.</p>
    <p>Agradecemos a todos que visitarem nosso site e esperamos que aproveitem o conteúdo e a experiência interativa que preparamos com muito carinho. Juntos, podemos aprender mais sobre o campo, a cidade, as inovações tecnológicas e a sustentabilidade, e contribuir para um futuro melhor para todos!</p>
    <p>IA's utilizadas: ChatGPT (informações e textos), Claude (revisão, sugestões e melhorias) e Copilot (ajuda na estruturação do código e organização do projeto).</p>
  `,
  campo: `
    <p>O campo é essencial para a produção de alimentos, geração de emprego e equilíbrio entre desenvolvimento e natureza. Ele desempenha um papel essencial para o funcionamento das cidades e para a vida da população. É nas áreas rurais que são produzidos alimentos, matérias-primas e diversos recursos importantes para a economia. A agricultura abastece mercados, escolas e indústrias, garantindo comida na mesa das pessoas todos os dias. Além disso, a produção rural gera empregos, movimenta o comércio e contribui para o desenvolvimento do país. O campo também fornece produtos utilizados na fabricação de roupas, combustíveis e medicamentos. A relação entre campo e cidade é de dependência, pois um precisa do outro para crescer de forma equilibrada. Por isso, investir em tecnologias agrícolas, preservação ambiental e valorização dos produtores rurais é fundamental para assegurar um futuro sustentável e uma sociedade mais desenvolvida, com qualidade de vida e segurança alimentar.</p>
  `,
  cidade: `
    <p>A relação entre o campo e a cidade é fundamental para o funcionamento da sociedade. O campo é responsável pela produção de alimentos, matérias-primas e recursos naturais que abastecem as cidades diariamente. Produtos como frutas, verduras, leite, carne e grãos chegam aos mercados urbanos graças ao trabalho dos produtores rurais. Em troca, a cidade fornece ao campo tecnologias, máquinas, medicamentos, serviços e oportunidades comerciais. Essa troca cria uma relação de interdependência, na qual ambos dependem um do outro para se desenvolver. Além disso, o comércio entre áreas urbanas e rurais movimenta a economia e gera empregos para milhões de pessoas. A modernização da agricultura também fortaleceu essa conexão, facilitando o transporte e aumentando a produtividade. Portanto, campo e cidade devem trabalhar juntos para garantir desenvolvimento, sustentabilidade, qualidade de vida e segurança alimentar para toda a população.</p>
  `,
  tecnologia: `
    <p>A inovação digital na agricultura tem transformado a maneira como os produtores trabalham no campo. Com o uso de tecnologias modernas, como drones, sensores, aplicativos e máquinas automatizadas, é possível aumentar a produtividade e reduzir desperdícios.</p>
    <p>A agricultura digital permite monitorar o solo, o clima e as plantações em tempo real, ajudando os agricultores a tomar decisões mais rápidas e eficientes. Além disso, o uso da internet e de softwares facilita o controle da produção, dos custos e da venda dos produtos.</p>
    <p>Essas inovações também contribuem para a preservação ambiental, pois permitem o uso mais consciente de água, fertilizantes e defensivos agrícolas. Outro benefício importante é a melhoria da qualidade dos alimentos produzidos. Dessa forma, a tecnologia digital fortalece a agricultura, tornando o trabalho no campo mais moderno, sustentável e preparado para atender às necessidades da população.</p>
  `,
  sustentabilidade: `
    <p>A sustentabilidade é um princípio fundamental para garantir a preservação da vida no planeta e o bem-estar das futuras gerações. Ela consiste em utilizar os recursos naturais de forma equilibrada e responsável, evitando desperdícios e reduzindo os impactos causados pelas ações humanas no meio ambiente.<p>
    <p>A preservação ambiental está diretamente ligada à proteção das florestas, rios, animais e da biodiversidade, elementos essenciais para o equilíbrio da natureza e para a qualidade de vida da população.<p>
    <p>O uso consciente dos recursos naturais envolve atitudes simples, mas muito importantes, como economizar água e energia, reciclar resíduos, reduzir a poluição e evitar o desmatamento excessivo. Além disso, a adoção de tecnologias sustentáveis na indústria, na agricultura e nas cidades contribui para diminuir os danos ambientais e promover um desenvolvimento mais equilibrado.<p>
    <p>A conscientização da sociedade também possui um papel essencial nesse processo, pois pequenas ações individuais podem gerar grandes resultados coletivos. Quando as pessoas compreendem a importância de cuidar do meio ambiente, tornam-se mais responsáveis em suas escolhas e hábitos diários. Dessa forma, a sustentabilidade ajuda a construir um futuro mais saudável, seguro e equilibrado para toda a humanidade e para o planeta.</p>
  `,
};

function renderInteratividadeGame() {
  const interatividadeSection = document.getElementById('interatividade');
  const sectionContent = interatividadeSection ? interatividadeSection.querySelector('.section-content') : null;

  if (!sectionContent) {
    return;
  }

  renderFarmGrid();
  atualizarFazendaUI();
}

function renderFarmGrid() {
  const farmGrid = document.getElementById('farmGrid');

  if (!farmGrid) {
    return;
  }

  farmGrid.innerHTML = fazendaState.plots
    .map((plot, index) => {
      // Canteiro vazio — imagem de terra
      if (!plot) {
        return `
          <button class="farm-plot empty" data-index="${index}" type="button"
            style="background-image: url('terra.jpeg'); background-size: cover; background-position: center;">
            <span class="plot-overlay" style="background: rgba(60,30,10,0.28);"></span>
            <span class="plot-emoji">🌱</span>
            <span class="plot-label">Vazio</span>
          </button>
        `;
      }

      const seed = sementesDaLoja[plot.seedKey];
      const bgStyle = `background-image: url('${seed.bgImage}'); background-size: cover; background-position: center;`;

      if (plot.pronto) {
        // Pronto para colher — pisca com brilho
        return `
          <button class="farm-plot planted ready" data-index="${index}" type="button"
            style="${bgStyle}">
            <span class="plot-overlay" style="background:${seed.bgColor};"></span>
            <span class="plot-emoji ready-pulse">${seed.emoji}</span>
            <span class="plot-label">Colher!</span>
          </button>
        `;
      }

      // Crescendo
      return `
        <button class="farm-plot planted growing" data-index="${index}" type="button"
          style="${bgStyle}">
          <span class="plot-overlay" style="background:${seed.bgColor};"></span>
          <span class="plot-emoji">🌿</span>
          <span class="plot-label">${seed.label}</span>
        </button>
      `;
    })
    .join('');
}

function atualizarFazendaUI() {
  const coinCount = document.getElementById('coinCount');
  const farmMessage = document.getElementById('farmMessage');
  const inventoryInfo = document.getElementById('inventoryInfo');

  if (coinCount) {
    coinCount.textContent = `🪙 ${fazendaState.coins} moedas`;
  }

  if (farmMessage) {
    farmMessage.textContent = fazendaState.message;
  }

  if (inventoryInfo) {
    const inv = fazendaState.inventory;
    inventoryInfo.textContent = `Inventário: 🌽 ${inv.milho} | 🥕 ${inv.cenoura} | 🍅 ${inv.tomate}`;
  }

  // Botões de semente
  document.querySelectorAll('.seed-buy-btn').forEach((button) => {
    const seedKey = button.dataset.seed;
    button.classList.toggle('selected', fazendaState.selectedSeed === seedKey && fazendaState.modo === 'plantar');
  });

  // Botão de colheita
  const harvestBtn = document.getElementById('harvestModeBtn');
  if (harvestBtn) {
    const temPronto = fazendaState.plots.some(p => p && p.pronto);
    harvestBtn.classList.toggle('active', fazendaState.modo === 'colher');
    harvestBtn.disabled = !temPronto && fazendaState.modo !== 'colher';
  }

  // Botão de vender tudo
  const sellBtn = document.getElementById('sellAllBtn');
  if (sellBtn) {
    const temNada = Object.values(fazendaState.inventory).every(v => v === 0);
    sellBtn.disabled = temNada;
  }

  const section = document.getElementById('interatividade');
  if (section && section.classList.contains('expanded')) {
    ajustarAlturaConteudo(section, true);
  }
}

function comprarSemente(seedKey) {
  const seed = sementesDaLoja[seedKey];

  if (!seed) return;

  if (fazendaState.coins < seed.price) {
    fazendaState.message = `Você precisa de mais moedas para comprar ${seed.label}.`;
    atualizarFazendaUI();
    return;
  }

  fazendaState.coins -= seed.price;
  fazendaState.inventory[seedKey] += 1;
  fazendaState.selectedSeed = seedKey;
  fazendaState.modo = 'plantar';
  fazendaState.message = `Você comprou 1 semente de ${seed.label} (venda por ${seed.sellPrice} 🪙). Clique em um canteiro vazio para plantar.`;
  renderFarmGrid();
  atualizarFazendaUI();
}

function plantarSemente(plotIndex) {
  if (fazendaState.modo === 'colher') {
    colherCanteiro(plotIndex);
    return;
  }

  if (!fazendaState.selectedSeed) {
    fazendaState.message = 'Selecione uma semente na loja antes de plantar.';
    atualizarFazendaUI();
    return;
  }

  if (fazendaState.plots[plotIndex] !== null) {
    fazendaState.message = 'Este canteiro já está ocupado!';
    atualizarFazendaUI();
    return;
  }

  if (fazendaState.inventory[fazendaState.selectedSeed] <= 0) {
    fazendaState.message = 'Você ficou sem sementes. Compre mais na loja.';
    atualizarFazendaUI();
    return;
  }

  const seedKey = fazendaState.selectedSeed;
  const seed = sementesDaLoja[seedKey];

  fazendaState.inventory[seedKey] -= 1;
  fazendaState.plots[plotIndex] = { seedKey, pronto: false };
  fazendaState.message = `${seed.label} plantado no canteiro ${plotIndex + 1}. Aguarde crescer...`;

  // Timer de crescimento
  if (growTimers[plotIndex]) clearTimeout(growTimers[plotIndex]);
  growTimers[plotIndex] = setTimeout(() => {
    if (fazendaState.plots[plotIndex] && fazendaState.plots[plotIndex].seedKey === seedKey) {
      fazendaState.plots[plotIndex].pronto = true;
      fazendaState.message = `${seed.emoji} ${seed.label} no canteiro ${plotIndex + 1} está pronto para colher!`;
      renderFarmGrid();
      atualizarFazendaUI();
    }
  }, seed.growTime);

  renderFarmGrid();
  atualizarFazendaUI();
}

function colherCanteiro(plotIndex) {
  const plot = fazendaState.plots[plotIndex];

  if (!plot) {
    fazendaState.message = 'Este canteiro está vazio.';
    atualizarFazendaUI();
    return;
  }

  if (!plot.pronto) {
    fazendaState.message = 'Esta planta ainda não está pronta para colher. Aguarde!';
    atualizarFazendaUI();
    return;
  }

  const seed = sementesDaLoja[plot.seedKey];
  fazendaState.inventory[plot.seedKey] += 1;
  fazendaState.plots[plotIndex] = null;
  fazendaState.message = `${seed.emoji} ${seed.label} colhido! Agora venda na loja para ganhar ${seed.sellPrice} 🪙.`;

  if (growTimers[plotIndex]) {
    clearTimeout(growTimers[plotIndex]);
    delete growTimers[plotIndex];
  }

  renderFarmGrid();
  atualizarFazendaUI();
}

function venderTudo() {
  let totalGanho = 0;
  let resumo = [];

  Object.entries(fazendaState.inventory).forEach(([seedKey, qtd]) => {
    if (qtd > 0) {
      const seed = sementesDaLoja[seedKey];
      const ganho = seed.sellPrice * qtd;
      totalGanho += ganho;
      resumo.push(`${seed.emoji} ${qtd}x ${seed.label} = ${ganho} 🪙`);
      fazendaState.inventory[seedKey] = 0;
    }
  });

  if (totalGanho === 0) {
    fazendaState.message = 'Você não tem nada para vender. Colha suas plantações primeiro!';
  } else {
    fazendaState.coins += totalGanho;
    fazendaState.message = `Vendido! ${resumo.join(' | ')} → Total: +${totalGanho} 🪙`;
  }

  fazendaState.selectedSeed = null;
  fazendaState.modo = 'plantar';
  renderFarmGrid();
  atualizarFazendaUI();
}

function alternarModoColheita() {
  if (fazendaState.modo === 'colher') {
    fazendaState.modo = 'plantar';
    fazendaState.message = 'Modo plantio ativado. Compre uma semente e clique no canteiro.';
  } else {
    fazendaState.modo = 'colher';
    fazendaState.selectedSeed = null;
    fazendaState.message = 'Modo colheita ativado. Clique nos canteiros prontos (✨) para colher.';
  }
  renderFarmGrid();
  atualizarFazendaUI();
}

function preencherConteudosDasSecoes() {
  Object.entries(conteudosDasSecoes).forEach(([sectionId, html]) => {
    const section = document.getElementById(sectionId);
    const content = section ? section.querySelector('.section-content') : null;

    if (content) {
      content.innerHTML = html;
    }
  });

  renderInteratividadeGame();
}

function ajustarAlturaConteudo(section, expandir) {
  const contentBlocks = section.querySelectorAll('.section-content');

  contentBlocks.forEach((content) => {
    if (expandir) {
      content.style.maxHeight = `${content.scrollHeight}px`;
    } else {
      content.style.maxHeight = '0px';
    }
  });
}

function ajustarTituloSecao(section, expandir) {
  const title = section.querySelector('h2');

  if (!title) {
    return;
  }

  if (expandir) {
    title.style.opacity = '1';
    title.style.transform = 'translateY(0)';
  } else {
    title.style.opacity = '';
    title.style.transform = '';
  }
}

function abrirSecao(sectionId) {
  const section = document.getElementById(sectionId);

  section.classList.add('expanded');
  ajustarAlturaConteudo(section, true);
  ajustarTituloSecao(section, true);
}

function fecharSecao(sectionId) {
  const section = document.getElementById(sectionId);

  ajustarAlturaConteudo(section, false);
  section.classList.remove('expanded');
  ajustarTituloSecao(section, false);
}

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const section = entry.target.closest('section');
      if (section) {
        section.classList.add('visible-title');
      }
      sectionObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.2,
});

document.addEventListener('DOMContentLoaded', () => {
  preencherConteudosDasSecoes();

  const interatividadeSection = document.getElementById('interatividade');
  if (interatividadeSection) {
    interatividadeSection.addEventListener('click', (event) => {
      const buyButton = event.target.closest('.seed-buy-btn');
      if (buyButton) {
        event.stopPropagation();
        comprarSemente(buyButton.dataset.seed);
        return;
      }

      const harvestBtn = event.target.closest('#harvestModeBtn');
      if (harvestBtn) {
        event.stopPropagation();
        alternarModoColheita();
        return;
      }

      const sellBtn = event.target.closest('#sellAllBtn');
      if (sellBtn) {
        event.stopPropagation();
        venderTudo();
        return;
      }

      const plotButton = event.target.closest('.farm-plot');
      if (plotButton) {
        event.stopPropagation();
        plantarSemente(Number(plotButton.dataset.index));
      }
    });
  }

  document.querySelectorAll('section h2').forEach((title) => {
    sectionObserver.observe(title);
  });

  document.querySelectorAll('section').forEach((section) => {
    section.addEventListener('click', function(e) {
      if (!e.target.classList.contains('section-close-btn') &&
          !e.target.closest('.caixa-interativa') &&
          !e.target.closest('img')) {
        if (!section.classList.contains('expanded')) {
          abrirSecao(section.id);
        }
      }
    });
  });
});
