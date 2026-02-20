import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// POST /api/bookings - Create a booking
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { rideId, seats } = body;

    const ride = await prisma.ride.findUnique({
      where: { id: rideId },
      include: { driver: true },
    });

    if (!ride) {
      return NextResponse.json({ error: 'Ride not found' }, { status: 404 });
    }

    if (ride.driverId === (session.user as any).id) {
      return NextResponse.json(
        { error: 'You cannot book your own ride' },
        { status: 400 }
      );
    }

    if (ride.availableSeats < (seats || 1)) {
      return NextResponse.json(
        { error: 'Not enough available seats' },
        { status: 400 }
      );
    }

    // Check for existing booking
    const existingBooking = await prisma.booking.findFirst({
      where: {
        rideId,
        userId: (session.user as any).id,
        status: { in: ['pending', 'confirmed'] },
      },
    });

    if (existingBooking) {
      return NextResponse.json(
        { error: 'You already have a booking for this ride' },
        { status: 400 }
      );
    }

    const seatCount = seats || 1;
    const totalPrice = ride.price * seatCount;

    const [booking] = await prisma.$transaction([
      prisma.booking.create({
        data: {
          rideId,
          userId: (session.user as any).id,
          seats: seatCount,
          totalPrice,
          status: 'confirmed',
        },
        include: {
          ride: true,
          user: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
      prisma.ride.update({
        where: { id: rideId },
        data: {
          availableSeats: { decrement: seatCount },
        },
      }),
      prisma.notification.create({
        data: {
          userId: ride.driverId,
          type: 'booking',
          title: 'New Booking',
          message: `${session.user.name} booked ${seatCount} seat(s) on your ride from ${ride.origin} to ${ride.destination}`,
          link: `/rides/${rideId}`,
        },
      }),
    ]);

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Create booking error:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

// GET /api/bookings - Get user bookings
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const bookings = await prisma.booking.findMany({
      where: { userId: (session.user as any).id },
      include: {
        ride: {
          include: {
            driver: {
              select: {
                id: true,
                name: true,
                image: true,
                rating: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Get bookings error:', error);
    return NextResponse.json(
      { error: 'Failed to get bookings' },
      { status: 500 }
    );
  }
}
