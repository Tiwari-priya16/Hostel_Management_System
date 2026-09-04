import React from "react";
import { Routes, Route } from "react-router-dom";
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
import RequestTransfer from "./pages/roomTransfer/RequestTransfer";
import TransferHistory from "./pages/roomTransfer/TransferHistory";
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
import CommunityHub from "./pages/community/CommunityHub";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
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
            <ProtectedRoute>
              <StuDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/staff"
          element={
            <ProtectedRoute>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/warden"
          element={
            <ProtectedRoute>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/complaints"
          element={
            <ProtectedRoute>
              <RaiseComplaint />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-complaints"
          element={
            <ProtectedRoute>
              <ComplaintList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leave"
          element={
            <ProtectedRoute>
              <ApplyLeave />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-leaves"
          element={
            <ProtectedRoute>
              <LeaveHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/laundry"
          element={
            <ProtectedRoute>
              <Laundry />
            </ProtectedRoute>
          }
        />

        <Route
          path="/laundry/history"
          element={
            <ProtectedRoute>
              <BookingHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/visitors"
          element={
            <ProtectedRoute>
              <AddVisitor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/visitors/history"
          element={
            <ProtectedRoute>
              <VisitorHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/room-transfer"
          element={
            <ProtectedRoute>
              <RequestTransfer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/room-transfer/history"
          element={
            <ProtectedRoute>
              <TransferHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notices"
          element={
            <ProtectedRoute>
              <NoticeList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/complaints"
          element={
            <ProtectedRoute>
              <AdminComplaints />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/leaves"
          element={
            <ProtectedRoute>
              <AdminLeaves />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/visitors"
          element={
            <ProtectedRoute>
              <AdminVisitors />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/notices"
          element={
            <ProtectedRoute>
              <AdminNotice />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/laundry"
          element={
            <ProtectedRoute>
              <AdminLaundry />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/transfers"
          element={
            <ProtectedRoute>
              <AdminTransfers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users/students"
          element={
            <ProtectedRoute>
              <StudentsDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users/staff"
          element={
            <ProtectedRoute>
              <StaffDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/mess"
          element={
            <ProtectedRoute>
              <AdminMess />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mess"
          element={
            <ProtectedRoute>
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
            <ProtectedRoute>
              <EntryExit />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/gate"
          element={
            <ProtectedRoute>
              <AdminGateControl />
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
      </Routes>
    </>
  );
}

export default App;