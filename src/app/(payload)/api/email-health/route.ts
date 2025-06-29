import { emailMonitoring } from '@/utilities/emailService';
import { NextRequest, NextResponse } from 'next/server';

// Admin-only endpoint to check email health
export async function GET(request: NextRequest) {
  try {
    // Simple authentication check (you might want to implement proper auth)
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.ADMIN_API_TOKEN;

    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const healthCheck = await emailMonitoring.testEmailConfig();

    return NextResponse.json({
      status: healthCheck.success ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      sendgrid: {
        configured: !!process.env.SENDGRID_API_KEY,
        fromEmail: process.env.SENDGRID_FROM_EMAIL,
        fromName: process.env.SENDGRID_FROM_NAME,
      },
      ...healthCheck,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

// Admin endpoint to clear rate limits
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.ADMIN_API_TOKEN;

    if (!expectedToken || authHeader !== `Bearer ${expectedToken}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { email, type } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    emailMonitoring.clearRateLimit(email, type);

    return NextResponse.json({
      success: true,
      message: `Rate limit cleared for ${email}${type ? ` (${type})` : ''}`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
