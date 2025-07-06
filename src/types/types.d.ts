import "@tanstack/react-table";

export type CF_User = {
  handle: string;
  rating: number;
  maxRating: number;
  rank: string;
  avatar: string;
  friendOfCount: number;
};

export type UserData = {
  handle: string;
  name: string;
  regId: string;
  year: number;
  branch: string;
  rating: number;
  maxRating: number;
  rank: string;
  avatar: string;
  friendOfCount: number;
  contribution: number;
};

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    label?: string;
    isIndex?: boolean;
    isCentered?: boolean;
  }
}
