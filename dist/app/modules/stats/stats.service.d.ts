export declare const StatsService: {
    getBookingStats: () => Promise<{
        totalBooking: number;
        totalBookingByStatus: any[];
        bookingPerTour: any[];
        avgGuestCountPerBooking: any[];
        bookingInLast7Days: number;
        bookingInLast30Days: number;
        totalUniqueUser: any;
    }>;
    getPaymentStats: () => Promise<{
        totalPayment: number;
        totalPaymentsByStatus: any[];
        totalRevenue: any[];
        avgPaymentAmount: any[];
        paymentGatewayData: any[];
    }>;
    getUserStats: () => Promise<{
        totalUsers: number;
        totalActiveUsers: number;
        totalBlockedUsers: number;
        totalInactiveUsers: number;
        newUserLast7Days: number;
        newUsersLast30Days: number;
        usersByRole: any[];
    }>;
    getTourStats: () => Promise<{
        totalTour: number;
        totalTourByTourType: any[];
        avgTourCost: any[];
        totalTourByDivision: any[];
        heightBookedTour: any[];
    }>;
};
//# sourceMappingURL=stats.service.d.ts.map