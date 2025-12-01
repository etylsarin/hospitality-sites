'use client';

import { atom, useAtom } from 'jotai';
import { useRouter } from 'next/navigation';

import { makeQueryString } from '../../utils';

const queryAtom = atom('');

export function useQueryParam(pathname: string = 'places') {
  const [query, setQuery] = useAtom(queryAtom);
  const router = useRouter();

  const clearFilter = (key: string[]) => {
    const url = new URL(window.location.href);
    key.forEach((item) => url.searchParams.delete(item));
    setQuery(url.search);
    router.push(`${pathname}${url.search}`);
  };

  const setQueryparams = (data: any) => {
    let queryString = '';
    if (typeof data !== 'string') {
      queryString = makeQueryString(data);
    }
    setQuery(queryString);
  };

  const updateQueryparams = (key: string, value: string | number | boolean) => {
    if (!value) {
      clearFilter([key]);
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.set(key, value.toString());
    setQuery(url.search);
    router.push(`${pathname}${url.search}`);
  };

  return {
    query,
    setQueryparams,
    updateQueryparams,
    clearFilter,
  };
}
