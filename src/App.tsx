import { Route, Routes } from "react-router-dom";
import Home from "./page/home";
import DndExamplePage from "./page/dnd-example-page";
import Article12page from "./page/article1-2";
import DatePickerPage from "./page/datePicker";
import Index from "./page";
import TypePage from "./page/typePage";
import Sample from "./page/switch";
import StatePage from "./page/state";
import { GlobalStoreProvider } from "./provider/StorePrivider";

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
        {/* /:id  スラ忘れない！ */}
        {/* <Route path="/article" element={<Article12page />}>
        <Route path="/article/:id" element={<Index />} />
        </Route> */}
        <Route path="/type" element={<TypePage />} />
        <Route path="/sample" element={<Sample />} />
      </Routes>
    </GlobalStoreProvider>
  );
}
