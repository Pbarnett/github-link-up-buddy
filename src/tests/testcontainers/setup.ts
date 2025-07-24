import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';

export class TestEnvironment {
  private postgresContainer?: StartedPostgreSqlContainer;
  private supabaseContainer?: StartedTestContainer;

  async setup(): Promise<void> {
    try {
      console.log('Starting PostgreSQL container...');
      
      // Start PostgreSQL container for database tests
      this.postgresContainer = await new PostgreSqlContainer('postgres:15')
        .withDatabase('parker_flight_test')
        .withUsername('test_user')
        .withPassword('test_password')
        .withExposedPorts(5432)
        .withWaitStrategy(Wait.forLogMessage('database system is ready to accept connections', 2))
        .withStartupTimeout(120_000) // 2 minute timeout
        .start();

      console.log(`PostgreSQL container started successfully on port: ${this.postgresContainer.getPort()}`);
      console.log(`Connection URI: ${this.postgresContainer.getConnectionUri()}`);
      
      // Wait a bit for the database to be fully ready
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error('Failed to start PostgreSQL container:', error);
      throw error;
    }
  }

  async teardown(): Promise<void> {
    if (this.postgresContainer) {
      await this.postgresContainer.stop();
    }
    if (this.supabaseContainer) {
      await this.supabaseContainer.stop();
    }
  }

  getPostgresConfig() {
    if (!this.postgresContainer) {
      throw new Error('PostgreSQL container not started');
    }

    return {
      host: this.postgresContainer.getHost(),
      port: this.postgresContainer.getPort(),
      database: this.postgresContainer.getDatabase(),
      username: this.postgresContainer.getUsername(),
      password: this.postgresContainer.getPassword(),
      connectionString: this.postgresContainer.getConnectionUri(),
    };
  }
}

// Global test environment instance
export const testEnvironment = new TestEnvironment();
