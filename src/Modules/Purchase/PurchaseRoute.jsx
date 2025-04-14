// src/routes/Routes.jsx
import { Routes, Route } from "react-router-dom";
import { Layout } from "../../components/layout";
import PurchaseNavbar from "./PurchaseNavbar";

import IndentForm from "./IndentForm";
import FiledIndents from "./FilledIndents";
import Inbox from "./Inbox";
import NewForwardIndent from "./NewForwardIndent";
import SavedIndents from "./SavedIndentes";
import Archieved from "./ArchievedIndents";
import Outbox from "./Outbox";
import ViewIndentInbox from "./ViewIndentInbox";
import ViewIndent from "./ViewIndent";
import EmployeeViewFileIndent from "./EmployeeViewFileIndent";
import StockEntry from "./StockEntry";

export default function PurchaseRoutes() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <PurchaseNavbar />
            <div style={{ margin: "32px" }}>
              <IndentForm />
            </div>
          </Layout>
        }
      />
      <Route
        path="/all_filed_indents"
        element={
          <Layout>
            <PurchaseNavbar />
            <div style={{ margin: "32px" }}>
              <FiledIndents />
            </div>
          </Layout>
        }
      />
      <Route
        path="/inbox"
        element={
          <Layout>
            <PurchaseNavbar />
            <div style={{ margin: "32px" }}>
              <Inbox />
            </div>
          </Layout>
        }
      />
      <Route
        path="/forward_indent/:indentID"
        element={
          <Layout>
            <PurchaseNavbar />
            <NewForwardIndent />
          </Layout>
        }
      />
      <Route
        path="/saved_indents"
        element={
          <Layout>
            <PurchaseNavbar />
            <div style={{ margin: "32px" }}>
              <SavedIndents />
            </div>
          </Layout>
        }
      />
      <Route
        path="/archieved_indents"
        element={
          <Layout>
            <PurchaseNavbar />
            <div style={{ margin: "32px" }}>
              <Archieved />
            </div>
          </Layout>
        }
      />
      <Route
        path="/outbox"
        element={
          <Layout>
            <PurchaseNavbar />
            <div style={{ margin: "32px" }}>
              <Outbox />
            </div>
          </Layout>
        }
      />
      <Route
        path="/viewindent/:indentID"
        element={
          <Layout>
            <PurchaseNavbar />
            <ViewIndentInbox />
          </Layout>
        }
      />
      <Route
        path="/viewsavedindent/:indentID"
        element={
          <Layout>
            <PurchaseNavbar />
            <ViewIndent />
          </Layout>
        }
      />
      <Route
        path="/employeeviewfiledindent/:indentID"
        element={
          <Layout>
            <PurchaseNavbar />
            <EmployeeViewFileIndent />
          </Layout>
        }
      />
      <Route
        path="/stock_entry"
        element={
          <Layout>
            <PurchaseNavbar />
            <StockEntry />
          </Layout>
        }
      />
    </Routes>
  );
}
