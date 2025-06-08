
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/layout/HeroSection';
import CategoryFilter from '@/components/products/CategoryFilter';
import SearchBar from '@/components/products/SearchBar';
import { Button } from '@/components/ui/button';
import { categories } from '@/lib/mockData';

const Index = () => {
  const navigate = useNavigate();
  
  const handleSeeAllProducts = () => {
    navigate('/products');
  };
  
  const handleSearch = (query: string) => {
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  return (
    <Layout>
      <HeroSection />
      
      <section className="py-12 container mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6">Find what you need</h2>
          <SearchBar onSearch={handleSearch} />
          <CategoryFilter 
            categories={categories}
            selectedCategory={null}
            onSelectCategory={(category) => {
              if (category) {
                navigate(`/products?category=${encodeURIComponent(category)}`);
              }
            }}
          />
        </div>
      </section>
      
      <section className="py-12 container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-marketplace-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-marketplace-primary">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
            <p className="text-muted-foreground">
              Sign up for free and join our trusted Used Market community.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="bg-marketplace-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-marketplace-primary">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Buy or Sell</h3>
            <p className="text-muted-foreground">
              List your items for sale or browse products from other users.
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center">
            <div className="bg-marketplace-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-marketplace-primary">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Connect & Complete</h3>
            <p className="text-muted-foreground">
              Chat with buyers or sellers and complete your transactions safely.
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-12 bg-marketplace-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of users buying and selling on Used Market every day.
          </p>
          <Button asChild size="lg" className="bg-white text-marketplace-primary hover:bg-white/90">
            <a href="/auth/register">Create Your Account</a>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
