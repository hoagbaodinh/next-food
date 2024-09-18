import { auth } from '@/auth';
import HomePage from '@/components/layout/homepage';
import { useSession } from 'next-auth/react';

export default async function Home() {
  return (
    <div>
      <HomePage />
    </div>
  );
}
