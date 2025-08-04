/**
 * Emergency Kill-Switch for Auto-Booking Pipeline
 * 
 * Implements LaunchDarkly-based emergency controls to immediately disable
 * auto-booking functionality across all systems when critical issues occur.
 * This addresses gap #50: LaunchDarkly kill-switch for booking.
 * 
 * Features:
 * - Multi-level kill switches (global, user-specific, feature-specific)
 * - Graceful degradation modes
 * - Emergency notification integration
 * - Audit logging for all kill-switch activations
 */

import { evaluateFlag, createUserContext } from './launchdarkly.ts'
import { logger } from './logger.ts'
import { withSpan } from './otel.ts'

export interface KillSwitchStatus {
  enabled: boolean
  reason?: string
  level: 'global' | 'user' | 'feature'
  activatedAt?: string
  activatedBy?: string
}

export interface KillSwitchContext {
  userId?: string
  feature?: string
  environment?: string
  emergencyLevel?: 'low' | 'medium' | 'high' | 'critical'
}

/**
 * Emergency Kill Switch Manager
 */
export class EmergencyKillSwitch {
  private static instance: EmergencyKillSwitch | null = null
  private readonly flagKeys = {
    global: 'emergency-global-kill-switch',
    autoBooking: 'emergency-auto-booking-kill-switch',
    userSpecific: 'emergency-user-kill-switch',
    paymentProcessing: 'emergency-payment-kill-switch',
    duffelIntegration: 'emergency-duffel-kill-switch'
  }

  private constructor() {}

  static getInstance(): EmergencyKillSwitch {
    if (!EmergencyKillSwitch.instance) {
      EmergencyKillSwitch.instance = new EmergencyKillSwitch()
    }
    return EmergencyKillSwitch.instance
  }

  /**
   * Check if auto-booking is enabled (not killed)
   */
  async isAutoBookingEnabled(context: KillSwitchContext = {}): Promise<boolean> {
    return withSpan(
      'kill_switch.check_auto_booking',
      async (span) => {
        span.attributes['kill_switch.feature'] = 'auto_booking'
        span.attributes['kill_switch.user_id'] = context.userId || 'system'

        // Check global kill switch first
        const globalStatus = await this.checkGlobalKillSwitch()
        if (!globalStatus.enabled) {
          span.attributes['kill_switch.triggered'] = true
          span.attributes['kill_switch.level'] = 'global'
          
          logger.warn('Global kill switch activated - all systems disabled', {
            operation: 'kill_switch_global_active',
            reason: globalStatus.reason,
            activatedAt: globalStatus.activatedAt
          })
          
          return false
        }

        // Check auto-booking specific kill switch
        const autoBookingStatus = await this.checkFeatureKillSwitch('autoBooking', context)
        if (!autoBookingStatus.enabled) {
          span.attributes['kill_switch.triggered'] = true
          span.attributes['kill_switch.level'] = 'feature'
          
          logger.warn('Auto-booking kill switch activated', {
            operation: 'kill_switch_auto_booking_active',
            reason: autoBookingStatus.reason,
            context
          })
          
          return false
        }

        // Check user-specific kill switch if user context provided
        if (context.userId) {
          const userStatus = await this.checkUserKillSwitch(context.userId)
          if (!userStatus.enabled) {
            span.attributes['kill_switch.triggered'] = true
            span.attributes['kill_switch.level'] = 'user'
            
            logger.warn('User-specific kill switch activated', {
              operation: 'kill_switch_user_active',
              userId: context.userId,
              reason: userStatus.reason
            })
            
            return false
          }
        }

        span.attributes['kill_switch.triggered'] = false
        return true
      },
      {
        'service.name': 'kill-switch-service'
      }
    )
  }

  /**
   * Check if payment processing is enabled
   */
  async isPaymentProcessingEnabled(context: KillSwitchContext = {}): Promise<boolean> {
    return withSpan(
      'kill_switch.check_payment_processing',
      async (span) => {
        // Check global first
        const globalStatus = await this.checkGlobalKillSwitch()
        if (!globalStatus.enabled) {
          return false
        }

        // Check payment-specific kill switch
        const paymentStatus = await this.checkFeatureKillSwitch('paymentProcessing', context)
        
        span.attributes['kill_switch.payment_enabled'] = paymentStatus.enabled
        return paymentStatus.enabled
      }
    )
  }

  /**
   * Check if Duffel integration is enabled
   */
  async isDuffelIntegrationEnabled(context: KillSwitchContext = {}): Promise<boolean> {
    return withSpan(
      'kill_switch.check_duffel_integration',
      async (span) => {
        // Check global first
        const globalStatus = await this.checkGlobalKillSwitch()
        if (!globalStatus.enabled) {
          return false
        }

        // Check Duffel-specific kill switch
        const duffelStatus = await this.checkFeatureKillSwitch('duffelIntegration', context)
        
        span.attributes['kill_switch.duffel_enabled'] = duffelStatus.enabled
        return duffelStatus.enabled
      }
    )
  }

