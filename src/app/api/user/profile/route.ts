import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// GET /api/user/profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: (session.user as any).id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phone: true,
        bio: true,
        rating: true,
        totalRides: true,
        verified: true,
        createdAt: true,
        vehicles: true,
        _count: {
          select: {
            ridesOffered: true,
            bookings: true,
            reviewsReceived: true,
          },
        },
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    return NextResponse.json(
      { error: 'Failed to get profile' },
      { status: 500 }
    );
  }
}

// PUT /api/user/profile
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, phone, bio, currentPassword, newPassword } = body;

    const updateData: any = {};

    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (bio !== undefined) updateData.bio = bio;

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { error: 'Current password is required' },
          { status: 400 }
        );
      }

      const user = await prisma.user.findUnique({
        where: { id: (session.user as any).id },
      });

      if (!user?.password) {
        return NextResponse.json(
          { error: 'Cannot change password for OAuth accounts' },
          { status: 400 }
        );
      }

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return NextResponse.json(
          { error: 'Current password is incorrect' },
          { status: 400 }
        );
      }

      updateData.password = await bcrypt.hash(newPassword, 12);
    }

    const updatedUser = await prisma.user.update({
      where: { id: (session.user as any).id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        bio: true,
        image: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
