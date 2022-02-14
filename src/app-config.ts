import dotenv from 'dotenv';
import { StringUtils } from './utils/string-utils';

export class AppConfig {
  port: number;
  webhook_secret: string;
  deploy_url: string;

  private environment: NodeJS.ProcessEnv;

  private static instance: AppConfig;

  static getInstance() {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    return AppConfig.instance;
  }

  constructor() {
    dotenv.config();
    this.environment = process.env;
    this.port = this.getIntegerEnvVar('PORT');
    this.webhook_secret = this.getStringEnvVar('WEBHOOK_SECRET');
    this.deploy_url = this.getStringEnvVar('DEPLOY_URL');
  }

  /// //////////////////////

  private getBooleanEnvVar(
    variableName: string,
    defaultValue?: boolean
  ): boolean {
    const value = this.getEnvVar(variableName, defaultValue ?? null);

    const errorMessage = `Environment Variable ${variableName} does not contain a valid boolean`;

    return StringUtils.parseBoolean(value, errorMessage);
  }

  private getIntegerEnvVar(
    variableName: string,
    defaultValue?: number
  ): number {
    const value = this.getEnvVar(variableName, defaultValue ?? null);

    const errorMessage = `Environment Variable ${variableName} does not contain a valid integer`;

    return StringUtils.parseInt(value, errorMessage);
  }

  private getStringEnvVar(variableName: string, defaultValue?: string): string {
    return this.getEnvVar(variableName, defaultValue ?? null);
  }

  private getEnvVar(
    variableName: string,
    defaultValue: boolean | number | string | null
  ): string {
    const value = this.environment[variableName] || defaultValue;

    if (value == null) {
      throw new Error(`Environment Variable ${variableName} must be set!`);
    }

    return String(value);
  }
}
