import { chromium } from 'playwright';
// Utility functions
// Removed unused info function
// Removed unused warning function
// Removed unused error function
// Removed unused success function

// Utility functions
// Removed unused log function
  console.log(`[${timestamp}] ${(level || "INFO").toUpperCase()}: ${message}`);

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  // Enable console logging
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  try {
    await page.goto('http://localhost:3000/test-booking');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    
    // Check what's actually on the page
    const content = await page.content();
    console.log('=== PAGE CONTENT ===');
    console.log(content.substring(0, 2000) + '...');
    
    // Check for specific elements
    const hasForm = await page.locator('form').count();
    console.log('Forms found:', hasForm);
    
    const hasTestHeading = await page.locator('text=Test Flight Booking').count();
    console.log('Test heading found:', hasTestHeading);
    
    const hasInput = await page.locator('input').count();
    console.log('Input fields found:', hasInput);
    
    const hasButton = await page.locator('button').count();
    console.log('Buttons found:', hasButton);
    
    // Check for errors in the console
    const errors = await page.evaluate(() => /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ /* eslint-disable-next-line no-undef */ window.console);
    
    // Wait a bit more
    await page.waitForTimeout(5000);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
})();
