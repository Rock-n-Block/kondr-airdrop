import { ReactElement } from 'react';

export type TModalStatus = 'success' | 'error';

export interface IModals {
  type: TModalStatus;
  title: string;
  info?: ReactElement;
  onClick?: (args: any) => void;
}
