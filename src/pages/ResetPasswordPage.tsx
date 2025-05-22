
import Layout from '@/components/layout/Layout';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

const ResetPasswordPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            Reset Password
          </h1>
          <ResetPasswordForm />
        </div>
      </div>
    </Layout>
  );
};

export default ResetPasswordPage;
