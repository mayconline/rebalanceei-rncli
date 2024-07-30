export type IModals =
  | 'AddTicket'
  | 'SUCCESS'
  | 'PLAN'
  | 'Wallet'
  | 'Menu'
  | null;

export interface IContentConfirmModalProps {
  description: string;
  legend?: string;
  onConfirm: () => Promise<void>;
  isOnlyConfirm?: boolean;
}
