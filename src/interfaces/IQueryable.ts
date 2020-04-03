export interface IQueryable<TInput, TResult> {
    Query(input: TInput): Promise<TResult>;
}