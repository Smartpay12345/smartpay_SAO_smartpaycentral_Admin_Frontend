"use client";

import { useEffect, useState } from "react";
import { toFormError } from "@/lib/auth/api";
import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query'


export interface EndpointError {
  code: string;
  message: string;
  retryAfter?: number;
  fields: Record<string, string>; // validation_error details, e.g. fields.search
}



function toEndpointError(err: unknown): EndpointError {
  const e = toFormError(err);
  const generic = e.code === "server_error" || e.code === "network_error";
  return {
    code: e.code,
    message: generic ? "Something went wrong. Please try again." : e.message,
    retryAfter: e.retryAfter,
    fields: (e.fields ?? {}) as Record<string, string>,
  };
}

export function useEndpoint<T>(name: string, params: unknown, fetcher: () => Promise<T>, options: { enabled?: boolean; refetchInterval?: number | false; keepPrevious?: boolean } = {}) {
  const query = useQuery<T, Error>({
    queryKey: [name, params],
    queryFn: fetcher,
    placeholderData: options.keepPrevious === false ? undefined : keepPreviousData,
    enabled: options.enabled ?? true,
    refetchInterval: options.refetchInterval,
  })

  return {
    data: query.data,
    error: query.error ? toEndpointError(query.error) : undefined,
    loading: query.isFetching,
    retry: () => void query.refetch(),
  }
}

// for the search box: only query after the user stops typing
export function useDebouncedValue<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export function useInfiniteEndpoint<T extends { has_more: boolean }>(
  name: string,
  params: unknown,
  fetcher: (page: number) => Promise<T>,
) {
  const query = useInfiniteQuery({
    queryKey: [name, params],
    queryFn: ({ pageParam }) => fetcher(pageParam),
    initialPageParam: 1,
    getNextPageParam: (last, all) => (last.has_more ? all.length + 1 : undefined),
  })
  return {
    pages: query.data?.pages,
    error: query.error ? toEndpointError(query.error) : undefined,
    loadingMore: query.isFetchingNextPage,
    hasMore: query.hasNextPage,
    loadMore: () => void query.fetchNextPage(),
    retry: () => void query.refetch(),
  }
}