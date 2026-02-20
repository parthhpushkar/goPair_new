export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import twilio from 'twilio';

const twilioClient = twilio(
  process.env.TWILIO_ACCOUNT_SID!,
  process.env.TWILIO_AUTH_TOKEN!
);

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone } = body;

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone number is required' },
        { status: 400 }
      );
    }

    // Normalize phone number (ensure it starts with +)
    const normalizedPhone = phone.startsWith('+') ? phone : `+${phone}`;

    // Rate limiting: max 5 OTPs per phone per 10 minutes
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const recentOtps = await prisma.otp.count({
      where: {
        phone: normalizedPhone,
        createdAt: { gte: tenMinutesAgo },
      },
    });

    if (recentOtps >= 5) {
      return NextResponse.json(
        { error: 'Too many OTP requests. Please try again after some time.' },
        { status: 429 }
      );
    }

    // Generate OTP
    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes expiry

    // Delete any previous unused OTPs for this phone
    await prisma.otp.deleteMany({
      where: {
        phone: normalizedPhone,
        verified: false,
      },
    });

    // Store OTP in database
    await prisma.otp.create({
      data: {
        phone: normalizedPhone,
        code,
        expiresAt,
      },
    });

    // Send OTP via Twilio SMS
    await twilioClient.messages.create({
      body: `Your goPair verification code is: ${code}. Valid for 5 minutes. Do not share this with anyone.`,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: normalizedPhone,
    });

    return NextResponse.json(
      { message: 'OTP sent successfully', phone: normalizedPhone },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Send OTP error:', error);

    // Handle Twilio-specific errors
    if (error?.code === 21211) {
      return NextResponse.json(
        { error: 'Invalid phone number. Please check and try again.' },
        { status: 400 }
      );
    }
    if (error?.code === 21608 || error?.code === 21612) {
      return NextResponse.json(
        { error: 'Unable to send SMS to this number. Please verify your Twilio configuration.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to send OTP. Please try again.' },
      { status: 500 }
    );
  }
}
