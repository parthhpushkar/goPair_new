import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, code } = body;

    if (!phone || !code) {
      return NextResponse.json(
        { error: 'Phone number and OTP are required' },
        { status: 400 }
      );
    }

    const normalizedPhone = phone.startsWith('+') ? phone : `+${phone}`;

    // Find the latest unverified OTP for this phone
    const otp = await prisma.otp.findFirst({
      where: {
        phone: normalizedPhone,
        code,
        verified: false,
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otp) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP. Please request a new one.' },
        { status: 400 }
      );
    }

    // Mark OTP as verified
    await prisma.otp.update({
      where: { id: otp.id },
      data: { verified: true },
    });

    // Check if user exists with this phone number
    let user = await prisma.user.findFirst({
      where: { phone: normalizedPhone },
    });

    let isNewUser = false;

    if (!user) {
      // Create a new user with just the phone number
      user = await prisma.user.create({
        data: {
          phone: normalizedPhone,
          email: `${normalizedPhone.replace('+', '')}@gopair.phone`, // placeholder email
          verified: true,
        },
      });
      isNewUser = true;
    } else {
      // Mark existing user as verified
      await prisma.user.update({
        where: { id: user.id },
        data: { verified: true },
      });
    }

    return NextResponse.json(
      {
        message: 'OTP verified successfully',
        isNewUser,
        userId: user.id,
        phone: normalizedPhone,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verify OTP error:', error);
    return NextResponse.json(
      { error: 'Failed to verify OTP. Please try again.' },
      { status: 500 }
    );
  }
}
