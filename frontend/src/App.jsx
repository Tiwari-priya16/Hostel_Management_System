import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import ForgotPassword from "./pages/auth/ForgotPassword";

import AdminDashboard from "./pages/dashboard/AdminDashboard";
import StuDashboard from "./pages/dashboard/StuDashboard";
import StaffDashboard from "./pages/dashboard/StaffDashboard";
import RaiseComplaint from "./pages/complaint/RaiseComplaint";
import ComplaintList from "./pages/complaint/ComplaintList";
import LeaveHistory from "./pages/leave/LeaveHistory";
import ApplyLeave from "./pages/leave/ApplyLeave";
import Laundry from "./pages/laundry/Laundry";
import BookingHistory from "./pages/laundry/BookingHistory";
import AddVisitor from "./pages/visitor/AddVisitor";
import VisitorHistory from "./pages/visitor/VisitorHistory";
import RequestTransfer from "./pages/roomtransfer/RequestTransfer";
import TransferHistory from "./pages/roomtransfer/TransferHistory";
import NoticeList from "./pages/notice/NoticeList";


import AdminComplaints from "./pages/admin/AdminComplaints";
import AdminLeaves from "./pages/admin/AdminLeaves";
import AdminVisitors from "./pages/admin/AdminVisitors";
import AdminNotice from "./pages/admin/AdminNotice";
import AdminLaundry from "./pages/admin/AdminLaundry";
import AdminTransfers from "./pages/admin/AdminTransfers";
import AdminUsers from "./pages/admin/AdminUsers";
import StudentsDetails from "./pages/admin/StudentsDetails";
import StaffDetails from "./pages/admin/StaffDetails";
import AdminMess from "./pages/mess/AdminMess";
import StudentMess from "./pages/mess/StudentMess";
import Profile from "./pages/profile/Profile";
import EntryExit from "./pages/gate/EntryExit";
import AdminGateControl from "./pages/admin/AdminGateControl";
import AdminApprovals from "./pages/admin/AdminApprovals";
import CommunityHub from "./pages/community/CommunityHub";
import NotFound from "./pages/NotFound";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const location = useLocation();
  const isAuthPage = ["/", "/register", "/forgot-password"].includes(location.pathname);

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        className={`toast-container-main ${!isAuthPage ? "with-sidebar" : ""}`}
      />
      <Routes>
        {/* Authentication Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Dashboard Routes */}

        <Route
          path="/dashboard/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StuDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/staff"
          element={
            <ProtectedRoute allowedRoles={["staff", "warden"]}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/warden"
          element={
            <ProtectedRoute allowedRoles={["staff", "warden"]}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/complaints"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <RaiseComplaint />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-complaints"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <ComplaintList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leave"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <ApplyLeave />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-leaves"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <LeaveHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/laundry"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Laundry />
            </ProtectedRoute>
          }
        />

        <Route
          path="/laundry/history"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <BookingHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/visitors"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <AddVisitor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/visitors/history"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <VisitorHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/room-transfer"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <RequestTransfer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/room-transfer/history"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <TransferHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notices"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <NoticeList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/complaints"
          element={
            <ProtectedRoute allowedRoles={["admin", "warden", "staff"]}>
              <AdminComplaints />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/leaves"
          element={
            <ProtectedRoute allowedRoles={["admin", "warden"]}>
              <AdminLeaves />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/visitors"
          element={
            <ProtectedRoute allowedRoles={["admin", "warden"]}>
              <AdminVisitors />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/notices"
          element={
            <ProtectedRoute allowedRoles={["admin", "warden"]}>
              <AdminNotice />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/laundry"
          element={
            <ProtectedRoute allowedRoles={["admin", "warden"]}>
              <AdminLaundry />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/transfers"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminTransfers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users/students"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <StudentsDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users/staff"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <StaffDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/mess"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminMess />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mess"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <StudentMess />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/gate"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <EntryExit />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/gate"
          element={
            <ProtectedRoute allowedRoles={["admin", "warden"]}>
              <AdminGateControl />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/approvals"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminApprovals />
            </ProtectedRoute>
          }
        />

        <Route
          path="/community"
          element={
            <ProtectedRoute>
              <CommunityHub />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;