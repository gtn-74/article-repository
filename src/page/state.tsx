// useSyncExternalStoreを学ぶ

import { Link } from "react-router-dom";
import {
  ContextType,
  // useCreateStoreContext,
  useSelector,
} from "../hooks/useSyncExternalStore";
import { useGlobalStore } from "../provider/StorePrivider";
import { Observable } from "../utils/observable";

// コンポーネントに渡す型を定義
interface StateType {
  a: number;
  b: number;
  c: number;
}

const A = ({ context }: { context: ContextType<StateType> }) => {
  // useSelectorはstoreから情報取得するカスタムフック
  // contextに初期値や、蓄積値が貯まる。それをuseSelectorで引っ張ってくる
  const value = useSelector(context, (state) => state.a);
  return <div>A:{value}</div>;
};
const B = ({ context }: { context: ContextType<StateType> }) => {
  const value = useSelector(context, (state) => state.b);
  return <div>B:{value}</div>;
};
const C = ({ context }: { context: ContextType<StateType> }) => {
  const value = useSelector(context, (state) => state.c);
  return <div>C:{value}</div>;
};

const Buttons = ({ context }: { context: ContextType<StateType> }) => {
  return (
    <div>
      <button
        onClick={() =>
          context.dispatch((state) => ({ ...state, a: state.a + 1 }))
        }
      >
        A
      </button>
      <button
        onClick={() =>
          context.dispatch((state) => ({ ...state, b: state.b + 1 }))
        }
      >
        B
      </button>
      <button
        onClick={() =>
          context.dispatch((state) => ({ ...state, c: state.c + 1 }))
        }
      >
        C
      </button>
    </div>
  );
};

// Observableのインスタンスを作成
const observable = new Observable<string>();

export default function StatePage() {
  function handleClick() {
    observable.notify("User clicked button!");
  }

  // function handleToggle() {
  //   observable.notify("User toggled switch!");
  // }

  function logger(data: string) {
    console.log(`${Date.now()} ${data}`);
  }

  function toastify(data: string) {
    console.log(`Toast: ${data}`);
    // toast(data, {
    //   position: toast.POSITION.BOTTOM_RIGHT,
    //   closeButton: false,
    //   autoClose: 2000,
    // });
  }

  observable.subscribe(logger);
  observable.subscribe(toastify);

  // ここから渡してる値が:initState。つまりa,b,c
  // const context = useCreateStoreContext<StateType>(() => ({
  //   a: 0,
  //   b: 10,
  //   c: 100,
  // }));
  const context = useGlobalStore();

  return (
    <div>
      <A context={context} />
      <B context={context} />
      <C context={context} />
      <Buttons context={context} />
      <Link to="/" children={"home"} />
      <br />
      <button onClick={handleClick}>observable</button>
    </div>
  );
}
