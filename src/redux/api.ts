import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://23.239.111.164:4000/api/v1",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Projects", "Messages"],
  endpoints: (builder) => ({
    // Auth
    googleLogin: builder.query<void, void>({
      query: () => "/auth/google",
    }),

    // Projects
    getProjects: builder.query<any[], void>({
      query: () => "/projects",
      transformResponse: (response: { data: any[] }) => response.data,
      providesTags: ["Projects"],
    }),
    createProject: builder.mutation<
      any,
      {
        name: string;
        description?: string;
        clientName?: string;
        platform?: string;
        orderLink?: string;
      }
    >({
      query: (body) => ({
        url: "/projects",
        method: "POST",
        body: {
          platform: "FIVERR",
          ...body,
        },
      }),
      transformResponse: (response: { data: any }) => response.data,
      invalidatesTags: ["Projects"],
    }),

    // Messages with Pagination
    getMessages: builder.query<
      { data: any[]; meta: any },
      { projectId: string; page: number; limit: number }
    >({
      query: ({ projectId, page, limit }) =>
        `/messages?projectId=${projectId}&page=${page}&limit=${limit}`,
      // We don't merge in the API slice anymore to allow the component to manage the list easily
      // but we'll extract the data and meta
      transformResponse: (response: { data: any[]; meta: any }) => ({
        data: response.data,
        meta: response.meta,
      }),
      providesTags: (
        _result: any,
        _error: any,
        { projectId }: { projectId: string },
      ) => [{ type: "Messages", id: projectId }],
    }),

    moderateMessage: builder.mutation<
      any,
      { originalMsg: string; projectId: string }
    >({
      query: (body) => ({
        url: "/messages",
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: any }) => response.data,
      invalidatesTags: (
        _result: any,
        _error: any,
        { projectId }: { projectId: string },
      ) => [{ type: "Messages", id: projectId }],
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useGetMessagesQuery,
  useModerateMessageMutation,
  useLazyGoogleLoginQuery,
} = api;
