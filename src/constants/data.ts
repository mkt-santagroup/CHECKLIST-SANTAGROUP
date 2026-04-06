import { Milestone, PanelData } from '../types';

export const MARCOS: Milestone[] = [
  {title:'Save the date + narrativa',meta:50,unlocks:'Spoiler #1',posts:['Post save the date nas redes sociais','Story com contagem regressiva','Definir e comunicar narrativa da season internamente']},
  {title:'Spoiler #1 — DP (delegacia)',meta:100,unlocks:'Spoiler #2',posts:['Post print mapa — DP no feed','Story enigmático sem contexto','Copy/legenda aprovada e publicada']},
  {title:'Spoiler #2 — Mecânica',meta:200,unlocks:'Spoiler #3',posts:['Post print mapa — Mecânica no feed','Story com enquete ou caixa de perguntas','Copy/legenda aprovada e publicada']},
  {title:'Spoiler #3 — Hospital',meta:300,unlocks:'Hype máximo',posts:['Post print mapa — Hospital no feed','Story com caixa de perguntas aberta','Copy/legenda aprovada e publicada']},
  {title:'Hype máximo — equipe ativa',meta:400,unlocks:'D-0',posts:['Equipe ativa nos canais do Discord','Responder galera com respostas enigmáticas','Post de aquecimento nas redes','Drops de tensão (frases, imagens sem contexto)']},
  {title:'Último aviso + acesso antecipado',meta:null,unlocks:null,posts:['Post último aviso nas redes','Arte acesso antecipado publicada','Discord CTA ativo','Intensificar avisos no chat geral — a cada 30min, 15min, 5min']},
  {title:'D-0 — Dia do lançamento',meta:null,unlocks:null,posts:['Abertura dos portões com super live','Anúncio oficial publicado','Cupom com QR code ativado','Clientes antecipados e líderes nos QGs 1h antes','Equipe completa no Discord operando']},
];

