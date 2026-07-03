import { apiDelete, apiGet, apiPatch, apiPost } from './client';

export async function getEvents(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await apiGet(`/events${qs ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to load events');
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

export async function getTeams(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await apiGet(`/teams${qs ? `?${qs}` : ''}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to load teams');
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

export async function deleteTeam(id) {
  const res = await apiDelete(`/teams/${id}`);
  if (!res.ok) throw new Error(res.data?.message || 'Failed to delete team');
}
