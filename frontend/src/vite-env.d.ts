/// <reference types="vite/client" />

declare module '@mlc-ai/web-llm' {
  export class MLCEngine {
    setInitProgressCallback(cb: (report: { progress: number; text: string }) => void): void;
    reload(modelId: string): Promise<void>;
    chat: {
      completions: {
        create(params: any): Promise<any>;
      };
    };
    interruptGenerate?(): void;
    unload?(): Promise<void>;
  }
  export interface InitProgressReport {
    progress: number;
    text: string;
  }
}
