import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { HomePage } from "./pages/HomePage";
import { OpsDashboardPage } from "./pages/OpsDashboardPage";
import { ApiCatalogPage } from "./pages/ApiCatalogPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { EvalAdvancedPage } from "./pages/EvalAdvancedPage";
import { EvalTaskDetailPage } from "./pages/EvalTaskDetailPage";
import "./App.css";

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <div className="layout">
        <NavBar />
        <main className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/ops" element={<OpsDashboardPage />} />
            <Route path="/apis" element={<ApiCatalogPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/eval/advanced" element={<EvalAdvancedPage />} />
            <Route path="/eval/advanced/:taskId" element={<EvalTaskDetailPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
