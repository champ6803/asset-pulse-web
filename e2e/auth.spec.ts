import { test, expect } from '@playwright/test';

test.describe('Asset Pulse E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:3000');
  });

  test.describe('Authentication Flow', () => {
    test('should display login page for unauthenticated user', async ({ page }) => {
      await expect(page).toHaveTitle(/Asset Pulse/);
      await expect(page.locator('h1')).toContainText('Login');
      await expect(page.locator('input[type="email"]')).toBeVisible();
      await expect(page.locator('input[type="password"]')).toBeVisible();
      await expect(page.locator('button[type="submit"]')).toBeVisible();
    });

    test('should login with valid credentials', async ({ page }) => {
      // Fill login form
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Wait for redirect to dashboard
      await page.waitForURL('**/dashboard');
      
      // Verify dashboard elements
      await expect(page.locator('h1')).toContainText('Dashboard');
      await expect(page.locator('text=Welcome to Asset Pulse')).toBeVisible();
    });

    test('should show error for invalid credentials', async ({ page }) => {
      // Fill login form with invalid credentials
      await page.fill('input[type="email"]', 'invalid@example.com');
      await page.fill('input[type="password"]', 'wrongpassword');
      
      // Submit form
      await page.click('button[type="submit"]');
      
      // Wait for error message
      await expect(page.locator('text=Invalid credentials')).toBeVisible();
    });

    test('should logout successfully', async ({ page }) => {
      // First login
      await page.fill('input[type="email"]', 'test@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      // Wait for dashboard
      await page.waitForURL('**/dashboard');
      
      // Click logout button
      await page.click('text=Logout');
      
      // Should redirect to login page
      await page.waitForURL('**/login');
      await expect(page.locator('h1')).toContainText('Login');
    });
  });

  test.describe('Role-Based Navigation', () => {
    test('should show employee navigation items', async ({ page }) => {
      // Login as employee
      await page.fill('input[type="email"]', 'employee@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      await page.waitForURL('**/dashboard');
      
      // Check employee-specific navigation
      await expect(page.locator('text=Dashboard')).toBeVisible();
      await expect(page.locator('text=My Software')).toBeVisible();
      await expect(page.locator('text=Recommendations')).toBeVisible();
      
      // Should not show manager/CTO items
      await expect(page.locator('text=Team Management')).not.toBeVisible();
      await expect(page.locator('text=Company Overview')).not.toBeVisible();
    });

    test('should show manager navigation items', async ({ page }) => {
      // Login as manager
      await page.fill('input[type="email"]', 'manager@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      await page.waitForURL('**/dashboard');
      
      // Check manager-specific navigation
      await expect(page.locator('text=Dashboard')).toBeVisible();
      await expect(page.locator('text=Team Management')).toBeVisible();
      await expect(page.locator('text=Purchase Templates')).toBeVisible();
    });

    test('should show CTO navigation items', async ({ page }) => {
      // Login as CTO
      await page.fill('input[type="email"]', 'cto@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      await page.waitForURL('**/dashboard');
      
      // Check CTO-specific navigation
      await expect(page.locator('text=Dashboard')).toBeVisible();
      await expect(page.locator('text=Company Overview')).toBeVisible();
      await expect(page.locator('text=Cross-Subsidiary Match')).toBeVisible();
    });
  });

  test.describe('Dashboard Functionality', () => {
    test('should display dashboard content for employee', async ({ page }) => {
      // Login as employee
      await page.fill('input[type="email"]', 'employee@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      await page.waitForURL('**/dashboard');
      
      // Check dashboard content
      await expect(page.locator('text=My Software Assets')).toBeVisible();
      await expect(page.locator('text=Recent Recommendations')).toBeVisible();
      await expect(page.locator('text=Software Usage')).toBeVisible();
    });

    test('should display dashboard content for manager', async ({ page }) => {
      // Login as manager
      await page.fill('input[type="email"]', 'manager@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      await page.waitForURL('**/dashboard');
      
      // Check manager dashboard content
      await expect(page.locator('text=Team Overview')).toBeVisible();
      await expect(page.locator('text=Department Software')).toBeVisible();
      await expect(page.locator('text=Purchase Templates')).toBeVisible();
    });

    test('should display dashboard content for CTO', async ({ page }) => {
      // Login as CTO
      await page.fill('input[type="email"]', 'cto@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      await page.waitForURL('**/dashboard');
      
      // Check CTO dashboard content
      await expect(page.locator('text=Company Overview')).toBeVisible();
      await expect(page.locator('text=Cross-Subsidiary Analysis')).toBeVisible();
      await expect(page.locator('text=Cost Optimization')).toBeVisible();
    });
  });

  test.describe('Recommendation Features', () => {
    test('should generate JD recommendations', async ({ page }) => {
      // Login as employee
      await page.fill('input[type="email"]', 'employee@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      await page.waitForURL('**/dashboard');
      
      // Navigate to recommendations
      await page.click('text=Recommendations');
      
      // Fill job description
      await page.fill('textarea[placeholder*="job description"]', 'Software Engineer with React and Node.js experience');
      
      // Submit for recommendations
      await page.click('button:has-text("Generate Recommendations")');
      
      // Wait for recommendations to appear
      await expect(page.locator('text=Recommended Software')).toBeVisible();
      await expect(page.locator('.recommendation-item')).toHaveCount.greaterThan(0);
    });

    test('should show seat optimization recommendations', async ({ page }) => {
      // Login as manager
      await page.fill('input[type="email"]', 'manager@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      await page.waitForURL('**/dashboard');
      
      // Navigate to seat optimization
      await page.click('text=Seat Optimization');
      
      // Wait for optimization opportunities
      await expect(page.locator('text=Optimization Opportunities')).toBeVisible();
      await expect(page.locator('.optimization-item')).toHaveCount.greaterThan(0);
    });
  });

  test.describe('Purchase Template Management', () => {
    test('should create purchase template', async ({ page }) => {
      // Login as manager
      await page.fill('input[type="email"]', 'manager@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      await page.waitForURL('**/dashboard');
      
      // Navigate to purchase templates
      await page.click('text=Purchase Templates');
      
      // Click create template button
      await page.click('button:has-text("Create Template")');
      
      // Fill template form
      await page.fill('input[placeholder*="template name"]', 'Engineering Team Template');
      await page.fill('textarea[placeholder*="description"]', 'Standard software for engineering team');
      
      // Add software items
      await page.click('button:has-text("Add Software")');
      await page.fill('input[placeholder*="software name"]', 'Visual Studio');
      await page.fill('input[placeholder*="vendor"]', 'Microsoft');
      
      // Save template
      await page.click('button:has-text("Save Template")');
      
      // Verify template was created
      await expect(page.locator('text=Engineering Team Template')).toBeVisible();
    });
  });

  test.describe('Cross-Subsidiary Features', () => {
    test('should show cross-subsidiary matches', async ({ page }) => {
      // Login as CTO
      await page.fill('input[type="email"]', 'cto@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      await page.waitForURL('**/dashboard');
      
      // Navigate to cross-subsidiary match
      await page.click('text=Cross-Subsidiary Match');
      
      // Wait for matches to load
      await expect(page.locator('text=Cross-Subsidiary Software Matches')).toBeVisible();
      await expect(page.locator('.match-item')).toHaveCount.greaterThan(0);
    });
  });

  test.describe('Responsive Design', () => {
    test('should work on mobile devices', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 });
      
      // Login
      await page.fill('input[type="email"]', 'employee@example.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
      
      await page.waitForURL('**/dashboard');
      
      // Check mobile navigation
      await expect(page.locator('.mobile-menu-button')).toBeVisible();
      
      // Open mobile menu
      await page.click('.mobile-menu-button');
      
      // Check mobile menu items
      await expect(page.locator('text=Dashboard')).toBeVisible();
      await expect(page.locator('text=My Software')).toBeVisible();
    });
  });
});
