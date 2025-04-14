import { MantineProvider, createTheme } from "@mantine/core";
import { Suspense, lazy } from "react";
import { useSelector } from "react-redux";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { Notifications } from "@mantine/notifications";
import { Layout } from "./components/layout";
import InventoryIndex from "./Modules/Inventory/components/InventoryIndex";
import PurchaseRoutes from "./Modules/Purchase/PurchaseRoute.jsx";

// eslint-disable-next-line import/no-unresolved
import { DesignationsProvider } from "./Modules/Iwd/helper/designationContext";
import UserBreadcrumbs from "./Modules/Scholarship/user/components/UserBreadcumbs";
import OtherAcadProcedures from "./Modules/Otheracademic/OtherAcademicProcedures";

const PlacementCellPage = lazy(() => import("./Modules/PlacementCell"));
const JobApplicationForm = lazy(
  () => import("./Modules/PlacementCell/ApplyForPlacementForm"),
);
const PlacementEventHandeling = lazy(
  () => import("./Modules/PlacementCell/components/PlacementEventHandeling"),
);
const ApplicationStatusTimeline = lazy(
  () => import("./Modules/PlacementCell/components/Timeline"),
);

const HealthCenter = lazy(() => import("./Modules/Health Center"));
const ConvenorBreadcumbs = lazy(
  () => import("./Modules/Scholarship/convenor/components/ConvenorBreadcumbs"),
);
const HostelPage = lazy(() => import("./Modules/Hostel-Management/index"));
const IwdModule = lazy(() => import("./Modules/Iwd/index"));

const Dashboard = lazy(
  () => import("./Modules/Dashboard/dashboardNotifications"),
);
const ComplaintSystem = lazy(
  () => import("./Modules/ComplaintManagement/index"),
);
const Profile = lazy(
  () => import("./Modules/Dashboard/StudentProfile/profilePage"),
);
const LoginPage = lazy(() => import("./pages/login"));
const ForgotPassword = lazy(() => import("./pages/forgotPassword"));
const AcademicPage = lazy(() => import("./Modules/Academic/index"));
const ValidateAuth = lazy(() => import("./helper/validateauth"));
const HR = lazy(() => import("./Modules/HR/index"));
const MessPage = lazy(() => import("./Modules/Mess/pages/index"));
const FileTracking = lazy(() => import("./Modules/FileTracking"));
const ResearchProjects = lazy(() => import("./Modules/RSPC/researchProjects"));
const RequestForms = lazy(() => import("./Modules/RSPC/requestForms"));
const VisitorsContent = lazy(
  () => import("./Modules/Visitors_Hostel/visitorsContent"),
);
const CancellationRequest = lazy(
  () => import("./Modules/Visitors_Hostel/cancellationRequest"),
);
const BookingForm = lazy(() => import("./Modules/Visitors_Hostel/bookingForm"));
const Bookings = lazy(() => import("./Modules/Visitors_Hostel/bookings"));
const ActiveBookingsPage = lazy(
  () => import("./Modules/Visitors_Hostel/activeBookings"),
);
const CompletedBookingsPage = lazy(
  () => import("./Modules/Visitors_Hostel/completedBookings"),
);
const VHGuidelinesPage = lazy(
  () => import("./Modules/Visitors_Hostel/vhGuidelines"),
);
const InventoryManagement = lazy(
  () => import("./Modules/Visitors_Hostel/inventory"),
);
const RoomsAvailibility = lazy(
  () => import("./Modules/Visitors_Hostel/roomsAvailability"),
);
const AccountStatemnts = lazy(
  () => import("./Modules/Visitors_Hostel/accountStatements"),
);
const FacultyProfessionalProfile = lazy(
  () =>
    import("./Modules/facultyProfessionalProfile/facultyProfessionalProfile"),
);

const InactivityHandler = lazy(() => import("./helper/inactivityhandler"));
const DepartmentPage = lazy(
  () => import("./Modules/Department/DepartmentDashboard"),
);

const GymkhanaDashboard = lazy(
  () => import("./Modules/Gymkhana/GymkhanaDashboard.jsx"),
);

const Examination = lazy(() => import("./Modules/Examination/examination"));

const ProgrammeCurriculumRoutes = lazy(
  () => import("./Modules/Program_curriculum/programmCurriculum"),
);

const theme = createTheme({
  breakpoints: { xs: "30em", sm: "48em", md: "64em", lg: "74em", xl: "90em" },
});

