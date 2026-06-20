import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { ConverterPage } from "./pages/ConverterPage";
import { ErDiagramPage } from "./pages/ErDiagramPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="layout">
        <NavBar />
        <main className="content">
          <Routes>
            <Route path="/" element={<ConverterPage />} />
            <Route path="/er-diagram" element={<ErDiagramPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
