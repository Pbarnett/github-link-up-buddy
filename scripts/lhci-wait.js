export default async ({page, url}) => {
  // Navigate and wait for the root container to get child nodes
  await page.goto(url, {waitUntil: 'domcontentloaded'});
  await page.waitForSelector('#root', {timeout: 30000});
  await page.waitForFunction(() => {
    const root = document.getElementById('root');
    return !!root && root.childElementCount > 0;
  }, {timeout: 30000});
};

