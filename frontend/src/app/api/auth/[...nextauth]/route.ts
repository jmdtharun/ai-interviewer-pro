import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'demo-google-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'demo-google-client-secret',
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'candidate@pro.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          const user = await res.json();
          if (res.ok && user?.access_token) {
            return {
              id: user.user.id,
              name: user.user.full_name,
              email: user.user.email,
              role: user.user.role,
              accessToken: user.access_token,
            };
          }
        } catch (e) {
          console.warn('NextAuth credentials authorize error:', e);
        }

        // Demo user fallback
        if (credentials.email === 'candidate@pro.com' && credentials.password === 'password123') {
          return {
            id: 'usr_demo_candidate_123',
            name: 'Alex Mercer',
            email: 'candidate@pro.com',
            role: 'candidate',
            accessToken: 'demo_jwt_access_token',
          };
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).accessToken = token.accessToken;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET || 'super-secret-nextauth-key-2026',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
