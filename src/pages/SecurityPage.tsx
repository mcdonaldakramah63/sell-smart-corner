
import React from 'react';
import Layout from '@/components/layout/Layout';
import { SecurityDashboard } from '@/components/security/SecurityDashboard';

const SecurityPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Security Center</h1>
          <p className="text-muted-foreground">
            Monitor your account security and manage trusted devices
          </p>
        </div>

        <SecurityDashboard />
      </div>
    </Layout>
  );
};

export default SecurityPage;
