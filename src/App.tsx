import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "./pages/NotFound";
import "./lib/firebase";
import Aura from "./pages/Aura";
import { AuraProvider } from "./context/AuraContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuraProvider>
        <Routes>
          <Route path="/" element={<Aura />} />
          <Route path="/aura" element={<Aura />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuraProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
