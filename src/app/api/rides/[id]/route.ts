import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/rides/[id] - Get ride details
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const ride = await prisma.ride.findUnique({
      where: { id: params.id },
      include: {
        driver: {
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
          },
        },
        vehicle: true,
        stops: { orderBy: { order: 'asc' } },
        bookings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
                rating: true,
              },
            },
          },
        },
        reviews: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!ride) {
      return NextResponse.json({ error: 'Ride not found' }, { status: 404 });
    }

    return NextResponse.json(ride);
  } catch (error) {
    console.error('Get ride error:', error);
    return NextResponse.json(
      { error: 'Failed to get ride' },
      { status: 500 }
    );
  }
}
