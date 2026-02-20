import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/user/vehicles
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const vehicles = await prisma.vehicle.findMany({
      where: { userId: (session.user as any).id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(vehicles);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get vehicles' }, { status: 500 });
  }
}

// POST /api/user/vehicles
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { make, model, year, color, plate } = body;

    if (!make || !model || !year || !color || !plate) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const vehicle = await prisma.vehicle.create({
      data: {
        userId: (session.user as any).id,
        make,
        model,
        year: parseInt(year),
        color,
        plate,
      },
    });

    return NextResponse.json(vehicle, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add vehicle' }, { status: 500 });
  }
}
