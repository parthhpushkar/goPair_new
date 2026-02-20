import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from './prisma';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      id: 'phone-otp',
      name: 'Phone OTP',
      credentials: {
        phone: { label: 'Phone', type: 'text' },
        code: { label: 'OTP', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.code) {
          throw new Error('Phone number and OTP are required');
        }

        const normalizedPhone = credentials.phone.startsWith('+')
          ? credentials.phone
          : `+${credentials.phone}`;

        // Check if OTP was verified in the verify-otp route
        const otp = await prisma.otp.findFirst({
          where: {
            phone: normalizedPhone,
            code: credentials.code,
            verified: true,
            expiresAt: { gte: new Date() },
          },
          orderBy: { createdAt: 'desc' },
        });

        if (!otp) {
          throw new Error('Invalid or expired OTP. Please verify first.');
        }

        // Find or create user
        let user = await prisma.user.findFirst({
          where: { phone: normalizedPhone },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              phone: normalizedPhone,
              email: `${normalizedPhone.replace('+', '')}@gopair.phone`,
              verified: true,
            },
          });
        }

        // Clean up used OTPs
        await prisma.otp.deleteMany({
          where: { phone: normalizedPhone },
        });

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          phone: user.phone,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = (user as any).phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).phone = token.phone;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
