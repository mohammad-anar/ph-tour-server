export declare const PaymentService: {
    makePayment: (bookingId: string) => Promise<{
        paymentUrl: any;
    }>;
    successPayment: (query: Record<string, string>) => Promise<{
        success: boolean;
        message: string;
    } | undefined>;
    failedPayment: (query: Record<string, string>) => Promise<{
        success: boolean;
        message: string;
    } | undefined>;
    canceledPayment: (query: Record<string, string>) => Promise<{
        success: boolean;
        message: string;
    } | undefined>;
    getInvoiceUrl: (paymentId: string) => Promise<string | undefined>;
};
//# sourceMappingURL=payment.service.d.ts.map