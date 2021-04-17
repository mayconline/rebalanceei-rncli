export const formatNumber = (amount?: number) => {
  if (!amount) return `R$ 0,00`;

  let money = amount
    ?.toFixed(2)
    .replace('.', ',')
    .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  return `R$ ${money}`;
};

export const formatAveragePricePreview = (averagePrice: string) => {
  let preview = '';
  let value = '';

  value = averagePrice.replace(/R?\$/i, '').trim();
  if (value.startsWith('R')) value = value.replace(/R/i, '').trim();

  value = value.replace(',', '.');
  preview = `R$ ${value}`;

  return { value, preview };
};

export const formatPercent = (percent: number) =>
  ` (${percent > 0 ? '+' : ''}${percent.toFixed(1)}%)`;

export const formatProgress = (grade: number, current: number) => {
  if (grade === 0) return 1;

  return current / grade;
};

export const formatStatus = (status: string) =>
  status === 'BUY' ? 'Comprar' : status === 'KEEP' ? 'Aguardar' : 'Analizar';

export const formatTicket = (symbol: string) => symbol?.split('.')[0];

export const formatFilter = (filter: string) =>
  ({
    [filter]: filter,
    symbol: 'Ativo',
    grade: 'Nota',
    status: 'Status',
    currentAmount: 'Saldo Atual',
    currentPercent: '% Atual',
    gradePercent: '% Ideal',
    targetAmount: 'Valor',
    targetPercent: 'Porcentagem',
    costAmount: 'Saldo Aplicado',
    variationPercent: 'Rentabilidade',
  }[filter]);

const UnitsTickets = [
  'TIET11',
  'ALUP11',
  'BIDI11',
  'BPAC11',
  'ENGI11',
  'KLBN11',
  'PPLA11',
  'RNEW11',
  'SAPR11',
  'SANB11',
  'SULA11',
  'TAEE11',
];

const ETFTickets = [
  'BBOV11',
  'BBSD11',
  'ESGB11',
  'XBOV11',
  'BOVB11',
  'SMAL11',
  'BOVA11',
  'BRAX11',
  'ECOO11',
  'IVVB11',
  'BOVV11',
  'DIVO11',
  'FIND11',
  'GOVE11',
  'MATB11',
  'ISUS11',
  'PIBB11',
  'SPXI11',
  'SMAC11',
  'XFIX11',
  'GOLD11',
  'XINA11',
  'HASH11',
  'QBTC11',
  'EURP11',
];

export const isUnit = (symbol: string) =>
  UnitsTickets.includes(symbol.toUpperCase());

export const isETF = (symbol: string) =>
  ETFTickets.includes(symbol.toUpperCase());

export const getClassTicket = (ticket: string) =>
  ticket.slice(-2) === '34'
    ? 'BDR'
    : ticket.slice(-1) === '3' || ticket.slice(-1) === '4' || isUnit(ticket)
    ? 'Ação'
    : ticket.slice(-2) === '11' && !isUnit(ticket) && !isETF(ticket)
    ? 'FII'
    : isETF(ticket)
    ? 'ETF'
    : 'Outros';

interface IGetgetLengthTicketPerClass {
  name: string;
  percent: number;
}

export const getLengthTicketPerClass = (
  items: IGetgetLengthTicketPerClass[],
) => {
  let unicClass: string[] = [];

  items.map(item => {
    if (!unicClass.includes(item.name)) {
      return unicClass.push(item.name);
    }
  });

  const countClass = unicClass.map(unic => ({
    name: unic,
    count: items.filter(item => item.name === unic).length,
    percent: items
      .filter(item => item.name === unic)
      .reduce((acc, cur) => acc + cur.percent, 0),
  }));

  return countClass;
};

export const getPositionAdBanner = (index: number, length: number) => {
  return index % 6 === 0 || index === 0;
};

export const formatErrors = (error: string) =>
  ({
    [error]: error,
    'User or Password Invalid': 'Usuário ou Senha inválido',
    'Token Not Exists': 'Token não cadastrado',
    'Token Invalid or Expired': 'Token inválido ou expirado',
    'User Exists': 'Usuário já cadastrado',
    'User Not Exists': 'Usuário não cadastrado',
    'Email Already Send': 'E-mail enviado',
    'Code Invalid or Expired': 'Code inválido ou expirado',
    'User Unauthorized': 'Usuário não autorizado',
    'User Inactive': 'Usuário desabilitado',
    'Wallet Not Found': 'Carteira não encontrada',
    'Ticket Not Found': 'Ativo não encontrado',
    'Ticket Exists': 'Ativo já cadastrado',
    'Tickets limited to 16 items': 'Limite de 16 ativos já cadastrados',
    'Wallet limited to 2 items': 'Limite de 2 carteiras já cadastradas',
    'Failed Convert Dollar': 'Erro ao realizar a conversão do dollar',
    'Failed Stock API': 'Erro ao buscar os dados',
    'Failed SendGrid': 'Falha ao enviar o e-mail',
    'Response not successful: Received status code 400':
      'Nenhuma carteira selecionada',
    'Response not successful: Received status code 500':
      'Nenhuma carteira selecionada',
    'Network request failed': 'Falha de conexão com o servidor',
    'Payment is Cancelled.': 'Pagamento não realizado',
    'An unknown or unexpected error has occured. Please try again later.':
      'Pagamento recusado',
    'You already own this item.': 'Sua conta google já possui esta assinatura',
    'Billing is unavailable. This may be a problem with your device, or the Play Store may be down.':
      'Houve uma falha ao se conectar a google play.',
  }[error]);

export const openPlanModalOnError = async (errorMessage?: string) => {
  if (!errorMessage?.length) return false;

  const openPlanModal =
    errorMessage === 'Tickets limited to 16 items' ||
    errorMessage === 'Wallet limited to 2 items';

  return openPlanModal;
};
