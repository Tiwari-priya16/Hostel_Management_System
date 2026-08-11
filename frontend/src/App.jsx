import React from "react";
import { Routes, Route } from "react-router-dom";

import Login from "./pages/auth/login";
import Register from "./pages/auth/register";

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
import GiveFeedback from "./pages/feedback/GiveFeedback";
import FeedbackList from "./pages/feedback/FeedbackList";
import RequestTransfer from "./pages/roomTransfer/RequestTransfer";
import TransferHistory from "./pages/roomTransfer/TransferHistory";
import NoticeList from "./pages/notice/NoticeList";


import AdminComplaints from "./pages/admin/AdminComplaints";
import AdminLeaves from "./pages/admin/AdminLeaves";
import AdminVisitors from "./pages/admin/AdminVisitors";
import AdminFeedback from "./pages/admin/AdminFeedback";
import AdminNotice from "./pages/admin/AdminNotice";
import AdminLaundry from "./pages/admin/AdminLaundry";
import AdminTransfers from "./pages/admin/AdminTransfers";
import AdminUsers from "./pages/admin/AdminUsers";
import StudentsDetails from "./pages/admin/StudentsDetails";
import StaffDetails from "./pages/admin/StaffDetails";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Routes>
      {/* Authentication Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

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
      path="/feedback"
      element={
        <ProtectedRoute>
          <GiveFeedback />
        </ProtectedRoute>
      }
    />

    <Route
      path="/feedback/history"
      element={
        <ProtectedRoute>
          <FeedbackList />
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
      path="/admin/feedback"
      element={
        <ProtectedRoute>
          <AdminFeedback />
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



    </Routes>


  );
}

export default App;