
export default function CallToActionSection() {
  return (
    <section className="py-20 gradient-primary text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20"></div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold mb-8 drop-shadow-lg">Ready to Start?</h2>
        <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto font-medium text-white/90">
          Join thousands of users buying and selling on our trusted marketplace every day.
        </p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center">
          <button className="bg-white text-primary hover:bg-white/90 px-10 py-4 rounded-xl text-lg font-semibold shadow-elegant hover:shadow-glow transform hover:scale-105 transition-all duration-300">
            Start Shopping
          </button>
          <button className="border-2 border-white/40 bg-white/10 text-white hover:bg-white hover:text-primary px-10 py-4 rounded-xl text-lg backdrop-blur-sm transition-all duration-300">
            Sell Something
          </button>
        </div>
      </div>
    </section>
  );
}
