import { createContext, useContext } from "react";
import { ContextType } from "../hooks/useSyncExternalStore";
import { useAtom } from "../store/useAtom";

// 型定義
interface StateType {
  a: number;
  b: number;
  c: number;
}

// グローバル `Context` を作成
const GlobalStoreContext = createContext<ContextType<StateType> | null>(null);

// プロバイダを作成
export const GlobalStoreProvider = ({ children }: React.PropsWithChildren) => {
  // const context = useCreateStoreContext(() => ({
  //   a: 0,
  //   b: 10,
  //   c: 100,
  // }));
  const context = useAtom();
  return (
    <GlobalStoreContext.Provider value={context}>
      {children}
    </GlobalStoreContext.Provider>
  );
};

// グローバル `context` を取得するカスタムフック
export const useGlobalStore = () => {
  const context = useContext(GlobalStoreContext);
  if (!context) {
    throw new Error("useGlobalStore must be used within a GlobalStoreProvider");
  }
  return context;
};
