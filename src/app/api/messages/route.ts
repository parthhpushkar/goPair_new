import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// POST /api/messages
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { receiverId, content } = body;

    if (!receiverId || !content) {
      return NextResponse.json(
        { error: 'Receiver and content are required' },
        { status: 400 }
      );
    }

    const message = await prisma.message.create({
      data: {
        senderId: (session.user as any).id,
        receiverId,
        content,
      },
      include: {
        sender: {
          select: { id: true, name: true, image: true },
        },
      },
    });

    // Create notification
    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: 'message',
        title: 'New Message',
        message: `${session.user.name} sent you a message`,
        link: '/messages',
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

// GET /api/messages?userId=xxx
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const currentUserId = (session.user as any).id;

    if (userId) {
      // Get conversation with specific user
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: currentUserId, receiverId: userId },
            { senderId: userId, receiverId: currentUserId },
          ],
        },
        include: {
          sender: {
            select: { id: true, name: true, image: true },
          },
        },
        orderBy: { createdAt: 'asc' },
      });

      // Mark messages as read
      await prisma.message.updateMany({
        where: {
          senderId: userId,
          receiverId: currentUserId,
          read: false,
        },
        data: { read: true },
      });

      return NextResponse.json(messages);
    }

    // Get conversations (latest message per user)
    const sentMessages = await prisma.message.findMany({
      where: { senderId: currentUserId },
      include: {
        receiver: {
          select: { id: true, name: true, image: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const receivedMessages = await prisma.message.findMany({
      where: { receiverId: currentUserId },
      include: {
        sender: {
          select: { id: true, name: true, image: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Build conversations list
    const conversationsMap = new Map();

    [...sentMessages, ...receivedMessages].forEach((msg) => {
      const otherUser =
        'receiver' in msg
          ? (msg as any).receiver
          : (msg as any).sender;

      if (!conversationsMap.has(otherUser.id)) {
        conversationsMap.set(otherUser.id, {
          user: otherUser,
          lastMessage: msg.content,
          lastMessageAt: msg.createdAt,
          unread: !msg.read && msg.receiverId === currentUserId ? 1 : 0,
        });
      }
    });

    const conversations = Array.from(conversationsMap.values()).sort(
      (a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    );

    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'Failed to get messages' },
      { status: 500 }
    );
  }
}
