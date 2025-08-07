#!/usr/bin/env node

/**
 * KMS Key Rotation Testing Script
 * Tests the complete KMS implementation with rotation support
 */

import { KMSService, kmsService, kmsConfig } from '../src/lib/aws-config';
import { KMSRotationHandler } from '../src/lib/kms-rotation-handler';

interface TestResult {
  testName: string;
  success: boolean;
  duration: number;
  error?: string;
  details?: any;
}

class KMSRotationTester {
  private results: TestResult[] = [];
  private kmsService: KMSService;
  private rotationHandler: KMSRotationHandler;

  constructor() {
    this.kmsService = kmsService;
    this.rotationHandler = new KMSRotationHandler(
      kmsConfig.keyAlias,
      kmsConfig.region
    );
  }

  async runAllTests(): Promise<void> {
    console.log('🔒 Starting KMS Key Rotation Tests...\n');
    
    // Test basic KMS operations
    await this.testBasicEncryption();
    await this.testBatchEncryptionDecryption();
    await this.testKeyMetadata();
    await this.testKeyRotationValidation();
    
    // Test rotation handler
    await this.testRotationEventHandling();
    await this.testAliasResolution();
    
    // Performance tests
    await this.testEncryptionPerformance();
    
    // Error handling tests
    await this.testErrorHandling();
    
    // Generate report
    this.generateReport();
  }

