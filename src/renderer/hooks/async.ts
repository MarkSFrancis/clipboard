import { useEffect, useState } from "react";

export interface UseAsyncOpts {
  suspend?: boolean;
}

export function useAsync<T = void>(
  func: () => Promise<T>,
  deps: unknown[],
  opts?: UseAsyncOpts
): [result: T, loaded: boolean, refreshing: boolean] {
  const [loaded, setLoaded] = useState(false);
  const [refreshing, setRefreshing] = useState(!opts?.suspend);
  const [result, setResult] = useState<T>();

  useEffect(() => {
    if (opts?.suspend) {
      return;
    }

    setRefreshing(true);

    func()
      .then(setResult)
      .finally(() => {
        setLoaded(true);
        setRefreshing(false);
      });
  }, [...deps, opts]);

  return [result, loaded, refreshing];
}
