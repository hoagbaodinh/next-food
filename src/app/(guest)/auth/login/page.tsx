import { auth } from '@/auth';
import Login from '@/components/auth/login';

const LoginPage = async () => {
  const session = await auth();
  console.log('Check session: >>>>');
  console.log(session);
  return <Login />;
};

export default LoginPage;
