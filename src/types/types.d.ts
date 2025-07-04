import '@tanstack/react-table'

export type CF_User = {
  handle: string,
  rating: number,
  maxRating: number,
};

export type UserData = {
  handle: string,
  name: string,
  regId: string,
  year: number,
  branch: string,
  rating: number,
  maxRating: number,
};

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    label?: string
    isIndex?: boolean
  }
}