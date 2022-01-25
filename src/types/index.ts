export * from './connect';
export * from './store';
export * from './context';
export * from './components';

export type TNullable<T> = T | null;
export type TOptionable<T> = T | undefined;

export interface IModalProps {
  className?: string;
  visible: boolean;
  onClose: () => void;
}
