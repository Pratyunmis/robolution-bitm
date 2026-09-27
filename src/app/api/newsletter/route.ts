import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

const EMAIL_REGEX = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const rateLimit = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5;

export async function POST(request: NextRequest) {
  try {
    // Basic Rate Limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const now = Date.now();
    const rateRecord = rateLimit.get(ip);

    if (rateRecord) {
      if (now - rateRecord.timestamp < RATE_LIMIT_WINDOW) {
        if (rateRecord.count >= MAX_REQUESTS) {
          return NextResponse.json({ error: 'Too many requests, please try again later' }, { status: 429 });
        }
        rateRecord.count += 1;
      } else {
        rateLimit.set(ip, { count: 1, timestamp: now });
      }
    } else {
      rateLimit.set(ip, { count: 1, timestamp: now });
    }

    // Safely parse JSON body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const { email } = body;

    // Strict validation
    if (!email || typeof email !== 'string' || email.length > 254 || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const payload = await getPayload({ config })
    const sanitizedEmail = email.trim().toLowerCase();

    // Check if email already exists
    const existing = await payload.find({
      collection: 'newsletter',
      where: {
        email: {
          equals: sanitizedEmail,
        },
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      return NextResponse.json(
        { error: 'This email is already subscribed to our newsletter' },
        { status: 400 },
      )
    }

    // Create new subscription
    await payload.create({
      collection: 'newsletter',
      data: {
        email: sanitizedEmail,
        active: true,
        subscribedAt: new Date().toISOString(),
      },
    })

    return NextResponse.json({ message: 'Successfully subscribed to newsletter' }, { status: 200 })
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
