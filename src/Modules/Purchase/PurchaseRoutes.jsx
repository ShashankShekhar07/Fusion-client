// Modules/Purchase/PurchaseRoutes.jsx

import React from "react";
import { Route } from "react-router-dom";
import { Layout } from "../../components/layout";
import PurchaseNavbar from "./PurchaseNavbar";
import Inbox from "./Inbox";
import FiledIndents from "./FilledIndents.jsx";
import ViewIndentInbox from "./ViewIndentInbox.jsx";
import EmployeeViewFileIndent from "./EmployeeViewFileIndent";
import Archieved from "./ArchievedIndents";
import ViewIndent from "./ViewIndent";
import StockEntry from "./StockEntry";
import SavedIndents from "./SavedIndentes";
import Outbox from "./Outbox.jsx";
import { IndentForm } from "./IndentForm.jsx";
import NewForwardIndent from "./NewForwardIndent.jsx";

function PurchaseRoutes() {
  const commonWrapper = (Component) => (
    <Layout>
      <PurchaseNavbar />
      <div style={{ margin: "32px" }}>
        <Component />
      </div>
    </Layout>
  );

  return (
    <>
      <Route
        path="/purchase"
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
        path="/purchase/all_filed_indents"
        element={commonWrapper(FiledIndents)}
      />
      <Route path="/purchase/inbox" element={commonWrapper(Inbox)} />
      <Route
        path="/purchase/saved_indents"
        element={commonWrapper(SavedIndents)}
      />
      <Route
        path="/purchase/archieved_indents"
        element={commonWrapper(Archieved)}
      />
      <Route path="/purchase/outbox" element={commonWrapper(Outbox)} />
      <Route
        path="/purchase/forward_indent/:indentID"
        element={
          <Layout>
            <PurchaseNavbar />
            <NewForwardIndent />
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
    </>
  );
}

export default PurchaseRoutes;
