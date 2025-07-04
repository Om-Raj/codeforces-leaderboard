import '@tanstack/react-table'

export type Rating = {
  handle: string,
  name: string,
  regId: string,
  year: number,
  branch: string,
  curRating: number,
  maxRating: number,
};

declare module '@tanstack/react-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    label?: string
  }
}