import { IDivision } from "./division.interface";
export declare const DivisionService: {
    createDivision: (payload: IDivision) => Promise<import("mongoose").Document<unknown, {}, IDivision, {}, {}> & IDivision & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateDivision: (id: string, payload: Partial<IDivision>) => Promise<(import("mongoose").Document<unknown, {}, IDivision, {}, {}> & IDivision & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
    getAllDivisions: () => Promise<{
        data: (import("mongoose").Document<unknown, {}, IDivision, {}, {}> & IDivision & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        })[];
        meta: {
            total: number;
        };
    }>;
    getSingleDivision: (slug: string) => Promise<{
        data: (import("mongoose").Document<unknown, {}, IDivision, {}, {}> & IDivision & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null;
    }>;
    deleteDivision: (id: string) => Promise<null>;
};
//# sourceMappingURL=division.service.d.ts.map