export const DATA: Record<string, PanelData> = {
  back:{color:'back',sections:[
    {title:'— 10 dias antes — Deadline de produção',items:[
      {label:'Definir data e hora do lançamento',urgency:'urgente',info:'Data e horário exatos do lançamento definidos e comunicados para todo o time. Essa informação trava o planejamento de tudo que vem depois.'},
      {label:'Cidade pronta e testada',urgency:'urgente',info:'Tudo na cidade precisa estar funcional e testado antes dos 10 dias. Qualquer bug encontrado depois disso é risco de lançamento comprometido.'},
      {label:'Checar bugs na cidade',urgency:'urgente',info:'Testar todos os locais, mecânicas e interações da cidade antes do lançamento. Registrar qualquer bug encontrado e garantir que foi corrigido.'},
      {label:'Verificar se tudo está utilizável pelos jogadores',urgency:'urgente',info:'Além de não ter bug, garantir que a experiência do jogador está fluida — acessos, itens, locais, tudo funcionando como deveria desde o primeiro minuto.'},
      {label:'Spoilers produzidos e aprovados',urgency:'urgente',info:'Prints dos mapas (DP, Mecânica, Hospital) já editados, com as mudanças de cor e elementos novos visíveis. Aprovados pelo time antes de entrar na trilha de posts.'},
      {label:'Todo material de lançamento finalizado',urgency:'urgente',info:'Artes, vídeos, copys, músicas, loadscreen — tudo que vai ser usado no lançamento precisa estar pronto. Nada de produzir material em cima da hora.'},
      {label:'Checklist completo revisado pelo time',urgency:'importante',info:'Passar o checklist inteiro com o time responsável, confirmar que nada ficou pra trás e que cada item tem um dono definido.'},
    ]},
    {title:'— 7 dias antes — Comunicação com líderes e clientes',items:[
      {label:'Briefing com líderes do time',urgency:'urgente',info:'Reunião com os líderes para alinhar o lançamento. Cobrir: o que vai acontecer, em que ordem, quem faz o quê e como vão se comunicar no dia.'},
      {label:'Alinhar responsabilidades do dia',urgency:'urgente',info:'Cada líder precisa sair do briefing sabendo exatamente o que é sua responsabilidade no dia do lançamento. Sem responsabilidade definida, nada acontece.'},
      {label:'Confirmar presença e horários dos líderes',urgency:'importante',info:'Confirmar que todos estarão disponíveis no horário certo — especialmente 1h antes da abertura, quando já começa o movimento nos QGs.'},
      {label:'Passar o roteiro geral do lançamento',urgency:'importante',info:'Compartilhar o roteiro do dia: horário de entrada antecipada, horário de abertura geral, sequência de eventos, quem faz o quê em cada momento.'},
      {label:'Comunicar clientes com acesso antecipado exclusivo',urgency:'urgente',info:'Avisar os clientes que têm acesso antecipado exclusivo — horário de entrada, como acessar, o que esperar. Esse é um benefício premium, a comunicação precisa refletir isso.'},
      {label:'Confirmar lista de líderes e cargos altos para entrada antecipada',urgency:'importante',info:'Ter a lista fechada de quem entra 1h antes. Líderes de fac e cargos altos precisam ser confirmados antes do dia para não gerar confusão na entrada.'},
      {label:'Alinhar clientes estratégicos',urgency:'planejamento',info:'Clientes que têm papel ativo na comunidade ou que vão ajudar a gerar engajamento no lançamento. Alinhar expectativas e combinar como podem contribuir.'},
    ]},
    {title:'— 3 dias antes — Organização interna',items:[
      {label:'Escalar equipe para o dia e definir funções',urgency:'urgente',info:'Definir quem estará presente no dia do lançamento, em qual função e em qual horário. Cobrir todos os turnos e garantir que ninguém está sem função definida.'},
      {label:'Definir horários de interação da equipe',urgency:'importante',info:'Estabelecer os horários em que a equipe vai estar ativa interagindo com a comunidade — tanto antes quanto durante o lançamento.'},
      {label:'Criar checklist operacional do dia',urgency:'planejamento',info:'Um checklist específico para o dia D — o que acontece hora a hora, quem executa cada etapa e como confirmar que foi feito.'},
      {label:'Preparar QGs para líderes, cargos altos e clientes antecipados (entrada 1h antes)',urgency:'urgente',info:'Os QGs precisam estar setados e prontos antes da entrada antecipada. Líderes de fac, cargos altos e clientes com acesso exclusivo entram 1h antes e já precisam encontrar tudo no lugar.'},
      {label:'Briefing final com todo o time (24h antes)',urgency:'urgente',info:'Última reunião antes do lançamento. Revisar o roteiro, tirar dúvidas, confirmar que todos estão alinhados e prontos. Idealmente 24h antes.'},
    ]},
  ]},
  front:{color:'front',sections:[
    {title:'— Semana anterior — Aquecimento & Expectativa',items:[
      {label:'Restringir acesso a canais estratégicos no Discord',urgency:'importante',info:'Alguns canais ficam bloqueados ou com acesso limitado antes do lançamento para criar sensação de exclusividade e preparar o terreno para a abertura.'},
      {label:'Mensagem de "algo tá chegando" nos canais abertos',urgency:'importante',info:'Post nos canais abertos do Discord sinalizando que algo grande vem aí — sem revelar o quê. O objetivo é plantar a semente da curiosidade.'},
      {label:'FAQ bloqueado / respostas misteriosas propositais',urgency:'planejamento',info:'Se houver canal de dúvidas, deixar sem resposta ou responder de forma propositalmente vaga. O silêncio e o mistério são parte da estratégia de hype.'},
      {label:'Engajar líderes e membros-chave pra alimentar o hype',urgency:'importante',info:'Combinar com líderes e membros influentes da comunidade para que eles também falem sobre o lançamento — organicamente, sem parecer forçado.'},
      {label:'Save the date enviado nas redes e Discord',urgency:'urgente',info:'Primeiro comunicado público com a data do lançamento. Vai nas redes e nos canais do Discord. Não precisa revelar tudo — só a data e a sensação de que algo grande vem.'},
      {label:'Avisos programados para os dias seguintes',urgency:'planejamento',info:'Avisos automáticos ou agendados para lembrar a comunidade do lançamento nos dias que antecedem.'},
    ]},
    {title:'— Semana anterior — Material & Artes',items:[
      {label:'Vídeos de divulgação prontos',urgency:'urgente',info:'Vídeos curtos para redes sociais divulgando o lançamento. Precisam estar editados, aprovados e prontos antes do início da trilha de posts.'},
      {label:'Copys para interação finalizadas',urgency:'urgente',info:'Textos prontos para posts, stories e mensagens no Discord. Ter as copys prontas evita improvisar na hora e garante consistência na comunicação.'},
      {label:'Arte "acesso antecipado / quer ter acesso à Season X?" pronta',urgency:'urgente',info:'Arte específica para divulgar o acesso antecipado pago — disponível na loja. Precisa deixar claro o benefício (entrar 1h antes) e como adquirir.'},
      {label:'Arte Discord CTA pronta',urgency:'importante',info:'Arte convidando a galera a entrar no Discord do servidor. Usada nas redes sociais para converter seguidores em membros ativos da comunidade.'},
      {label:'Loadscreen finalizada',urgency:'urgente',info:'Tela de carregamento com a identidade visual da nova season. É a primeira coisa que o jogador vê ao entrar.'},
      {label:'Logos season aprovadas',urgency:'urgente',info:'Logo oficial da season aprovado pelo time. Usado em todas as artes, vídeos e materiais de divulgação.'},
      {label:'Artes Mastodoon finalizadas',urgency:'importante',info:'Artes específicas do personagem/mascote Mastodoon para a season.'},
      {label:'Arte Stories/Instagram pronta',urgency:'importante',info:'Artes formatadas para stories e feed do Instagram.'},
      {label:'Artes revisadas e exportadas',urgency:'urgente',info:'Revisão final de todas as artes — textos, cores, dimensões e qualidade. Exportar nos formatos corretos para cada plataforma.'},
      {label:'Identidade visual consistente em todos os materiais',urgency:'importante',info:'Checar se todas as artes seguem a mesma identidade visual da season — paleta de cores, tipografia, estilo.'},
      {label:'Música escolhida e aprovada',urgency:'importante',info:'Trilha sonora do lançamento definida e aprovada. Usada na live, em vídeos e em momentos de hype.'},
      {label:'Reembolso arte aprovada',urgency:'planejamento',info:'Arte com informações sobre política de reembolso, caso aplicável. Precisa estar aprovada antes do lançamento.'},
      {label:'Arte sorteio pronta',urgency:'opcional',optional:true,info:'Arte do sorteio para divulgar nas redes. Só aplicável quando há parceiro ou patrocinador envolvido no lançamento.'},
      {label:'Arte sorteio parceiro pronta',urgency:'opcional',optional:true,info:'Arte específica para o sorteio com parceiro. Só aplicável quando há parceria envolvida.'},
    ]},
    {title:'Trilha de posts — metas de engajamento orgânico',items:[],isTrail:true},
    {title:'— Dias antes — Contagem regressiva',items:[
      {label:'Configurar bot de contagem regressiva no canal (Countr ou similar)',urgency:'importante',info:'Bot que atualiza o nome do canal automaticamente com o tempo restante. A galera vê na lista de canais sem precisar clicar.'},
      {label:'Definir responsável pelos avisos manuais no chat geral',urgency:'urgente',info:'Uma pessoa do time responsável por postar avisos periódicos no chat geral. Complementa o bot com presença humana.'},
      {label:'Definir frequência dos avisos (30min → 15min → 5min)',urgency:'importante',info:'Estabelecer com antecedência o ritmo dos avisos manuais. Sugestão: a cada 30min até 2h antes, depois a cada 15min, depois a cada 5min na reta final.'},
      {label:'Wipou dúvidas respondidas antes do D-0',urgency:'importante',info:'Antes do lançamento, varrer os canais e responder as dúvidas mais frequentes da comunidade. Reduz o volume de perguntas repetidas no dia.'},
      {label:'Cupom com QR code gerado',urgency:'urgente',info:'QR code com cupom de desconto ou acesso especial para ser divulgado no dia do lançamento. Gera senso de urgência e exclusividade.'},
    ]},
    {title:'— D-0 — Dia do lançamento',items:[
      {label:'1h antes: intensificar avisos e canal de contagem ao vivo',urgency:'urgente',info:'Na última hora, canal de contagem ativo com presença humana ao vivo — postando a cada poucos minutos, criando tensão máxima antes da abertura.'},
      {label:'Time operacional do Discord nos postos (moderação, suporte, interação)',urgency:'urgente',info:'Definir quem vai estar no Discord no dia do lançamento e em qual função — moderação, suporte, interação, operacional. Todos devem estar online antes da abertura.'},
      {label:'Anúncio oficial publicado nas redes',urgency:'urgente',info:'Post oficial do lançamento nas redes — data, hora, o que vem aí. Precisa ter a identidade visual da season e causar impacto.'},
      {label:'Abertura dos portões com super live',urgency:'urgente',info:'A live marca o momento da abertura oficial. Precisa estar preparada — quem vai, o que vai acontecer, duração estimada, como vai interagir com quem tá entrando.'},
    ]},
  ]},
  entregaveis:{color:'entregaveis',sections:[
    {title:'IMAGENS > Todas as imagens Horizontal + Vertical > PASTA DE FOTOS + OVERLAY',items:[
      {label:'Imagem oficial do wipe', urgency:'planejamento'},
      {label:'Imagem SAVE THE DATE', urgency:'planejamento'},
      {label:'Imagem spoiler — Delegacia (DP)', urgency:'planejamento'},
      {label:'Imagem spoiler — Mecânica', urgency:'planejamento'},
      {label:'Imagem spoiler — Hospital', urgency:'planejamento'},
      {label:'Imagem spoiler — Favela / comunidade', urgency:'planejamento'},
      {label:'Imagem spoiler — Sistema exclusivo', urgency:'planejamento'},
      {label:'Imagem teaser abstrata', urgency:'planejamento'},
      {label:'Imagem Contagem Regressiva | Faltam x dias / É hoje', urgency:'planejamento'},
      {label:'Imagens FAQS dúvidas (Como assumir uma fac / Como entrar na cidade no lançamento...)', urgency:'planejamento'},
      {label:'20x copys para usar nesses spoilers', urgency:'planejamento'}
    ]},
    {title:'CONTEÚDO — VÍDEOS VERTICAIS',items:[
      {label:'Vídeo #00 - Tudo acabando... Remember do que foi vivido + Anúncio de algo está por vir...', urgency:'planejamento'},
      {label:'Vídeo #01 - Vídeo anunciando o wipe - Horizontal Discord + Vertical', urgency:'planejamento'},
      {label:'Vídeo #02 - Vídeo mostrando coisas do Wipe > Aquecer publico', urgency:'planejamento'},
      {label:'Vídeo #03 - Video do "Hoje é o WIPE as X horas"', urgency:'planejamento'},
      {label:'Vídeo #04 - Vem assumir organizações (Policia, HP, facs...)', urgency:'planejamento'},
      {label:'Bonus: Videos mostrando coisas novas quando tiver oq mostrar', optional: true, urgency:'planejamento'}
    ]},
    {title:'POSTs',items:[
      {label:'Carrossel: Mostrar mapas', urgency:'planejamento'},
      {label:'Carrossel: Como entrar na cidade', urgency:'planejamento'},
      {label:'Falando do WIPE', urgency:'planejamento'}
    ]},
  ]}
};

export const URGENCY_META = {
  urgente:     {label:'🔴 Urgente',     emoji:'🔴', text:'Urgente',      cls:'urgente',      dot:'#E05252'},
  importante:  {label:'🟠 Importante',  emoji:'🟠', text:'Importante',   cls:'importante',   dot:'#E08C2A'},
  planejamento:{label:'🟡 Planejamento',emoji:'🟡', text:'Planejamento', cls:'planejamento', dot:'#C9BA2A'},
  opcional:    {label:'⚪ Opcional',     emoji:'⚪', text:'Opcional',     cls:'opcional',     dot:'#555'},
};
