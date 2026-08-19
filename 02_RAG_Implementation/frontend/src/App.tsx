import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Documents from "./pages/Documents";
import History from "./pages/History";
import Bookmarks from "./pages/Bookmarks";
import Settings from "./pages/Settings";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/history" element={<History />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;