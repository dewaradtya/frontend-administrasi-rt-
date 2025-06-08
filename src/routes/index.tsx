import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import DashboardPage from "../pages/Dashboard";
import ResidentsPage from "../pages/Residents";
import CreateResidentPage from "../pages/Residents/create";
import HousesPage from "../pages/Houses";
import CreateHousePage from "../pages/Houses/create";
import PaymentsPage from "../pages/Payments";
import ExpensesPage from "../pages/Expenses";
import CreateExpensePage from "../pages/Expenses/create";
import CreatePaymentPage from "../pages/Payments/create";
import EditHousePage from "../pages/Houses/edit";
import EditExpensePage from "../pages/Expenses/edit";
import EditResidentPage from "../pages/Residents/edit";
import EditPaymentPage from "../pages/Payments/edit";
import HouseDetailPage from "../pages/Houses/Detail";
import EditInhabitantHistoriesPage from "../pages/Houses/Detail/edit";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="residents" element={<ResidentsPage />} />
        <Route path="residents/create" element={<CreateResidentPage />} />
        <Route path="/residents/:id/edit" element={<EditResidentPage />} />
        <Route path="houses" element={<HousesPage />} />
        <Route path="houses/create" element={<CreateHousePage />} />
        <Route path="/houses/:id/edit" element={<EditHousePage />} />
        <Route path="/houses/:id" element={<HouseDetailPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="payments/create" element={<CreatePaymentPage />} />
        <Route path="/payments/:id/edit" element={<EditPaymentPage />} />
        <Route path="expenses" element={<ExpensesPage />} />
        <Route path="expenses/create" element={<CreateExpensePage />} />
        <Route path="/expenses/:id/edit" element={<EditExpensePage />} />
        <Route path="/inhabitant-histories/:id/edit" element={<EditInhabitantHistoriesPage />} />
      </Route>
    </Routes>
  );
}
