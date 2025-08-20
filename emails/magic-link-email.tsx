type MagicLinkEmailProps = {
  actionUrl: string;
  firstName: string;
  mailType: "login" | "register";
  siteName: string;
};

export const MagicLinkEmail = ({
  firstName = "",
  actionUrl,
  mailType,
  siteName,
}: MagicLinkEmailProps) => {
  const isLogin = mailType === "login";
  
  return {
    subject: isLogin ? `Sign-in link for ${siteName}` : `Activate your ${siteName} account`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>${isLogin ? 'Sign in' : 'Activate account'} - ${siteName}</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #6366f1; margin: 0; font-size: 24px;">${siteName}</h1>
          </div>
          
          <div style="background: #f8fafc; padding: 30px; border-radius: 8px; margin-bottom: 30px;">
            <h2 style="margin: 0 0 20px 0; font-size: 20px; color: #1e293b;">
              ${isLogin ? `Welcome back${firstName ? `, ${firstName}` : ''}!` : `Welcome to ${siteName}${firstName ? `, ${firstName}` : ''}!`}
            </h2>
            
            <p style="margin: 0 0 20px 0; color: #475569;">
              ${isLogin 
                ? 'Click the button below to sign in to your account.' 
                : 'Click the button below to activate your account and get started.'
              }
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${actionUrl}" 
                 style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
                ${isLogin ? 'Sign In' : 'Activate Account'}
              </a>
            </div>
            
            <p style="margin: 20px 0 0 0; font-size: 14px; color: #64748b;">
              This link will expire in 24 hours for security reasons.
            </p>
          </div>
          
          <div style="text-align: center; font-size: 12px; color: #94a3b8;">
            <p>If you didn't request this email, you can safely ignore it.</p>
            <p>© ${new Date().getFullYear()} ${siteName}. All rights reserved.</p>
          </div>
        </body>
      </html>
    `,
    text: `
${isLogin ? `Welcome back${firstName ? `, ${firstName}` : ''}!` : `Welcome to ${siteName}${firstName ? `, ${firstName}` : ''}!`}

${isLogin 
  ? 'Click the link below to sign in to your account:' 
  : 'Click the link below to activate your account and get started:'
}

${actionUrl}

This link will expire in 24 hours for security reasons.

If you didn't request this email, you can safely ignore it.

© ${new Date().getFullYear()} ${siteName}. All rights reserved.
    `.trim()
  };
};
