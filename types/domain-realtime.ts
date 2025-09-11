// Real-time domain health data types

export interface DnsRecord {
  type: string;
  name: string;
  value: string;
  ttl?: number;
}

export interface SslInfo {
  issuer: string;
  subject: string;
  validFrom: string;
  validTo: string;
  daysUntilExpiry: number;
  isValid: boolean;
}

export interface UptimeCheck {
  isUp: boolean;
  responseTime: number;
  statusCode?: number;
  errorMessage?: string;
  timestamp: Date;
}

export interface PerformanceMetrics {
  responseTime: number;
  ttfb: number;
  domainLookup: number;
  connect: number;
  tlsHandshake: number;
  contentTransfer: number;
  timestamp: Date;
}

export interface DomainHealthData {
  domain: string;
  dnsRecords: DnsRecord[];
  sslInfo: SslInfo | null;
  uptime: UptimeCheck;
  performance: PerformanceMetrics;
  nameservers: string[];
  healthScore: number;
}

export interface RealtimeDomainData {
  isLoading: boolean;
  healthData: DomainHealthData | null;
  error: string | null;
}