export default function App() {
  const location = useLocation();
  const role = useSelector((state) => state.user.role);
  return (
    <MantineProvider theme={theme}>
      <Notifications position="top-center" autoClose={2000} limit={1} />
      {location.pathname !== "/accounts/login" && <ValidateAuth />}
      {location.pathname !== "/accounts/login" && <InactivityHandler />}

      <Routes>
        <Route path="/" element={<Navigate to="/accounts/login" replace />} />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Suspense fallback={<div>Loading .... </div>}>
                <Dashboard />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/academics"
          element={
            <Layout>
              <Suspense fallback={<div>Loading .... </div>}>
                <AcademicPage />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/programme_curriculum/*"
          element={
            <Layout>
              <Suspense fallback={<div>Loading .... </div>}>
                <ProgrammeCurriculumRoutes />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/hr/*"
          element={
            <Layout>
              <Suspense fallback={<div>Loading .... </div>}>
                <HR />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/examination/*"
          element={
            <Layout>
              <Suspense fallback={<div>Loading .... </div>}>
                <Examination />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/mess"
          element={
            <Layout>
              <Suspense fallback={<div>Loading .... </div>}>
                <MessPage />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/placement-cell"
          element={
            <Layout>
              <Suspense fallback={<div>Loading .... </div>}>
                <PlacementCellPage />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/placement-cell/apply-placement"
          element={
            <Layout>
              <Suspense fallback={<div>Loading .... </div>}>
                <JobApplicationForm />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/placement-cell/view"
          element={
            <Layout>
              <Suspense fallback={<div>Loading .... </div>}>
                <PlacementEventHandeling />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/placement-cell/timeline"
          element={
            <Layout>
              <Suspense fallback={<div>Loading .... </div>}>
                <ApplicationStatusTimeline />
              </Suspense>
            </Layout>
          }
        />

        <Route
          path="/inventory"
          element={
            <Layout>
              <InventoryIndex />
            </Layout>
          }
        />

        <Route
          path="/profile"
          element={
            <Layout>
              <Suspense fallback={<div>Loading .... </div>}>
                <Profile />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/filetracking"
          element={
            <Layout>
              <Suspense fallback={<div>Loading .... </div>}>
                <FileTracking />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/visitors_hostel"
          element={
            <Layout>
              <Suspense fallback={<div>Loading .... </div>}>
                <VisitorsContent />
                <Bookings />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/visitors_hostel/cancel_request"
          element={
            <Layout>
              <Suspense fallback={<div>Loading .... </div>}>
                <VisitorsContent />
                <CancellationRequest />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/visitors_hostel/active_bookings"
          element={
            <Layout>
              <Suspense fallback={<div>Loading .... </div>}>
                <VisitorsContent />
                <ActiveBookingsPage />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/visitors_hostel/completed_bookings"
          element={
            <Layout>
              <Suspense fallback={<div>Loading .... </div>}>
                <VisitorsContent />
                <CompletedBookingsPage />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/visitors_hostel/booking-form"
          element={
            <Layout>
              <Suspense fallback={<div>Loading .... </div>}>
                {" "}
                <VisitorsContent />
                <BookingForm />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/visitors_hostel/room-availability"
          element={
            <Layout>
              <Suspense fallback={<div>Loading .... </div>}>
                <VisitorsContent />
                <RoomsAvailibility />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/visitors_hostel/mess-record"
          element={
            <Layout>
              <Suspense fallback={<div>Loading .... </div>}>
                <VisitorsContent />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/visitors_hostel/inventory"
          element={
            <Layout>
              <Suspense fallback={<div>Loading .... </div>}>
                <VisitorsContent />
                <InventoryManagement />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/visitors_hostel/account-statement"
          element={
            <Layout>
              <Suspense fallback={<div>Loading .... </div>}>
                <VisitorsContent />
                <AccountStatemnts />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/visitors_hostel/rules"
          element={
            <Layout>
              <Suspense fallback={<div>Loading .... </div>}>
                <VisitorsContent />
                <VHGuidelinesPage />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/facultyprofessionalprofile/*"
          element={
            <Layout>
              <Suspense fallback={<div>Loading .... </div>}>
                <FacultyProfessionalProfile />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/complaints"
          element={
            <Layout>
              <Suspense fallback={<div>Loading .... </div>}>
                <ComplaintSystem />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/department"
          element={
            <Layout>
              <Suspense fallback={<div>Loading .... </div>}>
                <DepartmentPage />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/hostel"
          element={
            <Layout>
              <Suspense fallback={<div>Loading .... </div>}>
                <HostelPage />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/iwd"
          element={
            <DesignationsProvider>
              <Layout>
                <Suspense fallback={<div>Loading .... </div>}>
                  <IwdModule />
                </Suspense>
              </Layout>
            </DesignationsProvider>
          }
        />
        <Route
          path="/research"
          element={
            <Layout>
              <Suspense fallback={<div>Loading .... </div>}>
                <ResearchProjects />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/research/forms"
          element={
            <Layout>
              <Suspense fallback={<div>Loading .... </div>}>
                <RequestForms />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/facultyprofessionalprofile/*"
          element={
            <Layout>
              <Suspense fallback={<div>Loading .... </div>}>
                <FacultyProfessionalProfile />
              </Suspense>
            </Layout>
          }
        />

        <Route
          path="/scholarship"
          element={
            <Layout>
              <Suspense fallback={<div>Loading .... </div>}>
                {role === "spacsconvenor" && <ConvenorBreadcumbs />}
                {role === "student" && <UserBreadcrumbs />}
                {role === "spacsassistant" && <ConvenorBreadcumbs />}
              </Suspense>
            </Layout>
          }
        />

        <Route path="/healthcenter/*" element={<HealthCenter />} />
        <Route path="/purchase/*" element={<PurchaseRoutes />} />
        <Route path="/accounts/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ForgotPassword />} />
        <Route
          path="/GymKhana"
          element={
            <Layout>
              <Suspense fallback={<div>Loading .... </div>}>
                <GymkhanaDashboard />
              </Suspense>
            </Layout>
          }
        />
        <Route
          path="/otherAcadProcedures"
          element={
            <Layout>
              <Suspense fallback={<div>Loading .... </div>}>
                <OtherAcadProcedures />
              </Suspense>
            </Layout>
          }
        />
      </Routes>
    </MantineProvider>
  );
}
