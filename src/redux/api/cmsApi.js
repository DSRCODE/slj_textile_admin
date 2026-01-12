import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const cmsApi = createApi({
  reducerPath: "cmsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      const auth = localStorage.getItem("health_web_admin");

      if (auth) {
        const { token } = JSON.parse(auth);
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["cms"],
  endpoints: (builder) => ({
    getCms: builder.query({
      query: ({ slug }) => ({
        url: `cms/get-cms-page?slug=${slug}`,
        method: "GET",
      }),
      providesTags: ["cms"],
    }),

    editCms: builder.mutation({
      query: ({ formdata, id }) => ({
        url: `cms/admin/update-cms-page/${id}`,
        method: "PUT",
        body: formdata,
      }),
      invalidatesTags: ["cms"],
    }),

    deleteCms: builder.mutation({
      query: (id) => ({
        url: `cms/admin/delete-cms-page/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["cms"],
    }),
  }),
});

export const { useEditCmsMutation, useGetCmsQuery, useDeleteCmsMutation } =
  cmsApi;
