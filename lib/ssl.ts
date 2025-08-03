import * as tls from 'tls';
import { promisify } from 'util';

export interface SSLCertificateInfo {
  expiryDate: Date | null;
  issuer: string;
  status: 'valid' | 'expired' | 'warning' | 'error';
  daysUntilExpiry: number;
}

export async function checkSSLCertificate(domain: string): Promise<SSLCertificateInfo> {
  return new Promise((resolve) => {
    // Remove protocol if present
    const cleanDomain = domain.replace(/^https?:\/\//, '');
    
    const options = {
      host: cleanDomain,
      port: 443,
      servername: cleanDomain,
      rejectUnauthorized: false, // We want to check even invalid certs
    };

    const socket = tls.connect(options, () => {
      try {
        const cert = socket.getPeerCertificate();
        
        if (!cert || !cert.valid_to) {
          socket.destroy();
          return resolve({
            expiryDate: null,
            issuer: 'Unknown',
            status: 'error',
            daysUntilExpiry: 0,
          });
        }

        const expiryDate = new Date(cert.valid_to);
        const now = new Date();
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        let status: 'valid' | 'expired' | 'warning' | 'error' = 'valid';
        if (daysUntilExpiry < 0) {
          status = 'expired';
        } else if (daysUntilExpiry <= 30) {
          status = 'warning';
        }

        const issuer = cert.issuer?.CN || cert.issuer?.O || 'Unknown Issuer';

        socket.destroy();
        resolve({
          expiryDate,
          issuer,
          status,
          daysUntilExpiry,
        });
      } catch (error) {
        console.error(`SSL check error for ${domain}:`, error);
        socket.destroy();
        resolve({
          expiryDate: null,
          issuer: 'Unknown',
          status: 'error',
          daysUntilExpiry: 0,
        });
      }
    });

    socket.on('error', (error) => {
      console.error(`SSL connection error for ${domain}:`, error);
      resolve({
        expiryDate: null,
        issuer: 'Unknown',
        status: 'error',
        daysUntilExpiry: 0,
      });
    });

    // Timeout after 10 seconds
    socket.setTimeout(10000, () => {
      socket.destroy();
      resolve({
        expiryDate: null,
        issuer: 'Unknown',
        status: 'error',
        daysUntilExpiry: 0,
      });
    });
  });
}

export function getSSLStatusColor(status: string): string {
  switch (status) {
    case 'valid':
      return 'default';
    case 'warning':
      return 'secondary';
    case 'expired':
      return 'destructive';
    case 'error':
      return 'outline';
    default:
      return 'outline';
  }
}

export function getSSLStatusText(status: string, daysUntilExpiry: number): string {
  switch (status) {
    case 'valid':
      return `Valid (${daysUntilExpiry} days)`;
    case 'warning':
      return `Expires soon (${daysUntilExpiry} days)`;
    case 'expired':
      return 'Expired';
    case 'error':
      return 'Check failed';
    default:
      return 'Unknown';
  }
}
