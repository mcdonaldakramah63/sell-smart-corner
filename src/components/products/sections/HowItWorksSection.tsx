
export default function HowItWorksSection() {
  return (
    <section className="py-12 container mx-auto px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="flex flex-col items-center text-center">
          <div className="bg-marketplace-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-marketplace-primary">1</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
          <p className="text-muted-foreground">Sign up for free and join our trusted Used Market community.</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="bg-marketplace-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-marketplace-primary">2</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Buy or Sell</h3>
          <p className="text-muted-foreground">List your items for sale or browse products from other users.</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <div className="bg-marketplace-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-marketplace-primary">3</span>
          </div>
          <h3 className="text-xl font-semibold mb-2">Connect & Complete</h3>
          <p className="text-muted-foreground">Chat with buyers or sellers and complete your transactions safely.</p>
        </div>
      </div>
    </section>
  );
}
