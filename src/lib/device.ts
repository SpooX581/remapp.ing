import type { Config, DeviceInfo } from '@/lib/config';
import type { Layout } from '@/lib/layout';

export type ConnectionState = 'disconnected' | 'connecting' | 'connected';

export abstract class ConnectionManager {
  public abstract connect(stateCb: (state: ConnectionState) => void): Promise<void>;

  public abstract disconnect(): Promise<void>;

  public abstract getDeviceInfo(): Promise<DeviceInfo | null>;

  public abstract getConfig(layout: Layout): Promise<Config | null>;

  public abstract setConfig(layout: Layout, config: Config): Promise<boolean>;
}
