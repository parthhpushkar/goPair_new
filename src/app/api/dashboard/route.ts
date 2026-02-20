import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/dashboard
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const [
      ridesOffered,
      myBookings,
      totalEarnings,
      unreadNotifications,
      upcomingRides,
      recentBookings,
    ] = await Promise.all([
      prisma.ride.count({ where: { driverId: userId } }),
      prisma.booking.count({ where: { userId } }),
      prisma.booking.aggregate({
        where: {
          ride: { driverId: userId },
          status: 'confirmed',
        },
        _sum: { totalPrice: true },
      }),
      prisma.notification.count({
        where: { userId, read: false },
      }),
      prisma.ride.findMany({
        where: {
          driverId: userId,
          status: 'active',
          departureDate: { gte: new Date() },
        },
        include: {
          _count: { select: { bookings: true } },
        },
        orderBy: { departureDate: 'asc' },
        take: 5,
      }),
      prisma.booking.findMany({
        where: { userId },
        include: {
          ride: {
            include: {
              driver: {
                select: { id: true, name: true, image: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 5,
      }),
    ]);

    return NextResponse.json({
      stats: {
        ridesOffered,
        ridesTaken: myBookings,
        totalEarnings: totalEarnings._sum.totalPrice || 0,
        unreadNotifications,
      },
      upcomingRides,
      recentBookings,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return NextResponse.json(
      { error: 'Failed to load dashboard' },
      { status: 500 }
    );
  }
}
