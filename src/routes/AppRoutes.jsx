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
import TrackTopic from '../pages/team/TrackTopic';
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
import CreateMentorIncidentReport from '../pages/mentor/CreateIncidentReport';

import JudgeDashboard from '../pages/judge/JudgeDashboard';
import AssignedSubmissions from '../pages/judge/AssignedSubmissions';
import ScoringInterface from '../pages/judge/ScoringInterface';
import ViewEvaluation from '../pages/judge/ViewEvaluation';
import JudgeNoticeBoard from '../pages/judge/JudgeNoticeBoard';
import JudgeProfile from '../pages/judge/JudgeProfile';
import CreateJudgeIncidentReport from '../pages/judge/CreateIncidentReport';

// Coordinator Pages
import CoordinatorDashboard from '../pages/coordinator/CoordinatorDashboard';
import EventManagement from '../pages/coordinator/EventManagement';
import RoundManagement from '../pages/coordinator/RoundManagement';
import CategoryManagement from '../pages/coordinator/CategoryManagement';
import TeamManagement from '../pages/coordinator/TeamManagement';
import RecordTeam from '../pages/coordinator/RecordTeam';
import SubmissionManagementCoordinator from '../pages/coordinator/SubmissionManagement';
import MentorManagement from '../pages/coordinator/MentorManagement';
import JudgeManagementCoordinator from '../pages/coordinator/JudgeManagement';
import UserApproval from '../pages/coordinator/UserApproval';
import CriteriaManagement from '../pages/coordinator/CriteriaManagement';
import RankingManagement from '../pages/coordinator/RankingManagement';
import AwardsManagement from '../pages/coordinator/AwardsManagement';
import IncidentReports from '../pages/coordinator/IncidentReports';
import IncidentReportDetail from '../pages/coordinator/IncidentReportDetail';
import Reports from '../pages/coordinator/Reports';
import AuditLogs from '../pages/coordinator/AuditLogs';
import CoordinatorProfile from '../pages/coordinator/CoordinatorProfile';

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
          <Route path="topic" element={<TrackTopic />} />
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
          <Route path="incidents/create" element={<CreateMentorIncidentReport />} />
          <Route path="profile" element={<MentorProfile />} />
        </Route>

        {/* Judge Routes */}
        <Route path="/judge" element={<DashboardLayout role="judge" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<JudgeDashboard />} />
          <Route path="submissions" element={<AssignedSubmissions />} />
          <Route path="score/:id" element={<ScoringInterface />} />
          <Route path="view-evaluation/:id" element={<ViewEvaluation />} />
          <Route path="notices" element={<JudgeNoticeBoard />} />
          <Route path="incidents/create" element={<CreateJudgeIncidentReport />} />
          <Route path="profile" element={<JudgeProfile />} />
        </Route>

        {/* Coordinator Routes */}
        <Route path="/coordinator" element={<DashboardLayout role="coordinator" />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<CoordinatorDashboard />} />
          <Route path="events" element={<EventManagement />} />
          <Route path="rounds" element={<RoundManagement />} />
          <Route path="categories" element={<CategoryManagement />} />
          <Route path="teams" element={<TeamManagement />} />
          <Route path="teams/record" element={<RecordTeam />} />
          <Route path="submissions" element={<SubmissionManagementCoordinator />} />
          <Route path="mentors" element={<MentorManagement />} />
          <Route path="judges" element={<JudgeManagementCoordinator />} />
          <Route path="users" element={<UserApproval />} />
          <Route path="criteria" element={<CriteriaManagement />} />
          <Route path="rankings" element={<RankingManagement />} />
          <Route path="awards" element={<AwardsManagement />} />
          <Route path="incidents" element={<IncidentReports />} />
          <Route path="incidents/:id" element={<IncidentReportDetail />} />
          <Route path="reports" element={<Reports />} />
          <Route path="logs" element={<AuditLogs />} />
          <Route path="profile" element={<CoordinatorProfile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
