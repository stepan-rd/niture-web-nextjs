"use client";

import { LoadingSpinner } from "@/components/LoadingSpinner";
import { storeItem } from "@/app/types";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchStoreItems } from "@/app/utils/fetchStoreItems";
import { RenderItems } from "./RenderItems";

type Props = {
  initialItems: storeItem[];
};

export function StoreItems({ initialItems }: Props) {
  const userSearchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(
    userSearchParams.get("q") || "",
  );
  const [activeTags, setActiveTags] = useState(
    JSON.parse(userSearchParams.get("tags") || "[]"),
  );

  const {
    data,
    isLoading,
    isSuccess,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["storeItems", { searchQuery, activeTags }],
    queryFn: ({ pageParam = 1 }) =>
      fetchStoreItems(
        `q=${searchQuery}&tags=${JSON.stringify(activeTags)}&page=${pageParam}`,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
    initialData: {
      pages: [{ items: initialItems, nextCursor: 2 }],
      pageParams: [1],
    },
  });

  useEffect(() => {
    const newSearchQuery = userSearchParams.get("q") || "";
    const newActiveTags = JSON.parse(userSearchParams.get("tags") || "[]");

    if (
      newSearchQuery !== searchQuery ||
      JSON.stringify(newActiveTags) !== JSON.stringify(activeTags)
    ) {
      setSearchQuery(newSearchQuery);
      setActiveTags(newActiveTags);
      refetch();
    }
  }, [userSearchParams, searchQuery, activeTags, refetch]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <h1>Error fetching items</h1>;
  }

  // TODO: Remove the button and add in view infinite scroll

  return (
    <>
      <div className="mb-10 flex flex-wrap justify-center gap-10">
        {isSuccess && Array.isArray(data?.pages) && (
          <RenderItems pages={data.pages} />
        )}
      </div>

      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="load-more-btn"
        >
          {isFetchingNextPage ? "Loading..." : "Load More"}
        </button>
      )}
    </>
  );
}
