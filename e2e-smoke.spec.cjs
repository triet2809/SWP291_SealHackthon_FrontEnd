const { test, expect } = require('@playwright/test');

async function apiLogin(request) {
  const res = await request.post('http://localhost:8080/api/auth/login', {
    data: { email: 'coordinator@seal.local', password: 'Password123!' }
  });
  expect(res.ok()).toBeTruthy();
  return await res.json();
}

async function seedAuth(page, auth) {
  await page.addInitScript((authData) => {
    localStorage.setItem('seal_access_token', authData.accessToken);
    localStorage.setItem('seal_refresh_token', authData.refreshToken || '');
    localStorage.setItem('seal_token_type', authData.tokenType || 'Bearer');
    localStorage.setItem('seal_user', JSON.stringify(authData.user || {}));
  }, auth);
}

test('SEAL coordinator browser click-through', async ({ page, request }) => {
  const auth = await apiLogin(request);
  await seedAuth(page, auth);

  await page.goto('http://localhost:5173/coordinator/dashboard');
  await expect(page.getByText('SEAL Hackathon 2026').first()).toBeVisible();

  await page.getByText('Event Manage').click();
  await expect(page).toHaveURL(/\/coordinator\/events/);
  await expect(page.locator('body')).toContainText(/Event|Hackathon/i);

  await page.getByText('Profile').click();
  await expect(page).toHaveURL(/\/coordinator\/profile/);
  await page.locator('input').first().fill('Coordinator Dev');
  await page.getByRole('button', { name: 'Save Changes' }).click();
  await expect(page.getByText('Profile updated')).toBeVisible();

  await page.getByTitle('Logout').click();
  await expect(page).toHaveURL(/\/login/);

  const revoked = await request.get('http://localhost:8080/api/users/me', {
    headers: { Authorization: `Bearer ${auth.accessToken}` }
  });
  expect(revoked.status()).toBe(403);
});

test('SEAL notice pages render in browser', async ({ page, request }) => {
  const auth = await apiLogin(request);
  await seedAuth(page, auth);

  await page.goto('http://localhost:5173/team/notices');
  await expect(page.getByText('Notice Board').first()).toBeVisible();
  await expect(page.locator('body')).toContainText(/Notice|No notices/i);

  await page.goto('http://localhost:5173/mentor/notices');
  await expect(page.getByText('Notice Board').first()).toBeVisible();
  await expect(page.getByRole('button', { name: /Create Announcement/i })).toBeVisible();

  await page.goto('http://localhost:5173/judge/notices');
  await expect(page.getByText('Notice Board').first()).toBeVisible();
  await expect(page.getByRole('button', { name: /Create Announcement/i })).toBeVisible();
});
