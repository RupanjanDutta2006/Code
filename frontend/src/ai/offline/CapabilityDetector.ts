import { OfflineAICapabilities } from '../types';

export class CapabilityDetector {
  private static cachedResult: OfflineAICapabilities | null = null;

  public static async detect(): Promise<OfflineAICapabilities> {
    if (this.cachedResult) {
      return this.cachedResult;
    }

    const hasWasm = typeof WebAssembly === 'object' && typeof WebAssembly.instantiate === 'function';
    let hasWebGPU = false;
    let persistentStorage = false;
    let storageEstimateMB = 0;
    let availableStorageMB = 0;

    // 1. WebGPU check
    try {
      if ('gpu' in navigator && (navigator as any).gpu) {
        const adapter = await (navigator as any).gpu.requestAdapter();
        hasWebGPU = Boolean(adapter);
      }
    } catch {
      hasWebGPU = false;
    }

    // 2. Storage Quota check
    try {
      if (navigator.storage && navigator.storage.estimate) {
        const estimate = await navigator.storage.estimate();
        if (estimate.quota) {
          storageEstimateMB = Math.round(estimate.quota / (1024 * 1024));
        }
        if (estimate.quota !== undefined && estimate.usage !== undefined) {
          availableStorageMB = Math.round((estimate.quota - estimate.usage) / (1024 * 1024));
        }
      }
      if (navigator.storage && navigator.storage.persisted) {
        persistentStorage = await navigator.storage.persisted();
      }
    } catch {
      availableStorageMB = 2048; // Assume standard available
    }

    // Determine readiness
    const supported = hasWebGPU || hasWasm;
    let reason = undefined;
    if (!supported) {
      reason = 'Neither WebGPU nor WebAssembly is supported in this browser environment.';
    } else if (!hasWebGPU) {
      reason = 'WebGPU is unavailable; running via optimized CPU WebAssembly mode.';
    }

    this.cachedResult = {
      webGPU: hasWebGPU,
      wasm: hasWasm,
      persistentStorage,
      storageEstimateMB,
      availableStorageMB,
      supported,
      reason,
    };

    return this.cachedResult;
  }

  public static async requestPersistence(): Promise<boolean> {
    try {
      if (navigator.storage && navigator.storage.persist) {
        const isPersisted = await navigator.storage.persist();
        if (this.cachedResult) {
          this.cachedResult.persistentStorage = isPersisted;
        }
        return isPersisted;
      }
    } catch {
      // Ignore
    }
    return false;
  }
}
