import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import {
  InactiveAccountError,
  InvalidEmailPasswordError,
} from './utils/errors';
import { sendRequest } from './utils/api';
import { IUser } from './types/next-auth';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentials) => {
        const { username, password } = credentials;
        const res = await sendRequest<IBackendRes<ILogin>>({
          method: 'POST',
          url: 'http://localhost:8080/api/v1/auth/login',
          body: {
            username,
            password,
          },
        });
        console.log('>>>Check RES');
        if (res.statusCode === 201) {
          // return user object with their profile data
          return {
            _id: res.data?.user?._id,
            email: res.data?.user?.email,
            name: res.data?.user?.name,
            access_token: res.data?.access_token,
          };
        }
        // sai mat khau
        else if (+res.statusCode === 401) {
          throw new InvalidEmailPasswordError();
        } else if (+res.statusCode === 400) {
          throw new InactiveAccountError();
        } else {
          throw new Error('Internal Server Error');
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        // User is available during sign-in
        token.user = user as IUser;
      }
      return token;
    },
    session({ session, token }) {
      (session.user as IUser) = token.user;
      return session;
    },
  },
});
