import { tagTypes } from "../../tag-types";
import { baseApi } from "../baseApi";

export const transTypeApi = baseApi.injectEndpoints({
  endpoints: (build) => ({

    // get all  plans
    getAllPlans: build.query({
      query: (arg: Record<string, any>) => ({
        url: `/api/PurchasePlan/list`,
        method: "GET",
        params: arg,
        // params: {
        //   pageNo: arg.page !== undefined ? arg.page : 0,
        //   pageSize: arg.size !== undefined ? arg.size : 10,
        //   filter: arg.filter || '',
        //   dbFieldName: arg.dbFieldName,
        //   sortDirection: arg.sortDirection
        // },
      }),
      providesTags: [tagTypes.plans],
    }),

    // get all  Payments
    getAllPayments: build.query({
      query: (arg: Record<string, any>) => ({
        url: `/api/PurchasePlan/purchase-payment-list`,
        method: "GET",
        params: arg,
      }),
      providesTags: [tagTypes.plans],
    }),
    
    // check purchase item ration
    checkPurchaseItemRation: build.mutation({
      query: (arg: Record<string, any>) => ({
        url: "/api/purchasePlan/check-purchase-item-ratio",
        method: "GET",
        params: arg,
      }),
      invalidatesTags: [tagTypes.plans],
    }),
    
    // add a purchase plan 
    addPurchasePlanData: build.mutation({
      query: (data) => ({
        url: "/api/PurchasePlan/addAmountForPlan",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.plans],
    }),
    
    // add plan for supplier
    addPlanForSupplierData: build.mutation({
      query: (data) => ({
        url: "/api/PurchasePlan/addPlanForSupplier",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.plans],
    }),

    // deletee plan item and supplier wise
    deletePlanData: build.mutation({
        query: (data) => ({
          url: "/api/PurchasePlan/delete-purchase-plan",
          method: "DELETE",
          data,
        }),
        invalidatesTags: [tagTypes.plans],
    }),
  
    // add payment for supplier
    addPayment: build.mutation({
        query: (data) => ({
          url: "/api/PurchasePlan/add-purchase-payment",
          method: "POST",
          data,
        }),
        invalidatesTags: [tagTypes.plans],
    }),

    // get single transaction
    getSingleTransaction: build.query({
      query: (id: string | string[] | undefined) => ({
        url: `/setting/api/v1/tran-type/find/${id}`,
        method: "GET",
      }),
      providesTags: [tagTypes.plans],
    }),

    // create a new transaction
    addTransaction: build.mutation({
      query: (data) => ({
        url: "/setting/api/v1/tran-type/add",
        method: "POST",
        data,
      }),
      invalidatesTags: [tagTypes.plans],
    }),

    // update ac department
    updateTransaction: build.mutation({
      query: (data) => ({
        url: `/setting/api/v1/tran-type/update/${data.id}`,
        method: "PUT",
        data: data?.body,
      }),
      invalidatesTags: [tagTypes.plans],
    }),

  }),
});

export const {
  useGetAllPlansQuery,
  useGetAllPaymentsQuery,
  useCheckPurchaseItemRationMutation,
  useAddPurchasePlanDataMutation,
  useAddPlanForSupplierDataMutation,
  useDeletePlanDataMutation,
  useAddPaymentMutation,
  useGetSingleTransactionQuery,
  useAddTransactionMutation,
  useUpdateTransactionMutation,
} = transTypeApi;
