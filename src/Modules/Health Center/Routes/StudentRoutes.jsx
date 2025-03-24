import React from "react";
import { Routes, Route } from "react-router-dom";
import { Layout } from "../../../components/layout";
import HistoryPatient from "../Patient/History/HistoryPatient";
import Prescription from "../Patient/History/Prescription";
import Feedback from "../Patient/Feedback/feedback";
import Doctor from "../Patient/Schedule/Viewdoctor";
import Pathologist from "../Patient/Schedule/viewpath";
import Announcement from "../Patient/Announcements/Announcement";
import Apply from "../Patient/Medical Relief/Apply";
import Approval from "../Patient/Medical Relief/Approval";
import DoctorPath from "../Patient/Schedule/docpath";
import PathDoc from "../Patient/Schedule/pathologists";

export function StudentRoutes() {
  return (
    <Routes>
      <Route
        path="/history"
        element={
          <Layout>
            <HistoryPatient />
          </Layout>
        }
      />
      <Route
        path="/prescription/:id"
        element={
          <Layout>
            <Prescription />
          </Layout>
        }
      />
      <Route
        path="/feedback"
        element={
          <Layout>
            <Feedback />
          </Layout>
        }
      />
      <Route
        path="/schedule"
        element={
          <Layout>
            <Doctor />
          </Layout>
        }
      />
      <Route
        path="/schedule/doctors"
        element={
          <Layout>
            <DoctorPath />
          </Layout>
        }
      />
      <Route
        path="/schedule/viewpath"
        element={
          <Layout>
            <Pathologist />
          </Layout>
        }
      />
      <Route
        path="/schedule/pathologists"
        element={
          <Layout>
            <PathDoc />
          </Layout>
        }
      />
      <Route
        path="/announcements"
        element={
          <Layout>
            <Announcement />
          </Layout>
        }
      />
      <Route
        path="/medical-relief"
        element={
          <Layout>
            <Apply />
          </Layout>
        }
      />
      <Route
        path="/medical-relief/approval"
        element={
          <Layout>
            <Approval />
          </Layout>
        }
      />
    </Routes>
  );
}
