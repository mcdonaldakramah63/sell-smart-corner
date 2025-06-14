
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { HelpCircle, Search, MessageSquare, FileText, Shield, Users } from 'lucide-react';

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <HelpCircle className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Help Center
            </h1>
          </div>
          <p className="text-slate-600">Find answers to common questions and get help with using Used Market</p>
        </div>

        <div className="grid gap-6 max-w-4xl">
          {/* Getting Started */}
          <Card className="shadow-lg border-slate-200">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-md">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <CardTitle>Getting Started</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-2">How to create an account</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Click "Sign Up" in the top right corner, enter your email and password, then verify your email address.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">How to list your first item</h3>
                <p className="text-sm text-slate-600 mb-4">
                  After logging in, click "Sell Something" and fill out the product form with photos, description, and price.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">How to search for items</h3>
                <p className="text-sm text-slate-600">
                  Use the search bar on the homepage or browse by category. You can filter by price, location, and condition.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Buying & Selling */}
          <Card className="shadow-lg border-slate-200">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-gradient-to-r from-orange-500 to-red-500 rounded-md">
                  <Search className="h-4 w-4 text-white" />
                </div>
                <CardTitle>Buying & Selling</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-2">How to contact sellers</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Click "Message Seller" on any product page to start a conversation. Be polite and ask specific questions.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Payment methods</h3>
                <p className="text-sm text-slate-600 mb-4">
                  We recommend meeting in person for cash transactions. For shipped items, use secure payment methods like PayPal.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">How to edit or delete your listings</h3>
                <p className="text-sm text-slate-600">
                  Go to your Dashboard to manage all your listings. You can edit details, update photos, or mark items as sold.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Account & Technical */}
          <Card className="shadow-lg border-slate-200">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md">
                  <MessageSquare className="h-4 w-4 text-white" />
                </div>
                <CardTitle>Account & Technical Issues</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-2">I forgot my password</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Click "Forgot Password" on the login page and enter your email. Follow the reset link in your email.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">How to update my profile</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Go to your Profile page to update your information, profile picture, and contact details.
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Images not uploading</h3>
                <p className="text-sm text-slate-600">
                  Make sure your images are under 5MB and in JPG, PNG, or WebP format. Try refreshing the page if uploads fail.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Support */}
          <Card className="shadow-lg border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="pt-6">
              <div className="text-center">
                <FileText className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-lg font-semibold mb-2">Still need help?</h3>
                <p className="text-slate-600 mb-4">
                  Can't find what you're looking for? Contact our support team and we'll get back to you within 24 hours.
                </p>
                <div className="space-y-2 text-sm">
                  <p><strong>Email:</strong> support@usedmarket.com</p>
                  <p><strong>Response time:</strong> Within 24 hours</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
