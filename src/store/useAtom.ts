import { useRef } from "react";
import { useCreateStoreContext, ContextType } from "../hooks/useSyncExternalStore";

interface StateType {
  a: number;
  b: number;
  c: number;
}

export const useAtom = (): ContextType<StateType> => {
  // useRefで状態を保持
  const contextRef = useRef<ContextType<StateType>>(
    useCreateStoreContext(() => ({
      a: 0,
      b: 10,
      c: 100,
    }))
  );

  return contextRef.current;
};
