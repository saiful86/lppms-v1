import { baseApi } from "../redux/services/baseApi";
import receiveReducer from "../redux/features/users/authSlice";

export const reducer = {
  [baseApi.reducerPath]: baseApi.reducer,
  receive: receiveReducer,
};

