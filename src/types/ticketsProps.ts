export type TicketProps = {
  _id: string;
  symbol: string;
  name: string;
  quantity: number;
  averagePrice: number;
  grade: number;
  classSymbol: string;
};

export type TicketRequestProps = {
  walletID: string;
  sort?: 'symbol' | 'grade';
};

export type TicketResponseProps = {
  getTicketsByWallet: TicketProps[];
};

export type CreateTicketRequestProps = {
  walletID: string;
  symbol: string;
  name: string;
  quantity: number;
  averagePrice: number;
  grade: number;
};

export type CreateTicketResponseProps = {
  data: {
    createTicket: TicketProps;
  };
};

export type UpdateTicketRequestProps = {
  _id: string;
  symbol: string;
  name: string;
  quantity: number;
  averagePrice: number;
  grade: number;
};

export type UpdateTicketResponseProps = {
  data: {
    updateTicket: TicketProps;
  };
};

export type DeleteTicketRequestProps = {
  _id: string;
  walletID: string;
};

export type DeleteTicketResponseProps = {
  data: {
    deleteTicket: boolean;
  };
};