  /**
   * Get comprehensive system status
   */
  async getSystemStatus(context: KillSwitchContext = {}): Promise<{
    overall: boolean
    components: Record<string, KillSwitchStatus>
  }> {
    const components: Record<string, KillSwitchStatus> = {}

    // Check all components
    const [global, autoBooking, payment, duffel] = await Promise.all([
      this.checkGlobalKillSwitch(),
      this.checkFeatureKillSwitch('autoBooking', context),
      this.checkFeatureKillSwitch('paymentProcessing', context),
      this.checkFeatureKillSwitch('duffelIntegration', context)
    ])

    components.global = global
    components.autoBooking = autoBooking
    components.paymentProcessing = payment
    components.duffelIntegration = duffel

    // Check user-specific if context provided
    if (context.userId) {
      components.userSpecific = await this.checkUserKillSwitch(context.userId)
    }

    const overall = Object.values(components).every(status => status.enabled)

    logger.info('System kill-switch status check', {
      operation: 'kill_switch_system_status',
      overall,
      components: Object.fromEntries(
        Object.entries(components).map(([key, status]) => [key, status.enabled])
      ),
      context
    })

    return { overall, components }
  }

  /**
   * Check global kill switch
   */
  private async checkGlobalKillSwitch(): Promise<KillSwitchStatus> {
    try {
      const systemContext = {
        kind: 'system',
        key: 'auto-booking-system',
        custom: {
          checkType: 'emergency_kill_switch'
        }
      }
      const flagResponse = await evaluateFlag(
        this.flagKeys.global,
        systemContext,
        true // Default to enabled (kill switch OFF)
      )
      const isEnabled = flagResponse.value

      return {
        enabled: isEnabled,
        level: 'global',
        reason: isEnabled ? undefined : 'Global emergency kill switch activated'
      }
    } catch (error) {
      logger.error('Failed to check global kill switch', {
        operation: 'kill_switch_global_check_error',
        error: error.message
      })

      // Fail closed - disable if we can't check
      return {
        enabled: false,
        level: 'global',
        reason: 'Kill switch check failed - failing closed for safety'
      }
    }
  }

  /**
   * Check feature-specific kill switch
   */
  private async checkFeatureKillSwitch(
    feature: keyof typeof this.flagKeys, 
    context: KillSwitchContext
  ): Promise<KillSwitchStatus> {
    try {
      const ldContext = {
        kind: 'system',
        key: 'auto-booking-system',
        custom: {
          checkType: 'emergency_kill_switch',
          feature,
          emergencyLevel: context.emergencyLevel || 'low'
        }
      }

      const flagKey = this.flagKeys[feature]
      const flagResponse = await evaluateFlag(flagKey, ldContext, true)
      const isEnabled = flagResponse.value

      return {
        enabled: isEnabled,
        level: 'feature',
        reason: isEnabled ? undefined : `${feature} emergency kill switch activated`
      }
    } catch (error) {
      logger.error('Failed to check feature kill switch', {
        operation: 'kill_switch_feature_check_error',
        feature,
        error: error.message
      })

      // Fail closed
      return {
        enabled: false,
        level: 'feature',
        reason: `${feature} kill switch check failed - failing closed for safety`
      }
    }
  }

  /**
   * Check user-specific kill switch
   */
  private async checkUserKillSwitch(userId: string): Promise<KillSwitchStatus> {
    try {
      const ldContext = {
        kind: 'user',
        key: userId,
        custom: {
          checkType: 'emergency_kill_switch'
        }
      }

      const flagResponse = await evaluateFlag(
        this.flagKeys.userSpecific,
        ldContext,
        true
      )
      const isEnabled = flagResponse.value

      return {
        enabled: isEnabled,
        level: 'user',
        reason: isEnabled ? undefined : `User ${userId} emergency kill switch activated`
      }
    } catch (error) {
      logger.error('Failed to check user kill switch', {
        operation: 'kill_switch_user_check_error',
        userId,
        error: error.message
      })

      // Fail open for user-specific (don't block all users if one fails)
      return {
        enabled: true,
        level: 'user',
        reason: undefined
      }
    }
  }
}

/**
 * Convenience functions for common kill switch checks
 */
export const killSwitch = EmergencyKillSwitch.getInstance()

/**
 * Guard function to check if auto-booking should proceed
 */
export async function canProceedWithAutoBooking(context: KillSwitchContext = {}): Promise<{
  canProceed: boolean
  reason?: string
  emergencyResponse?: Response
}> {
  const enabled = await killSwitch.isAutoBookingEnabled(context)
  
  if (!enabled) {
    const systemStatus = await killSwitch.getSystemStatus(context)
    const disabledComponents = Object.entries(systemStatus.components)
      .filter(([_, status]) => !status.enabled)
      .map(([name, status]) => ({ name, reason: status.reason }))

    return {
      canProceed: false,
      reason: `Auto-booking disabled by emergency kill switch`,
      emergencyResponse: new Response(JSON.stringify({
        success: false,
        error: {
          code: 'EMERGENCY_KILL_SWITCH_ACTIVE',
          message: 'Auto-booking is temporarily disabled',
          details: {
            disabledComponents,
            timestamp: new Date().toISOString()
          }
        }
      }), {
        status: 503, // Service Unavailable
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': '300' // Retry after 5 minutes
        }
      })
    }
  }

  return { canProceed: true }
}

/**
 * Guard function for payment processing
 */
export async function canProceedWithPayment(context: KillSwitchContext = {}): Promise<boolean> {
  return killSwitch.isPaymentProcessingEnabled(context)
}

/**
 * Guard function for Duffel integration
 */
export async function canProceedWithDuffel(context: KillSwitchContext = {}): Promise<boolean> {
  return killSwitch.isDuffelIntegrationEnabled(context)
}
