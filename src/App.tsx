
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Create a useEffect that checks localStorage on first load to reset goals daily
const resetDailyGoalsIfNeeded = () => {
  const today = new Date().toDateString();
  const lastResetDate = localStorage.getItem('last_goals_reset_date');
  
  if (lastResetDate !== today) {
    localStorage.setItem('last_goals_reset_date', today);
  }
};

// Call the function
resetDailyGoalsIfNeeded();

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/*" element={<Index />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
