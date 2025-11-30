import { IBooking } from "./booking.interface";
export declare const BookingService: {
    createBooking: (payload: Partial<IBooking>, userId: string) => Promise<{
        paymentUrl: any;
        booking: (import("mongoose").Document<unknown, {}, IBooking, {}, {}> & IBooking & {
            _id: import("mongoose").Types.ObjectId;
        } & {
            __v: number;
        }) | null;
    }>;
    getAllBookings: () => Promise<{}>;
    getUserBookings: () => Promise<{}>;
    getSingleBooking: () => Promise<{}>;
    updateBooking: () => Promise<{}>;
    deleteBooking: () => Promise<{}>;
};
//# sourceMappingURL=booking.service.d.ts.map