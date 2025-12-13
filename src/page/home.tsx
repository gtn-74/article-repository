import { Link } from "react-router-dom";
import { useSelector } from "../hooks/useSyncExternalStore";
import { useGlobalStore } from "../provider/StorePrivider";

export default function Home() {
  const params = 555;
  console.log(params);

  const context = useGlobalStore();
  const valueA = useSelector(context, (state) => state.a);

  return (
    <>
      <h1>home</h1>
      <Link to="/date-picker" children={"date-picker"} />
      <br />
      <Link to="/dnd-example" children={"dnd-example"} />
      <br />
      <Link to={`/article`} children={"articleTop"} />
      <br />
      <Link to={`article/${params}`} children={"articleChildren"} />
      <br />
      <Link to={`/sample`} children={"sample"} />
      <br />
      <Link to={`/state`} children={"state"} />
      <br />
      <Link to={`/prototype`} children={"prototype"} />
      <br />
      <Link to={`/observable-demo`} children={"observable-demo"} />
      <br />
      <Link to={`/observable-stock-demo`} children={"observable-stock-demo"} />
      <br />
      <Link to={`/observable-form-demo`} children={"observable-form-demo"} />
      <br />
      <Link to={`/rhf-yup-form`} children={"React Hook Form + Yup"} />
      <br />
      <Link to={`/rhf-zod-form`} children={"React Hook Form + Zod"} />
      <p>A:{valueA}</p>

      <h2>Observable</h2>
      {/* <button onClick={handleClick}>Click me!</button> */}
    </>
  );
}

// useSyncExternalStore
// import { useSyncExternalStore } from "react";
// import { useSelector } from "../store/useSyncExternalStore";

// function getSnapshot() {
//   return window.innerWidth;
// }

// function subscribe(callback: () => void) {
//   window.addEventListener("resize", callback);

//   return () => window.removeEventListener("resize", callback);
// }

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// const Root = () => {
//   const innerWidth = useSyncExternalStore(subscribe, getSnapshot);

//   return <div>innerWidth: {innerWidth}</div>;
// };
