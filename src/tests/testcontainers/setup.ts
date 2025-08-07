

interface PostgresConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

// Mock test environment for database integration tests
class TestEnvironment {
  private postgresConfig: PostgresConfig | null = null;
  
  async setup() {
    // In a real scenario, this would start a Supabase container
    // For now, we'll use local Supabase or mock the database
    console.log('Setting up test environment...');
    
    // Mock postgres configuration
    this.postgresConfig = {
      host: 'localhost',
      port: 5432,
      database: 'parker_flight_test',
      username: 'test_user',
      password: 'test_password'
    };
    
    // Use local Supabase instance for testing
    const supabaseUrl = process.env.SUPABASE_URL || 'http://localhost:54321';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || 'test-key';
    
    const client = createClient(supabaseUrl, supabaseKey);
    
    return {
      supabase: client,
      cleanup: async () => {
        console.log('Cleaning up test environment...');
      }
    };
  }
  
  getPostgresConfig(): PostgresConfig {
    if (!this.postgresConfig) {
      throw new Error('Test environment not initialized. Call setup() first.');
    }
    return this.postgresConfig;
  }
  
  async teardown() {
    console.log('Tearing down test environment...');
    this.postgresConfig = null;
  }
}

export const testEnvironment = new TestEnvironment();
export default testEnvironment;
