import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Monitor console errors
  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  
  // Monitor page errors
  const pageErrors = [];
  page.on('pageerror', error => {
    pageErrors.push(error.message);
  });
  
  console.log('Testing available routes...\n');
  
  const routes = ['/', '/search', '/trip/new', '/auto-booking/new'];
  
  for (const route of routes) {
    try {
      console.log(`\n🔍 Testing route: ${route}`);
      await page.goto(`http://localhost:3000${route}`, { waitUntil: 'networkidle' });
      
      // Check if we get redirected
      const currentUrl = page.url();
      if (currentUrl !== `http://localhost:3000${route}`) {
        console.log(`  ➜ Redirected to: ${currentUrl}`);
      }
      
      // Look for forms and key elements
      const hasForm = await page.locator('form').count() > 0;
      const hasSubmitButton = await page.locator('[data-testid="primary-submit-button"]').count() > 0;
      const hasSearchFlights = await page.getByText('Search Live Flights').count() > 0;
      const hasTripBasics = await page.getByText('Trip Basics').count() > 0;
      
      // Check for authentication elements
      const hasLogin = await page.getByText('Sign in').count() > 0;
      const hasSignUp = await page.getByText('Sign up').count() > 0;
      
      // Get page title and some sample text
      const title = await page.title();
      const bodyText = await page.locator('body').textContent();
      const sampleText = bodyText ? bodyText.substring(0, 200) + '...' : 'No content';
      
      console.log(`  Page info:`);
      console.log(`    - Title: ${title}`);
      console.log(`    - Sample text: ${sampleText}`);
      console.log(`  Form elements found:`);
      console.log(`    - <form>: ${hasForm}`);
      console.log(`    - Submit button: ${hasSubmitButton}`);
      console.log(`    - "Search Live Flights": ${hasSearchFlights}`);
      console.log(`    - "Trip Basics": ${hasTripBasics}`);
      console.log(`  Auth elements:`);
      console.log(`    - "Sign in": ${hasLogin}`);
      console.log(`    - "Sign up": ${hasSignUp}`);
      
      // Report any errors found
      if (consoleErrors.length > 0) {
        console.log(`  Console errors:`);
        consoleErrors.forEach(error => console.log(`    - ${error}`));
      }
      
      if (pageErrors.length > 0) {
        console.log(`  Page errors:`);
        pageErrors.forEach(error => console.log(`    - ${error}`));
      }
      
      // Take a screenshot for visual debugging
      await page.screenshot({ path: `debug_${route.replace(/\//g, '_')}.png` });
      
    } catch (error) {
      console.log(`  ❌ Error accessing route: ${error.message}`);
    }
  }
  
  await browser.close();
  console.log('\n✅ Route debugging complete. Check debug_*.png files for visual confirmation.');
})();
