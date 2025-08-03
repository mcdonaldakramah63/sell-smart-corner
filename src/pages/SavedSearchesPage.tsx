
import Layout from '@/components/layout/Layout';
import { Seo } from "@/components/layout/Seo";
import { SavedSearchesManager } from '@/components/products/search/SavedSearchesManager';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const SavedSearchesPage = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <Layout>
      <Seo
        title="Saved Searches | Used Market"
        description="Manage your saved searches and get alerts when new matching items are posted."
        keywords="saved searches, alerts, notifications, marketplace"
        canonicalUrl="https://d3616aa2-da41-4916-957d-8d8533d680a4.lovableproject.com/saved-searches"
      />
      <div className="container mx-auto px-4 py-8">
        <SavedSearchesManager />
      </div>
    </Layout>
  );
};

export default SavedSearchesPage;
