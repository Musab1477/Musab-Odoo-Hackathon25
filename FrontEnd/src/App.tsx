import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import EquipmentList from "./pages/EquipmentList";
import EquipmentDetail from "./pages/EquipmentDetail";
import KanbanBoard from "./pages/KanbanBoard";
import CalendarView from "./pages/CalendarView";
import Teams from "./pages/Teams";
import RequestForm from "./pages/RequestForm";
import RequestDetail from "./pages/RequestDetail";
import Workcenters from "./pages/Workcenters";
import Categories from "./pages/Categories";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Employees from "./pages/Employees";
import Technicians from "./pages/Technicians";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/equipment" element={<EquipmentList />} />
          <Route path="/equipment/:id" element={<EquipmentDetail />} />
          <Route path="/equipment/:id/requests" element={<EquipmentDetail />} />
          <Route path="/workcenters" element={<Workcenters />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/users/employees" element={<Employees />} />
          <Route path="/users/technicians" element={<Technicians />} />
          <Route path="/requests" element={<KanbanBoard />} />
          <Route path="/requests/new" element={<RequestForm />} />
          <Route path="/requests/edit/:id" element={<RequestForm />} />
          <Route path="/requests/:id" element={<RequestDetail />} />
          <Route path="/calendar" element={<CalendarView />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
