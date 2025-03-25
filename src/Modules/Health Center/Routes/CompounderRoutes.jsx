import React from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "../../../components/layout";
import HistoryCompounder from "../Compounder/History/HistoryComp";
import UpdatePatient from "../Compounder/History/UpdatePatient";
import CompPrescription from "../Compounder/History/CompPrescription";
import Viewdoctor from "../Compounder/Schedule/viewdoctor";
import Editdoctor from "../Compounder/Schedule/editdoctor";
import Viewpath from "../Compounder/Schedule/viewpath";
import Editpath from "../Compounder/Schedule/editpath";
import DoctorPath from "../Compounder/Doctor/docpath";
import Adddoctor from "../Compounder/Doctor/adddoctor";
import Removedoctor from "../Compounder/Doctor/removedoctor";
import PathDoc from "../Compounder/Doctor/pathologists";
import Addpath from "../Compounder/Doctor/addpath";
import Removepath from "../Compounder/Doctor/removepathologist";
import FeedbackTable from "../Compounder/Feedback/feedback";
import CompAnnounements from "../Compounder/Announcement/Announements";
import Inbox from "../Compounder/Medical Relief/Inbox";
import Application from "../Compounder/Medical Relief/Application";
import Record from "../Compounder/Announcement/Record";
import AddStock from "../Compounder/Stocks/AddStock";
import AddMedicine from "../Compounder/Stocks/AddMedicine";
import EditThreshold from "../Compounder/Stocks/EditThreshold";
import ExpiredMedicine from "../Compounder/Stocks/ExpiredMedicine";
import ViewStock from "../Compounder/Stocks/ViewStock";
import RequiredMedicine from "../Compounder/Stocks/RequiredMedicine";

export function CompounderRoutes() {
  return (
    <Routes>
      <Route
        path="/patient-log/history"
        element={
          <Layout>
            <HistoryCompounder />
          </Layout>
        }
      />
      <Route
        path="patient-log"
        element={
          <Layout>
            <UpdatePatient />
          </Layout>
        }
      />
      <Route
        path="/prescription/:id"
        element={
          <Layout>
            <CompPrescription />
          </Layout>
        }
      />
      <Route
        path="/manage-stock"
        element={
          <Layout>
            <AddStock />
          </Layout>
        }
      />
      <Route
        path="/manage-stock/addmedicine"
        element={
          <Layout>
            <AddMedicine />
          </Layout>
        }
      />
      <Route
        path="/manage-stock/editthreshold"
        element={
          <Layout>
            <EditThreshold />
          </Layout>
        }
      />
      <Route
        path="/manage-stock/expiredmedicine"
        element={
          <Layout>
            <ExpiredMedicine />
          </Layout>
        }
      />
      <Route
        path="/manage-stock/viewstock"
        element={
          <Layout>
            <ViewStock />
          </Layout>
        }
      />
      <Route
        path="/manage-stock/requiredmedicine"
        element={
          <Layout>
            <RequiredMedicine />
          </Layout>
        }
      />
      <Route
        path="/schedule"
        element={
          <Layout>
            <Viewdoctor />
          </Layout>
        }
      />
      <Route
        path="/schedule/editdoctor"
        element={
          <Layout>
            <Editdoctor />
          </Layout>
        }
      />
      <Route
        path="/schedule/viewpath"
        element={
          <Layout>
            <Viewpath />
          </Layout>
        }
      />
      <Route
        path="/schedule/editpath"
        element={
          <Layout>
            <Editpath />
          </Layout>
        }
      />
      <Route
        path="/docpath"
        element={
          <Layout>
            <DoctorPath />
          </Layout>
        }
      />
      <Route
        path="/docpath/adddoctor"
        element={
          <Layout>
            <Adddoctor />
          </Layout>
        }
      />
      <Route
        path="/docpath/removedoctor"
        element={
          <Layout>
            <Removedoctor />
          </Layout>
        }
      />
      <Route
        path="/docpath/pathologists"
        element={
          <Layout>
            <PathDoc />
          </Layout>
        }
      />
      <Route
        path="/docpath/addpath"
        element={
          <Layout>
            <Addpath />
          </Layout>
        }
      />
      <Route
        path="/docpath/removepath"
        element={
          <Layout>
            <Removepath />
          </Layout>
        }
      />
      <Route
        path="/feedback"
        element={
          <Layout>
            <FeedbackTable />
          </Layout>
        }
      />
      <Route
        path="/announcement"
        element={
          <Layout>
            <CompAnnounements />
          </Layout>
        }
      />
      <Route
        path="/announcement/record"
        element={
          <Layout>
            <Record />
          </Layout>
        }
      />
      <Route
        path="/medical-relief/inbox"
        element={
          <Layout>
            <Inbox />
          </Layout>
        }
      />
      <Route
        path="/medical-relief/application"
        element={
          <Layout>
            <Application />
          </Layout>
        }
      />
      <Route
        path="/medical-relief/application/:id"
        element={
          <Layout>
            <Application />
          </Layout>
        }
      />
    </Routes>
  );
}
