import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/rides - Search rides
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const origin = searchParams.get('origin');
    const destination = searchParams.get('destination');
    const date = searchParams.get('date');
    const passengers = searchParams.get('passengers');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'departureDate';
    const sortOrder = searchParams.get('sortOrder') || 'asc';

    const where: any = {
      status: 'active',
      availableSeats: { gte: parseInt(passengers || '1') },
    };

    if (origin) {
      where.origin = { contains: origin };
    }
    if (destination) {
      where.destination = { contains: destination };
    }
    if (date) {
      const searchDate = new Date(date);
      const nextDay = new Date(searchDate);
      nextDay.setDate(nextDay.getDate() + 1);
      where.departureDate = {
        gte: searchDate,
        lt: nextDay,
      };
    }

    const [rides, total] = await Promise.all([
      prisma.ride.findMany({
        where,
        include: {
          driver: {
            select: {
              id: true,
              name: true,
              image: true,
              rating: true,
              totalRides: true,
              verified: true,
            },
          },
          vehicle: true,
          stops: { orderBy: { order: 'asc' } },
          _count: { select: { bookings: true } },
        },
        orderBy: { [sortBy]: sortOrder },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.ride.count({ where }),
    ]);

    return NextResponse.json({
      rides,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Search rides error:', error);
    return NextResponse.json(
      { error: 'Failed to search rides' },
      { status: 500 }
    );
  }
}

// POST /api/rides - Create a ride
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      origin,
      destination,
      departureDate,
      departureTime,
      estimatedArrival,
      seats,
      price,
      description,
      vehicleId,
      allowPets,
      allowSmoking,
      allowLuggage,
      recurring,
      stops,
    } = body;

    if (!origin || !destination || !departureDate || !departureTime || !seats || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const ride = await prisma.ride.create({
      data: {
        driverId: (session.user as any).id,
        origin,
        destination,
        departureDate: new Date(departureDate),
        departureTime,
        estimatedArrival: estimatedArrival || null,
        seats: parseInt(seats),
        availableSeats: parseInt(seats),
        price: parseFloat(price),
        description: description || null,
        vehicleId: vehicleId || null,
        allowPets: allowPets || false,
        allowSmoking: allowSmoking || false,
        allowLuggage: allowLuggage !== false,
        recurring: recurring || false,
        stops: stops
          ? {
              create: stops.map((stop: any, index: number) => ({
                name: stop.name,
                order: index,
                price: stop.price ? parseFloat(stop.price) : null,
              })),
            }
          : undefined,
      },
      include: {
        driver: {
          select: {
            id: true,
            name: true,
            image: true,
            rating: true,
          },
        },
        vehicle: true,
        stops: true,
      },
    });

    return NextResponse.json(ride, { status: 201 });
  } catch (error) {
    console.error('Create ride error:', error);
    return NextResponse.json(
      { error: 'Failed to create ride' },
      { status: 500 }
    );
  }
}
