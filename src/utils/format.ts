export const formatNumber = (amount?: number) => {
  if (!amount) return 'R$ 0,00';

  const money = amount
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
    TICKET: 'Ativo',
    CLASS: 'Classe',
    SECTOR: 'Setor',
    INDUSTRY: 'Segmento',
    amount: 'Valor',
    month: 'Mês',
    accumulated: 'Acumulado',
  }[filter]);

export const PREMIUM_FILTER = ['SECTOR', 'INDUSTRY', 'Proventos'];

export const getPositionAdBanner = (index: number, length: number) => {
  return index % 6 === 0 || index === 0;
};

export const formatErrors = (error: string) =>
  ({
    [error]: error,
    'User or Password Invalid': 'Usuário ou Senha inválido',
    'Token Not Exists': 'Token não cadastrado',
    'Token Invalid or Expired': 'Token inválido ou expirado',
    'Refresh Token Invalid or Expired': 'Refresh Token inválido ou expirado',
    'User Exists': 'Usuário já cadastrado',
    'User Not Exists': 'Usuário não cadastrado',
    'Email Already Send': 'E-mail enviado',
    'Code Invalid or Expired': 'Code inválido ou expirado',
    'User Unauthorized': 'Usuário não autorizado',
    'User Inactive': 'Usuário desabilitado',
    'Wallet Not Found': 'Selecione a carteira',
    'Ticket Not Found': 'Ativo não encontrado',
    'Ticket Exists': 'Ativo já cadastrado',
    'Tickets limit Reached': 'Limite de ativos cadastrados atingido',
    'Wallet limit Reached': 'Limite de carteiras cadastradas atingida',
    'Failed Convert Dollar': 'Erro ao realizar a conversão do dollar',
    'Failed Stock API': 'Erro ao buscar os dados',
    'Failed SendGrid': 'Falha ao enviar o e-mail',
    'Response not successful: Received status code 400':
      'Selecione a carteira e tente novamente',
    'Response not successful: Received status code 500':
      'Houve um erro, por favor tente novamente',
    'Response not successful: Received status code 502':
      'Houve um erro, por favor tente novamente',
    'Network request failed': 'Falha de conexão com o servidor',
    'Payment is Cancelled.': 'Pagamento não realizado',
    'An unknown or unexpected error has occured. Please try again later.':
      'Pagamento recusado',
    'You already own this item.': 'Sua conta google já possui esta assinatura',
    'Billing is unavailable. This may be a problem with your device, or the Play Store may be down.':
      'Houve uma falha ao se conectar a google play.',
  }[error]);

export const openPlanModalOnError = (errorMessage?: string) => {
  if (!errorMessage?.length) return false;

  const openPlanModal =
    errorMessage === 'Tickets limit Reached' ||
    errorMessage === 'Wallet limit Reached';

  return openPlanModal;
};

export const formatDate = ({
  dateNumber,
  withTime = true,
}: {
  dateNumber: number;
  withTime?: boolean;
}) => {
  const date = new Date(dateNumber).toLocaleDateString();
  const time = new Date(dateNumber).toLocaleTimeString();

  return withTime ? `${date} às ${time}` : date;
};

export const formatMonth = (month: number): string =>
  ({
    1: 'Janeiro',
    2: 'Fevereiro',
    3: 'Março',
    4: 'Abril',
    5: 'Maio',
    6: 'Junho',
    7: 'Julho',
    8: 'Agosto',
    9: 'Setembro',
    10: 'Outubro',
    11: 'Novembro',
    12: 'Dezembro',
  }[month] ?? '');

export const formatNumberRound = (number?: number) => {
  if (!number) return 0;

  return Math.round(number);
};
