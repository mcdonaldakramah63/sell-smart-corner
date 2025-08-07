
export default function HowItWorksSection() {
  return (
    <section className="py-20 gradient-surface">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center text-marketplace-secondary">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center marketplace-card p-8 hover:transform hover:scale-105 transition-all duration-300">
            <div className="gradient-primary w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-glow">
              <span className="text-3xl font-bold text-white">1</span>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-marketplace-secondary">Create an Account</h3>
            <p className="text-muted-foreground text-lg">Sign up for free and join our trusted marketplace community with verified users.</p>
          </div>
          <div className="flex flex-col items-center text-center marketplace-card p-8 hover:transform hover:scale-105 transition-all duration-300">
            <div className="gradient-primary w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-glow">
              <span className="text-3xl font-bold text-white">2</span>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-marketplace-secondary">Buy or Sell</h3>
            <p className="text-muted-foreground text-lg">List your items for sale or browse thousands of products from trusted sellers.</p>
          </div>
          <div className="flex flex-col items-center text-center marketplace-card p-8 hover:transform hover:scale-105 transition-all duration-300">
            <div className="gradient-primary w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-glow">
              <span className="text-3xl font-bold text-white">3</span>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-marketplace-secondary">Connect & Complete</h3>
            <p className="text-muted-foreground text-lg">Chat with buyers or sellers and complete your transactions safely and securely.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
