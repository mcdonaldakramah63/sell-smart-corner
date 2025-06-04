
import { Link } from 'react-router-dom';
import { MessageSquare, Send } from 'lucide-react';

export const EmptyMessagesState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="p-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full mb-6">
        <MessageSquare className="h-16 w-16 text-blue-500" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-3">No messages yet</h2>
      <p className="text-slate-600 max-w-md mb-8 leading-relaxed">
        When you contact sellers or receive messages about your listings, they'll appear here.
      </p>
      <Link 
        to="/products" 
        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <Send className="h-4 w-4" />
        Browse Products
      </Link>
    </div>
  );
};
