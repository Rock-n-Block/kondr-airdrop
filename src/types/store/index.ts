import { TNullable } from 'types';

export interface UserState {
  address: TNullable<string>;
  balance: string;
  isLoading: boolean;
  isOwner: boolean;
}

export type CSVLine = {
  address: string;
  data: string;
  amount: string;
  idx: number;
};

export interface FileState {
  files: TNullable<CSVLine[]>;
  file: TNullable<File>;
  isLoading: boolean;
  errorList: string[];
}

export type FreezeElement = {
  release: number;
  balance: string;
};

export interface FreezeState {
  freeze: FreezeElement[];
  collect: string;
  isLoading: boolean;
}
