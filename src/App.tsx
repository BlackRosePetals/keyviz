import "./App.css";

import { Suspense, lazy } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/theme-provider";
import Visualization from "./pages/visualization";

const Settings = lazy(() => import("./pages/settings"));

function App() {
  return (
    <HashRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<Visualization />} />
          <Route path="/settings" element={<ThemeProvider><Settings /></ThemeProvider>} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}

export default App;
