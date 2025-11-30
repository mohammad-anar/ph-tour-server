import { Query } from "mongoose";
export declare class QueryBuilder<T> {
    modelQuery: Query<T[], T>;
    query: Record<string, string>;
    constructor(modelQuery: Query<T[], T>, query: Record<string, string>);
    filter(): this;
    search(searchableFields: string[]): this;
    sort(): this;
    fields(): this;
    paginate(): this;
    build(): any;
    getMeta(): Promise<{
        page: number;
        limit: number;
        total: number;
        totalPage: number;
    }>;
}
//# sourceMappingURL=QueryBuilder.d.ts.map