import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

async function fixDoubleReactUsage() {
  console.log('Finding files with React.React usage...');
  
  const files = await glob('src/**/*.{ts,tsx}', { 
    cwd: process.cwd(),
    absolute: true 
  });
  
  let totalFixed = 0;
  
  for (const file of files) {
    try {
      const content = readFileSync(file, 'utf8');
      
      // Replace React.React with just React
      const updatedContent = content.replace(/React\.React\./g, 'React.');
      
      if (content !== updatedContent) {
        writeFileSync(file, updatedContent);
        console.log(`Fixed: ${file}`);
        totalFixed++;
      }
      
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }
  
  console.log(`\nFixed ${totalFixed} files with double React namespace usage.`);
}

fixDoubleReactUsage().catch(console.error);
