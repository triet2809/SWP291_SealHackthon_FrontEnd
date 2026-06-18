import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout
import DashboardLayout from '../components/layout/DashboardLayout';

// Auth Pages
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import PendingApproval from '../pages/auth/PendingApproval';

// Team Pages
import TeamDashboard from '../pages/team/TeamDashboard';
import MyTeam from '../pages/team/MyTeam';
import TeamMembers from '../pages/team/TeamMembers';
import SubmissionManagement from '../pages/team/SubmissionManagement';
import SubmissionHistory from '../pages/team/SubmissionHistory';
import NoticeBoard from '../pages/team/NoticeBoard';
import DeadlinesSchedule from '../pages/team/DeadlinesSchedule';
import Profile from '../pages/team/Profile';
import ComingSoon from '../pages/ComingSoon';

// Mentor Pages
import MentorDashboard from '../pages/mentor/MentorDashboard';
import AssignedCategories from '../pages/mentor/AssignedCategories';
import AssignedTeams from '../pages/mentor/AssignedTeams';
import TeamDetails from '../pages/mentor/TeamDetails';
import SubmissionReview from '../pages/mentor/SubmissionReview';
import FeedbackCenter from '../pages/mentor/FeedbackCenter';
import MentorNoticeBoard from '../pages/mentor/MentorNoticeBoard';
import MentorProfile from '../pages/mentor/MentorProfile';

import JudgeDashboard from '../pages/judge/JudgeDashboard';
import AssignedSubmissions from '../pages/judge/AssignedSubmissions';
import ScoringInterface from '../pages/judge/ScoringInterface';
import ViewEvaluation from '../pages/judge/ViewEvaluation';
import JudgeNoticeBoard from '../pages/judge/JudgeNoticeBoard';
import JudgeProfile from '../pages/judge/JudgeProfile';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pending-approval" element={<PendingApproval />} />
        
        {/* Team Routes */}
        <Route path="/team" element={<DashboardLayout role="team" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<TeamDashboard />} />
          <Route path="my-team" element={<MyTeam />} />
          <Route path="members" element={<TeamMembers />} />
          <Route path="submissions" element={<SubmissionManagement />} />
          <Route path="history" element={<SubmissionHistory />} />
          <Route path="notices" element={<NoticeBoard />} />
          <Route path="schedule" element={<DeadlinesSchedule />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Mentor Routes */}
        <Route path="/mentor" element={<DashboardLayout role="mentor" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<MentorDashboard />} />
          <Route path="categories" element={<AssignedCategories />} />
          <Route path="teams" element={<AssignedTeams />} />
          <Route path="team-details" element={<TeamDetails />} />
          <Route path="review" element={<SubmissionReview />} />
          <Route path="feedback" element={<FeedbackCenter />} />
          <Route path="notices" element={<MentorNoticeBoard />} />
          <Route path="profile" element={<MentorProfile />} />
        </Route>

        {/* Judge Routes */}
        <Route path="/judge" element={<DashboardLayout role="judge" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<JudgeDashboard />} />
          <Route path="submissions" element={<AssignedSubmissions />} />
          <Route path="evaluate" element={<ScoringInterface />} />
          <Route path="view-evaluation" element={<ViewEvaluation />} />
          <Route path="notices" element={<JudgeNoticeBoard />} />
          <Route path="profile" element={<JudgeProfile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
