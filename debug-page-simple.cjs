const { chromium } = require('playwright');

async function debugPage() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Listen for console logs
  page.on('console', msg => {
    console.log('PAGE LOG:', msg.text());
  });

  // Listen for errors
  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
  });

  try {
    console.log('Navigating to test-booking page...');
    await page.goto('http://localhost:3000/test-booking');
    
    console.log('Waiting for page to load...');
    await page.waitForLoadState('networkidle');
    
    console.log('Waiting a bit more...');
    await page.waitForTimeout(3000);
    
    // Check what's actually on the page
    const title = await page.title();
    console.log('Page title:', title);
    
    const bodyText = await page.locator('body').textContent();
    console.log('Body text preview:', bodyText?.substring(0, 500));
    
    const forms = await page.locator('form').count();
    console.log('Forms found:', forms);
    
    const inputs = await page.locator('input').count();
    console.log('Input fields found:', inputs);
    
    const buttons = await page.locator('button').count();
    console.log('Buttons found:', buttons);
    
    const headings = await page.locator('h1, h2, h3').count();
    console.log('Headings found:', headings);
    
    // Check for any error messages
    const errorElements = await page.locator('[class*="error"], [class*="Error"], .text-red').count();
    console.log('Error elements found:', errorElements);
    
    // Take a screenshot
    await page.screenshot({ path: 'debug-screenshot.png' });
    console.log('Screenshot saved as debug-screenshot.png');
    
    // Check the HTML content
    const html = await page.content();
    console.log('HTML length:', html.length);
    
    // Look for specific test elements
    const testHeading = await page.locator('text=Test Flight Booking').count();
    console.log('Test heading found:', testHeading);
    
    console.log('Debug complete - keeping browser open for inspection');
    // Don't close browser - keep it open for manual inspection
    // await browser.close();
    
  } catch (error) {
    console.error('Debug failed:', error);
    await browser.close();
  }
}

debugPage();
