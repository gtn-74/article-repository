import { Route, Routes } from "react-router-dom";
import Index from "./page";
import Article12page from "./page/article1-2";
import DatePickerPage from "./page/datePicker";
import DndExamplePage from "./page/dnd-example-page";
import Home from "./page/home";
import StatePage from "./page/state";
import Sample from "./page/switch";
import TableDemoPage from "./page/table-demo";
import TypePage from "./page/typePage";
import { GlobalStoreProvider } from "./provider/StorePrivider";
import Prototype from "./utils/prototype";
import ObservableDemo from "./page/observable-demo";
import ObservableStockDemo from "./page/observable-stock-demo";
import ObservableFormDemo from "./page/observable-form-demo";
import RhfYupForm from "./page/rhf-yup-form";
import RhfZodForm from "./page/rhf-zod-form";

export default function App() {
  return (
    <GlobalStoreProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/state" element={<StatePage />} />
        <Route path="/date-picker" element={<DatePickerPage />} />
        <Route path="/dnd-example" element={<DndExamplePage />} />
        <Route path="/article" element={<Article12page />} />
        <Route path="/article/:id" element={<Index />} />
        <Route path="/type" element={<TypePage />} />
        <Route path="/sample" element={<Sample />} />
        <Route path="/table-demo" element={<TableDemoPage />} />
        <Route path="/prototype" element={<Prototype />} />
        <Route path="/observable-demo" element={<ObservableDemo />} />
        <Route path="/observable-stock-demo" element={<ObservableStockDemo />} />
        <Route path="/observable-form-demo" element={<ObservableFormDemo />} />
        <Route path="/rhf-yup-form" element={<RhfYupForm />} />
        <Route path="/rhf-zod-form" element={<RhfZodForm />} />
      </Routes>
    </GlobalStoreProvider>
  );
}
