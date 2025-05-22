
import Layout from '@/components/layout/Layout';
import UpdatePasswordForm from '@/components/auth/UpdatePasswordForm';

const UpdatePasswordPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            Update Password
          </h1>
          <UpdatePasswordForm />
        </div>
      </div>
    </Layout>
  );
};

export default UpdatePasswordPage;
