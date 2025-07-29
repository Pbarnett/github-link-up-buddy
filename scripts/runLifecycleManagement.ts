import '../lib/stripe/customerLifecycleManager';

async function runLifecycleManagement() {
  const manager = createCustomerLifecycleManager({
    dryRun: false  // Set to true for testing without changes
  });

  try {
    const results = await manager.runLifecycleProcess();
    console.log('Lifecycle management completed:', results);
  } catch {
    console.error('Lifecycle management process failed:', error);
  }
}

// Call the function (consider running this on a schedule in production)
runLifecycleManagement();

