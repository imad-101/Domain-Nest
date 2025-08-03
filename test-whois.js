// Test script to verify WHOIS date parsing
const testDomains = ['google.com', 'github.com', 'example.com'];

async function fetchWhoisData(domainName) {
  try {
    const response = await fetch(`https://api.whois.vu/?q=${domainName}`, {
      headers: {
        'User-Agent': 'DomainManager/1.0',
      },
    });

    if (!response.ok) {
      throw new Error('WHOIS API request failed');
    }

    const data = await response.json();
    console.log(`\n=== ${domainName} ===`);
    console.log('Raw expires field:', data.expires, '(type:', typeof data.expires, ')');
    
    // Handle different date formats
    let expiryDate = null;
    if (data.expires) {
      // If expires is a Unix timestamp (number)
      if (typeof data.expires === 'number') {
        expiryDate = new Date(data.expires * 1000);
        console.log('Parsed as Unix timestamp:', expiryDate.toISOString());
      } else {
        // If expires is a string date
        expiryDate = new Date(data.expires);
        console.log('Parsed as string date:', expiryDate.toISOString());
      }
    } else if (data.registrar_registration_expiration_date) {
      expiryDate = new Date(data.registrar_registration_expiration_date);
      console.log('Used registrar_registration_expiration_date:', expiryDate.toISOString());
    }
    
    // Check if date is valid
    if (expiryDate && !isNaN(expiryDate.getTime())) {
      const now = new Date();
      const diffTime = expiryDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      console.log('Final expiry date:', expiryDate.toLocaleDateString());
      console.log('Days until expiry:', diffDays);
      console.log('Status:', diffDays < 0 ? 'EXPIRED' : diffDays <= 30 ? 'WARNING' : 'ACTIVE');
    } else {
      console.log('Invalid or missing expiry date');
    }
    
    return {
      registrar: data.registrar || 'Unknown',
      expiryDate: expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    };
  } catch (error) {
    console.error(`Error for ${domainName}:`, error.message);
    return {
      registrar: 'Unknown Registrar',
      expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
    };
  }
}

async function testAll() {
  console.log('Testing WHOIS date parsing...\n');
  
  for (const domain of testDomains) {
    await fetchWhoisData(domain);
    // Add delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

testAll();
