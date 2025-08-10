module.exports = async ({page, url}) => {
  await page.goto(url, {waitUntil: 'domcontentloaded'});
  // Wait for a visible element under #root to ensure render
  await page.waitForSelector('#root', {timeout: 30000});
  await page.waitForFunction(() => {
    const root = document.getElementById('root');
    if (!root) return false;
    // Consider rendered if any child has non-empty text or non-zero box
    const hasChild = Array.from(root.children).some(el => {
      const rect = el.getBoundingClientRect();
      return (el.textContent && el.textContent.trim().length > 0) || (rect.width > 0 && rect.height > 0);
    });
    return hasChild;
  }, {timeout: 30000});
};

