// Client-side utilities for health monitoring
export function getHealthScoreColor(score: number): string {
  if (score >= 90) return 'text-green-600';
  if (score >= 70) return 'text-yellow-600';
  return 'text-red-600';
}

export function getHealthScoreBadgeVariant(score: number): 'default' | 'secondary' | 'destructive' {
  if (score >= 90) return 'default';
  if (score >= 70) return 'secondary';
  return 'destructive';
}

export function getUptimeStatus(uptimePercentage: number): {
  status: string;
  color: string;
  variant: 'default' | 'secondary' | 'destructive';
} {
  if (uptimePercentage >= 99) {
    return { status: 'Excellent', color: 'text-green-600', variant: 'default' };
  } else if (uptimePercentage >= 95) {
    return { status: 'Good', color: 'text-blue-600', variant: 'default' };
  } else if (uptimePercentage >= 90) {
    return { status: 'Fair', color: 'text-yellow-600', variant: 'secondary' };
  } else {
    return { status: 'Poor', color: 'text-red-600', variant: 'destructive' };
  }
}

export interface DomainHealthScore {
  overall: number;
  uptime: number;
  performance: number;
  ssl: number;
}

// This function can be used on both client and server side
export function calculateHealthScore(
  uptimePercentage: number,
  avgResponseTime: number,
  sslValidDays: number,
  errorRate: number = 0
): DomainHealthScore {
  // Uptime score (40% weight)
  const uptimeScore = Math.min(uptimePercentage, 100);
  
  // Performance score (30% weight) - based on response time
  let performanceScore = 100;
  if (avgResponseTime > 5000) performanceScore = 0;
  else if (avgResponseTime > 3000) performanceScore = 30;
  else if (avgResponseTime > 2000) performanceScore = 50;
  else if (avgResponseTime > 1000) performanceScore = 70;
  else if (avgResponseTime > 500) performanceScore = 85;
  else performanceScore = 100;
  
  // SSL score (30% weight) - based on days until expiry
  let sslScore = 100;
  if (sslValidDays < 0) sslScore = 0; // Expired
  else if (sslValidDays < 7) sslScore = 20; // Expires in less than a week
  else if (sslValidDays < 30) sslScore = 60; // Expires in less than a month
  else if (sslValidDays < 90) sslScore = 80; // Expires in less than 3 months
  else sslScore = 100; // More than 3 months
  
  // Calculate weighted overall score
  const overallScore = Math.round(
    (uptimeScore * 0.4) + (performanceScore * 0.3) + (sslScore * 0.3)
  );
  
  return {
    overall: Math.max(0, Math.min(100, overallScore)),
    uptime: Math.round(uptimeScore),
    performance: Math.round(performanceScore),
    ssl: Math.round(sslScore),
  };
}
