import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import "mantine-react-table/styles.css";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Notifications } from "@mantine/notifications";
import { Layout } from "./components/layout";
import Dashboard from "./Modules/Dashboard/dashboardNotifications";
import Profile from "./Modules/Profile/profile";
import LoginPage from "./pages/login";
import ForgotPassword from "./pages/forgotPassword";
import AcademicPage from "./Modules/Academic/index";
import ValidateAuth from "./helper/validateauth";
// import PurchasePage from "./Modules/Purchase/purchase";
import PurchaseNavbar from "./Modules/Purchase/PurchaseNavbar";
import Inbox from "./Modules/Purchase/Inbox";
import IndentForm from "./Modules/Purchase/IndentForm";
import FiledIndents from "./Modules/Purchase/FilledIndents.jsx";
// import Outbox from "./Modules/Purchase/Outbox/Outbox";
import EmployeeViewFileIndent from "./Modules/Purchase/EmployeeViewFileIndent";
import Archieved from "./Modules/Purchase/ArchievedIndents";
import ViewIndent from "./Modules/Purchase/ViewIndent";
import StockEntry from "./Modules/Purchase/StockEntry";
import SavedIndents from "./Modules/Purchase/SavedIndentes";
import Outbox from "./Modules/Purchase/Outbox.jsx";
import ViewIndentInbox from "./Modules/Purchase/ViewIndentInbox.jsx";

export default function App() {
  const location = useLocation();
  return (
    <MantineProvider>
      <Notifications
        position="top-right"
        zIndex={1000}
        autoClose={2000}
        limit={1}
      />
      {location.pathname !== "/accounts/login" &&
        location.pathname !== "/reset-password" && <ValidateAuth />}
      <Routes>
        <Route path="/" element={<Navigate to="/accounts/login" replace />} />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/academics"
          element={
            <Layout>
              <AcademicPage />
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            <Layout>
              <Profile />
            </Layout>
          }
        />
        <Route
          path="/purchase"
          element={
            <Layout>
              <PurchaseNavbar />
              <IndentForm />
            </Layout>
          }
        />
        <Route
          path="/purchase/all_filed_indents"
          element={
            <Layout>
              <PurchaseNavbar />
              <FiledIndents />
            </Layout>
          }
        />
        <Route
          path="/purchase/inbox"
          element={
            <Layout>
              <PurchaseNavbar />
              <Inbox />
            </Layout>
          }
        />
        <Route
          path="/purchase/saved_indents"
          element={
            <Layout>
              <PurchaseNavbar />
              <SavedIndents />
            </Layout>
          }
        />
        <Route
          path="/purchase/archieved_indents"
          element={
            <Layout>
              <PurchaseNavbar />
              <Archieved />
            </Layout>
          }
        />
        {/* <Route
          path="/purchase/outbox"
          element={
            <Layout>
              <PurchaseNavbar />
              <Outbox />
            </Layout>
          }
        /> */}
        <Route
          path="/purchase/outbox"
          element={
            <Layout>
              <PurchaseNavbar />
              <Outbox />
            </Layout>
          }
        />
        <Route
          path="/purchase/viewindent/:indentID"
          element={
            <Layout>
              <PurchaseNavbar />
              <ViewIndentInbox />
            </Layout>
          }
        />
        <Route
          path="/purchase/viewsavedindent/:indentID"
          element={
            <Layout>
              <PurchaseNavbar />
              <ViewIndent />
            </Layout>
          }
        />
        <Route
          path="/purchase/employeeviewfiledindent/:indentID"
          element={
            <Layout>
              <PurchaseNavbar />
              <EmployeeViewFileIndent />
            </Layout>
          }
        />
        <Route
          path="/purchase/stock_entry"
          element={
            <Layout>
              <PurchaseNavbar />
              <StockEntry />
            </Layout>
          }
        />
        <Route path="/accounts/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ForgotPassword />} />
      </Routes>
    </MantineProvider>
  );
}
