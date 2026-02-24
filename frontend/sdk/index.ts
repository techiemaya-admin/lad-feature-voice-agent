/**
 * Voice Agent Frontend SDK
 * 
 * LAD Architecture Compliant SDK for voice agent features
 * 
 * Usage:
 * ```typescript
 * import { useCancelCalls, useCallStatus } from './sdk/features/voice-agent';
 * 
 * // In your component:
 * const cancelMutation = useCancelCalls();
 * cancelMutation.mutate({ resource_id: 'batch-xxx', force: true });
 * ```
 */

// Re-export voice agent feature
export * from './features/voice-agent';

// You can add more feature exports here as your SDK grows
// export * from './features/billing';
// export * from './features/leads';