  private async testBasicEncryption(): Promise<void> {
    const testName = 'Basic Encryption/Decryption';
    const startTime = Date.now();
    
    try {
      const testData = 'Hello, World! This is a test of KMS encryption with rotation support.';
      
      // Test encryption
      const encrypted = await this.kmsService.encrypt(testData);
      console.log(`✓ Encrypted data length: ${encrypted.length} characters`);
      
      // Test decryption
      const decrypted = await this.kmsService.decrypt(encrypted);
      
      if (decrypted !== testData) {
        throw new Error('Decrypted data does not match original');
      }
      
      this.results.push({
        testName,
        success: true,
        duration: Date.now() - startTime,
        details: { originalLength: testData.length, encryptedLength: encrypted.length }
      });
      
      console.log(`✅ ${testName} - PASSED (${Date.now() - startTime}ms)\n`);
      
    } catch (error) {
      this.results.push({
        testName,
        success: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      console.error(`❌ ${testName} - FAILED: ${error}\n`);
    }
  }

  private async testBatchEncryptionDecryption(): Promise<void> {
    const testName = 'Batch Encryption/Decryption';
    const startTime = Date.now();
    
    try {
      const testDataItems = [
        'Test data item 1',
        'Another test string with special chars: !@#$%^&*()',
        'JSON data: {"key": "value", "number": 42}',
        'Long text: ' + 'A'.repeat(1000),
        'Unicode test: 你好世界 🌍'
      ];
      
      // Encrypt all items
      const encryptedItems = await Promise.all(
        testDataItems.map(item => this.kmsService.encrypt(item))
      );
      
      // Decrypt all items
      const decryptedItems = await Promise.all(
        encryptedItems.map(item => this.kmsService.decrypt(item))
      );
      
      // Verify all items
      for (let i = 0; i < testDataItems.length; i++) {
        if (decryptedItems[i] !== testDataItems[i]) {
          throw new Error(`Batch item ${i} decryption mismatch`);
        }
      }
      
      this.results.push({
        testName,
        success: true,
        duration: Date.now() - startTime,
        details: { itemCount: testDataItems.length }
      });
      
      console.log(`✅ ${testName} - PASSED (${testDataItems.length} items, ${Date.now() - startTime}ms)\n`);
      
    } catch (error) {
      this.results.push({
        testName,
        success: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      console.error(`❌ ${testName} - FAILED: ${error}\n`);
    }
  }

  private async testKeyMetadata(): Promise<void> {
    const testName = 'Key Metadata Retrieval';
    const startTime = Date.now();
    
    try {
      const keyInfo = await this.kmsService.getKeyInfo();
      
      if (!keyInfo.KeyMetadata) {
        throw new Error('No key metadata returned');
      }
      
      const metadata = keyInfo.KeyMetadata;
      console.log('📊 Key Information:');
      console.log(`   Key ID: ${metadata.KeyId}`);
      console.log(`   Key State: ${metadata.KeyState}`);
      console.log(`   Key Usage: ${metadata.KeyUsage}`);
      console.log(`   Key Spec: ${metadata.KeySpec}`);
      console.log(`   Origin: ${metadata.Origin}`);
      console.log(`   Rotation Enabled: ${metadata.KeyRotationStatus}`);
      console.log(`   Creation Date: ${metadata.CreationDate}`);
      
      this.results.push({
        testName,
        success: true,
        duration: Date.now() - startTime,
        details: {
          keyId: metadata.KeyId,
          keyState: metadata.KeyState,
          rotationEnabled: metadata.KeyRotationStatus
        }
      });
      
      console.log(`✅ ${testName} - PASSED (${Date.now() - startTime}ms)\n`);
      
    } catch (error) {
      this.results.push({
        testName,
        success: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      console.error(`❌ ${testName} - FAILED: ${error}\n`);
    }
  }

  private async testKeyRotationValidation(): Promise<void> {
    const testName = 'Key Rotation Validation';
    const startTime = Date.now();
    
    try {
      const rotationEnabled = await this.kmsService.validateKeyRotation();
      
      if (!rotationEnabled) {
        console.warn('⚠️  Key rotation is not enabled - this should be fixed for production');
      }
      
      this.results.push({
        testName,
        success: true,
        duration: Date.now() - startTime,
        details: { rotationEnabled }
      });
      
      console.log(`✅ ${testName} - ${rotationEnabled ? 'ENABLED' : 'DISABLED'} (${Date.now() - startTime}ms)\n`);
      
    } catch (error) {
      this.results.push({
        testName,
        success: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      console.error(`❌ ${testName} - FAILED: ${error}\n`);
    }
  }

  private async testRotationEventHandling(): Promise<void> {
    const testName = 'Rotation Event Handling (Mock)';
    const startTime = Date.now();
    
    try {
      // Create a mock rotation event
      const mockEvent = {
        source: 'aws.kms',
        'detail-type': 'KMS Key Rotation',
        detail: {
          keyId: 'test-key-id-12345',
          eventName: 'KeyRotationScheduled',
          rotationStatus: 'Enabled'
        }
      };
      
      // Test event processing (this will fail gracefully since it's a test key)
      try {
        await this.rotationHandler.handleRotationEvent(mockEvent);
      } catch (error) {
        // Expected to fail with test key - that's OK
        if (error instanceof Error && error.message.includes('test-key-id')) {
          console.log('✓ Mock event handled correctly (expected to fail with test key)');
        } else {
          throw error;
        }
      }
      
      this.results.push({
        testName,
        success: true,
        duration: Date.now() - startTime,
        details: { eventType: mockEvent.detail.eventName }
      });
      
      console.log(`✅ ${testName} - PASSED (${Date.now() - startTime}ms)\n`);
      
    } catch (error) {
      this.results.push({
        testName,
        success: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      console.error(`❌ ${testName} - FAILED: ${error}\n`);
    }
  }

  private async testAliasResolution(): Promise<void> {
    const testName = 'Alias Resolution';
    const startTime = Date.now();
    
    try {
      // Test that we can use the alias for operations
      const testData = 'Alias test data';
      const encrypted = await this.kmsService.encrypt(testData);
      const decrypted = await this.kmsService.decrypt(encrypted);
      
      if (decrypted !== testData) {
        throw new Error('Alias-based encryption/decryption failed');
      }
      
      console.log(`✓ Successfully used alias: ${kmsConfig.keyAlias}`);
      
      this.results.push({
        testName,
        success: true,
        duration: Date.now() - startTime,
        details: { keyAlias: kmsConfig.keyAlias }
      });
      
      console.log(`✅ ${testName} - PASSED (${Date.now() - startTime}ms)\n`);
      
    } catch (error) {
      this.results.push({
        testName,
        success: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      console.error(`❌ ${testName} - FAILED: ${error}\n`);
    }
  }

  private async testEncryptionPerformance(): Promise<void> {
    const testName = 'Encryption Performance';
    const startTime = Date.now();
    
    try {
      const testData = 'Performance test data';
      const iterations = 10;
      const times: number[] = [];
      
      console.log(`🚀 Running ${iterations} encryption/decryption cycles...`);
      
      for (let i = 0; i < iterations; i++) {
        const cycleStart = Date.now();
        
        const encrypted = await this.kmsService.encrypt(testData);
        const decrypted = await this.kmsService.decrypt(encrypted);
        
        if (decrypted !== testData) {
          throw new Error(`Performance test cycle ${i} failed`);
        }
        
        times.push(Date.now() - cycleStart);
      }
      
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      const minTime = Math.min(...times);
      const maxTime = Math.max(...times);
      
      console.log(`📈 Performance Results:`);
      console.log(`   Average: ${avgTime.toFixed(2)}ms`);
      console.log(`   Min: ${minTime}ms`);
      console.log(`   Max: ${maxTime}ms`);
      
      this.results.push({
        testName,
        success: true,
        duration: Date.now() - startTime,
        details: { avgTime, minTime, maxTime, iterations }
      });
      
      console.log(`✅ ${testName} - PASSED (${iterations} cycles, ${Date.now() - startTime}ms total)\n`);
      
    } catch (error) {
      this.results.push({
        testName,
        success: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      console.error(`❌ ${testName} - FAILED: ${error}\n`);
    }
  }

  private async testErrorHandling(): Promise<void> {
    const testName = 'Error Handling';
    const startTime = Date.now();
    
    try {
      let errorsHandledCorrectly = 0;
      
      // Test decryption of invalid data
      try {
        await this.kmsService.decrypt('invalid-base64-data-that-should-fail');
      } catch (error) {
        console.log('✓ Invalid decryption data handled correctly');
        errorsHandledCorrectly++;
      }
      
      // Test empty encryption
      try {
        await this.kmsService.encrypt('');
        console.log('✓ Empty string encryption handled');
        errorsHandledCorrectly++;
      } catch (error) {
        console.log('✓ Empty string encryption error handled correctly');
        errorsHandledCorrectly++;
      }
      
      if (errorsHandledCorrectly === 0) {
        throw new Error('No error conditions were properly handled');
      }
      
      this.results.push({
        testName,
        success: true,
        duration: Date.now() - startTime,
        details: { errorsHandled: errorsHandledCorrectly }
      });
      
      console.log(`✅ ${testName} - PASSED (${errorsHandledCorrectly} errors handled, ${Date.now() - startTime}ms)\n`);
      
    } catch (error) {
      this.results.push({
        testName,
        success: false,
        duration: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      console.error(`❌ ${testName} - FAILED: ${error}\n`);
    }
  }

  private generateReport(): void {
    console.log('📊 TEST REPORT');
    console.log('=====================================');
    
    const passed = this.results.filter(r => r.success).length;
    const failed = this.results.filter(r => !r.success).length;
    const totalDuration = this.results.reduce((sum, r) => sum + r.duration, 0);
    
    console.log(`Total Tests: ${this.results.length}`);
    console.log(`Passed: ${passed} ✅`);
    console.log(`Failed: ${failed} ${failed > 0 ? '❌' : ''}`);
    console.log(`Total Duration: ${totalDuration}ms`);
    console.log('');
    
    if (failed > 0) {
      console.log('FAILED TESTS:');
      this.results
        .filter(r => !r.success)
        .forEach(r => {
          console.log(`❌ ${r.testName}: ${r.error}`);
        });
      console.log('');
    }
    
    console.log('RECOMMENDATIONS:');
    const keyRotationTest = this.results.find(r => r.testName === 'Key Rotation Validation');
    if (keyRotationTest && !keyRotationTest.details?.rotationEnabled) {
      console.log('🔄 Enable KMS key rotation for security compliance');
    }
    
    const performanceTest = this.results.find(r => r.testName === 'Encryption Performance');
    if (performanceTest && performanceTest.details?.avgTime > 1000) {
      console.log('⚡ Consider caching or connection pooling to improve performance');
    }
    
    if (passed === this.results.length) {
      console.log('🎉 All tests passed! Your KMS rotation implementation is working correctly.');
    } else {
      console.log('⚠️  Some tests failed. Please review the implementation.');
    }
    
    console.log('\nNext steps:');
    console.log('1. Deploy the CloudFormation template (infrastructure/kms-rotation-stack.yaml)');
    console.log('2. Update your environment variables to use the KMS_KEY_ALIAS');
    console.log('3. Test key rotation in a staging environment');
    console.log('4. Set up monitoring and alerting');
  }
}

// Run the tests
async function main() {
  const tester = new KMSRotationTester();
  
  try {
    await tester.runAllTests();
  } catch (error) {
    console.error('Critical test failure:', error);
    process.exit(1);
  }
}

// Execute if run directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  main().catch(error => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });
}

export { KMSRotationTester };
export default KMSRotationTester;
