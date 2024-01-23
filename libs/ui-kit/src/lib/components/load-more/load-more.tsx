'use client';

import { FunctionComponent, useState } from "react";

import { Button } from '../button/button';

export interface LoadMoreProps {
    itemCount: number;
}

export const LoadMore: FunctionComponent<LoadMoreProps> = ({ itemCount }) => {
    const [list, setList] = useState(12);
    const [isLoading, setIsLoading] = useState(false);
    const handleLoadMore = () => {
      setIsLoading(true);
      setTimeout(() => {
        setList((prevList) => prevList + 10);
        setIsLoading(false);
      }, 600);
    }

    return (
        <>
        {itemCount >= list ? (
            <Button
                size="xl"
                type="button"
                isLoading={isLoading}
                onClick={() => handleLoadMore()}
                className="relative bottom-0 left-1/2 z-30 mx-auto mt-16 -translate-x-1/2 px-6 py-2.5 md:sticky md:bottom-10 md:text-base xl:relative xl:bottom-0"
            >
                Load more
            </Button>
        ) : null}
        </>
    );
};

LoadMore.displayName = 'LoadMore';
