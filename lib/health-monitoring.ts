// Use browser-compatible performance API
const getPerformanceNow = () => {
  if (typeof performance !== 'undefined') {
    return performance.now();
  }
  // Fallback for server-side or environments without performance API
  return Date.now();
};

export interface HealthCheckResult {
  isUp: boolean;
  responseTime: number;
  statusCode?: number;
  errorMessage?: string;
  performanceMetrics?: {
    ttfb: number;
    domainLookup: number;
    connect: number;
    tlsHandshake?: number;
    contentTransfer: number;
  };
}

export interface DomainHealthScore {
  overall: number;
  uptime: number;
  performance: number;
  ssl: number;
  factors: {
    uptimePercentage: number;
    avgResponseTime: number;
    sslValidDays: number;
    errorRate: number;
  };
}

export async function checkDomainHealth(domain: string): Promise<HealthCheckResult> {
  const startTime = getPerformanceNow();
  const url = domain.startsWith('http') ? domain : `https://${domain}`;
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
    
    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Domain-Health-Monitor/1.0',
      },
    });
    
    clearTimeout(timeoutId);
    const endTime = getPerformanceNow();
    const responseTime = Math.round(endTime - startTime);
    
    return {
      isUp: response.ok,
      responseTime,
      statusCode: response.status,
      performanceMetrics: await measurePerformanceMetrics(url),
    };
  } catch (error: any) {
    const endTime = getPerformanceNow();
    const responseTime = Math.round(endTime - startTime);
    
    return {
      isUp: false,
      responseTime,
      errorMessage: error.message || 'Unknown error',
    };
  }
}

async function measurePerformanceMetrics(url: string) {
  try {
    const startTime = getPerformanceNow();
    let domainLookupTime = 0;
    let connectTime = 0;
    let tlsHandshakeTime = 0;
    let ttfbTime = 0;
    let contentTransferTime = 0;
    
    const response = await fetch(url, {
      method: 'HEAD',
      headers: {
        'User-Agent': 'Domain-Health-Monitor/1.0',
      },
    });
    
    const endTime = getPerformanceNow();
    const totalTime = endTime - startTime;
    
    // For Node.js environment, we'll estimate these values
    // In a real-world scenario, you might want to use a more sophisticated timing approach
    ttfbTime = Math.round(totalTime * 0.7); // Estimate TTFB as 70% of total time
    contentTransferTime = Math.round(totalTime * 0.3); // Remaining 30%
    domainLookupTime = Math.round(totalTime * 0.1); // Estimate DNS lookup
    connectTime = Math.round(totalTime * 0.2); // Estimate connection time
    tlsHandshakeTime = url.startsWith('https') ? Math.round(totalTime * 0.15) : 0;
    
    return {
      ttfb: ttfbTime,
      domainLookup: domainLookupTime,
      connect: connectTime,
      tlsHandshake: tlsHandshakeTime,
      contentTransfer: contentTransferTime,
    };
  } catch (error) {
    return {
      ttfb: 0,
      domainLookup: 0,
      connect: 0,
      tlsHandshake: 0,
      contentTransfer: 0,
    };
  }
}
