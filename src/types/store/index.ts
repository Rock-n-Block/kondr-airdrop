import { TNullable } from 'types';

export interface UserState {
  address: string;
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

export type AirdropStatus = 'confirmed' | 'waiting' | 'pending';

export type AirdropLine = {
  date: string;
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
  address: string;
  amount: string;
  available_date: string;
  signature: string;
};

export interface FreezeState {
  freeze: FreezeElement[];
  complete: FreezeElement[];
  pending: FreezeElement[];
  baseFreeze: TNullable<CSVLine[]>;
  collect: string;
  isLoading: boolean;
}
