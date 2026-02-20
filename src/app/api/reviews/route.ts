import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// POST /api/reviews
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { rideId, targetId, rating, comment } = body;

    if (!rideId || !targetId || !rating) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Create review and update target's average rating
    const review = await prisma.review.create({
      data: {
        rideId,
        authorId: (session.user as any).id,
        targetId,
        rating,
        comment: comment || null,
      },
      include: {
        author: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    // Recalculate average rating
    const avgRating = await prisma.review.aggregate({
      where: { targetId },
      _avg: { rating: true },
    });

    await prisma.user.update({
      where: { id: targetId },
      data: { rating: avgRating._avg.rating || 0 },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Create review error:', error);
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    );
  }
}
