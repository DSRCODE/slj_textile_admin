import { configureStore } from "@reduxjs/toolkit";
import { cmsApi } from "../api/cmsApi";
import { productApi } from "../api/productApi";
import { categoryApi } from "../api/categoryApi";

export const store = configureStore({
  reducer: {
    [cmsApi.reducerPath]: cmsApi.reducer,
    [productApi.reducerPath]: productApi.reducer,
    [categoryApi.reducerPath]: categoryApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(cmsApi.middleware)
      .concat(productApi.middleware)
      .concat(categoryApi.middleware)
});
