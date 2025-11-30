import { ITour, ITourType } from "./tour.interfaces";
export declare const tourService: {
    createTour: (payload: ITour) => Promise<import("mongoose").Document<unknown, {}, ITour, {}, {}> & ITour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    getAllTours: (query: Record<string, string>) => Promise<{
        data: any;
        meta: any;
    }>;
    createTourType: (payload: ITourType) => Promise<import("mongoose").Document<unknown, {}, ITourType, {}, {}> & ITourType & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }>;
    updateTour: (id: string, payload: ITour) => Promise<(import("mongoose").Document<unknown, {}, ITour, {}, {}> & ITour & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    }) | null>;
};
//# sourceMappingURL=tour.service.d.ts.map