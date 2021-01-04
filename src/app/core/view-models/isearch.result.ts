export interface ISearchResult<TEntity> {
    code?: number;
    message?: string;
    items: TEntity[];
    totalRows: number;
}
