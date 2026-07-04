import { apiDelete, apiDownload, apiGet, apiPatch, apiPost } from './client';

export async function getEvents(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await apiGet(`/events${qs ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to load events');
  return res.data;
}

export async function getEvent(id) {
  const res = await apiGet(`/events/${id}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to load event');
  return res.data;
}

export async function createEvent(payload) {
  const res = await apiPost('/events', payload);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to create event');
  return res.data;
}

export async function updateEvent(id, payload) {
  const res = await apiPatch(`/events/${id}`, payload);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to update event');
  return res.data;
}

export async function openEventRegistration(id) {
  const res = await apiPost(`/events/${id}/open-registration`, {});
  if (!res.ok) throw new Error(res.data?.message || 'Failed to open registration');
  return res.data;
}

export async function closeEventRegistration(id) {
  const res = await apiPost(`/events/${id}/close-registration`, {});
  if (!res.ok) throw new Error(res.data?.message || 'Failed to close registration');
  return res.data;
}

export async function setupCompetition(id, payload) {
  const res = await apiPost(`/events/${id}/setup-competition`, payload);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to set up competition');
  return res.data;
}

export async function changeEventStatus(id, status) {
  const res = await apiPost(`/events/${id}/status`, { status });
  if (!res.ok) throw new Error(res.data?.message || 'Failed to change event status');
  return res.data;
}

export async function deleteEvent(id) {
  const res = await apiDelete(`/events/${id}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to delete event');
}

export async function getTracks(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await apiGet(`/tracks${qs ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to load tracks');
  return res.data;
}

export async function getTrack(id) {
  const res = await apiGet(`/tracks/${id}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to load track');
  return res.data;
}

export async function createTrack(payload) {
  const res = await apiPost('/tracks', payload);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to create track');
  return res.data;
}

export async function updateTrack(id, payload) {
  const res = await apiPatch(`/tracks/${id}`, payload);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to update track');
  return res.data;
}

export async function deleteTrack(id) {
  const res = await apiDelete(`/tracks/${id}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to delete track');
}

export async function getRounds(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await apiGet(`/rounds${qs ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to load rounds');
  return res.data;
}

export async function createRound(payload) {
  const res = await apiPost('/rounds', payload);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to create round');
  return res.data;
}

export async function updateRound(id, payload) {
  const res = await apiPatch(`/rounds/${id}`, payload);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to update round');
  return res.data;
}

export async function deleteRound(id) {
  const res = await apiDelete(`/rounds/${id}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to delete round');
}

export async function getTrackMentors(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await apiGet(`/track-mentors${qs ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to load track mentors');
  return res.data;
}

export async function assignTrackMentor(payload) {
  const res = await apiPost('/track-mentors', payload);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to assign track mentor');
  return res.data;
}

export async function deleteTrackMentor(id) {
  const res = await apiDelete(`/track-mentors/${id}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to remove track mentor');
}

export async function getRoundJudges(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await apiGet(`/round-judges${qs ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to load round judges');
  return res.data;
}

export async function assignRoundJudge(payload) {
  const res = await apiPost('/round-judges', payload);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to assign round judge');
  return res.data;
}

export async function deleteRoundJudge(id) {
  const res = await apiDelete(`/round-judges/${id}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to remove round judge');
}

export async function getTrackJudges(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await apiGet(`/track-judges${qs ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to load track judges');
  return res.data;
}

export async function assignTrackJudge(payload) {
  const res = await apiPost('/track-judges', payload);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to assign track judge');
  return res.data;
}

export async function deleteTrackJudge(id) {
  const res = await apiDelete(`/track-judges/${id}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to remove track judge');
}

export async function getTeams(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await apiGet(`/teams${qs ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to load teams');
  return res.data;
}

export async function getTeam(id) {
  const res = await apiGet(`/teams/${id}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to load team');
  return res.data;
}

export async function getMyTeams() {
  const res = await apiGet('/teams/me');
  if (!res.ok) throw new Error(res.data?.message || 'Failed to load my teams');
  return res.data;
}

export async function createTeam(payload) {
  const res = await apiPost('/teams', payload);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to create team');
  return res.data;
}

export async function updateTeam(id, payload) {
  const res = await apiPatch(`/teams/${id}`, payload);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to update team');
  return res.data;
}

export async function moveTeamTrack(id, trackId) {
  const res = await apiPost(`/teams/${id}/move-track`, { trackId });
  if (!res.ok) throw new Error(res.data?.message || 'Failed to move team to track');
  return res.data;
}

export async function addTeamMember(teamId, payload) {
  const res = await apiPost(`/teams/${teamId}/members`, payload);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to add team member');
  return res.data;
}

export async function removeTeamMember(teamId, userId) {
  const res = await apiDelete(`/teams/${teamId}/members/${userId}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to remove team member');
}

export async function disqualifyTeam(id, reason) {
  const res = await apiPost(`/teams/${id}/disqualify`, { reason });
  if (!res.ok) throw new Error(res.data?.message || 'Failed to disqualify team');
  return res.data;
}

export async function reactivateTeam(id) {
  const res = await apiPost(`/teams/${id}/reactivate`, {});
  if (!res.ok) throw new Error(res.data?.message || 'Failed to reactivate team');
  return res.data;
}

export async function getMentorTeams(mentorId) {
  const res = await apiGet(`/track-mentors/mentors/${mentorId}/teams`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to load mentor teams');
  return res.data;
}

export async function getMentorFeedbacks(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await apiGet(`/mentor-feedbacks${qs ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to load mentor feedback');
  return res.data;
}

export async function createMentorFeedback(payload) {
  const res = await apiPost('/mentor-feedbacks', payload);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to create mentor feedback');
  return res.data;
}

export async function updateMentorFeedback(id, payload) {
  const res = await apiPatch(`/mentor-feedbacks/${id}`, payload);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to update mentor feedback');
  return res.data;
}

export async function deleteMentorFeedback(id) {
  const res = await apiDelete(`/mentor-feedbacks/${id}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to delete mentor feedback');
}

export async function deleteTeam(id) {
  const res = await apiDelete(`/teams/${id}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to delete team');
}

export async function getSubmissions(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await apiGet(`/submissions${qs ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to load submissions');
  return res.data;
}

export async function getSubmission(id) {
  const res = await apiGet(`/submissions/${id}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to load submission');
  return res.data;
}

export async function upsertSubmission(payload) {
  const res = await apiPost('/submissions', payload);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to save submission');
  return res.data;
}

export async function updateSubmission(id, payload) {
  const res = await apiPatch(`/submissions/${id}`, payload);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to update submission');
  return res.data;
}

export async function deleteSubmission(id) {
  const res = await apiDelete(`/submissions/${id}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to delete submission');
}

export async function getScores(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await apiGet(`/scores${qs ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to load scores');
  return res.data;
}

export async function upsertScore(payload) {
  const res = await apiPost('/scores', payload);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to save score');
  return res.data;
}

export async function getRoundCriteria(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await apiGet(`/round-criteria${qs ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to load round criteria');
  return res.data;
}

export async function createRoundCriterion(payload) {
  const res = await apiPost('/round-criteria', payload);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to create round criterion');
  return res.data;
}

export async function updateRoundCriterion(id, payload) {
  const res = await apiPatch(`/round-criteria/${id}`, payload);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to update round criterion');
  return res.data;
}

export async function deleteRoundCriterion(id) {
  const res = await apiDelete(`/round-criteria/${id}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to delete round criterion');
}

export async function getCriteriaTemplates(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await apiGet(`/criteria-templates${qs ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to load criteria templates');
  return res.data;
}

export async function createCriteriaTemplate(payload) {
  const res = await apiPost('/criteria-templates', payload);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to create criteria template');
  return res.data;
}

export async function getJudgeSubmissions(judgeId) {
  const res = await apiGet(`/round-judges/judges/${judgeId}/submissions`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to load judge submissions');
  return res.data;
}

export async function getRoundRankings(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await apiGet(`/round-rankings${qs ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to load rankings');
  return res.data;
}

export async function recalculateRoundRankings(roundId, payload = {}) {
  const res = await apiPost(`/round-rankings/rounds/${roundId}/recalculate`, payload);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to recalculate rankings');
  return res.data;
}

export async function getPrizes(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await apiGet(`/prizes${qs ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to load prizes');
  return res.data;
}

export async function getPrize(id) {
  const res = await apiGet(`/prizes/${id}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to load prize');
  return res.data;
}

export async function createPrize(payload) {
  const res = await apiPost('/prizes', payload);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to create prize');
  return res.data;
}

export async function updatePrize(id, payload) {
  const res = await apiPatch(`/prizes/${id}`, payload);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to update prize');
  return res.data;
}

export async function deletePrize(id) {
  const res = await apiDelete(`/prizes/${id}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to delete prize');
}

export async function getIncidents(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await apiGet(`/incidents${qs ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to load incidents');
  return res.data;
}

export async function getIncident(id) {
  const res = await apiGet(`/incidents/${id}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to load incident');
  return res.data;
}

export async function createIncident(payload) {
  const res = await apiPost('/incidents', payload);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to create incident');
  return res.data;
}

export async function updateIncidentStatus(id, payload) {
  const res = await apiPatch(`/incidents/${id}/status`, payload);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to update incident status');
  return res.data;
}

export async function addIncidentEvidence(id, payload) {
  const res = await apiPost(`/incidents/${id}/evidences`, payload);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to add evidence');
  return res.data;
}

export async function addIncidentAction(id, payload) {
  const res = await apiPost(`/incidents/${id}/actions`, payload);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to add action');
  return res.data;
}

export async function getJudgeVariance(roundId) {
  const res = await apiGet(`/reports/rounds/${roundId}/judge-variance`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to load judge variance');
  return res.data;
}

export async function getAnonymizedDataset(roundId) {
  const res = await apiGet(`/reports/rounds/${roundId}/anonymized-dataset`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to load anonymized dataset');
  return res.data;
}

export async function downloadRankingCsv(roundId) {
  const res = await apiDownload(`/reports/rounds/${roundId}/ranking.csv`);
  if (!res.ok) throw new Error(res.text || 'Failed to download ranking CSV');
  return res.text;
}

export async function getAuditLogs(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await apiGet(`/audit-logs${qs ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to load audit logs');
  return res.data;
}

export async function getRoundParticipants(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await apiGet(`/round-participants${qs ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to load round participants');
  return res.data;
}

export async function getNotices(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await apiGet(`/notices${qs ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to load notices');
  return res.data;
}

export async function createNotice(payload) {
  const res = await apiPost('/notices', payload);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to create notice');
  return res.data;
}

export async function joinTeamByInviteCode(inviteCode) {
  const res = await apiPost('/teams/join', { inviteCode });
  if (!res.ok) throw new Error(res.data?.message || 'Failed to join team');
  return res.data;
}

export async function getTeamChatMessages(teamId) {
  const res = await apiGet(`/team-chat?teamId=${encodeURIComponent(teamId)}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to load team chat');
  return res.data;
}

export async function sendTeamChatMessage(teamId, message) {
  const res = await apiPost('/team-chat', { teamId, message });
  if (!res.ok) throw new Error(res.data?.message || 'Failed to send message');
  return res.data;
}

export async function createSupportTicket(payload) {
  const res = await apiPost('/support-tickets', payload);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to submit ticket');
  return res.data;
}
