interface CacheServiceInterface {
  set(key: string, value: unknown): Promise<unknown>;
  get(key: string): Promise<unknown>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}

export default CacheServiceInterface;
