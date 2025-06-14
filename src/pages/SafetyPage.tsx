
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Shield, AlertTriangle, Eye, MapPin, CreditCard, MessageCircle } from 'lucide-react';

export default function SafetyPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Safety Tips
              </h1>
            </div>
            <p className="text-slate-600">Stay safe while buying and selling on Used Market</p>
          </div>

          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <strong>Remember:</strong> If something seems too good to be true, it probably is. Trust your instincts.
            </AlertDescription>
          </Alert>

          <div className="grid gap-6 max-w-4xl">
            {/* Meeting Safely */}
            <Card className="shadow-lg border-slate-200">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-md">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
                  <CardTitle>Meeting Safely</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 text-green-700">✓ DO</h3>
                  <ul className="text-sm text-slate-600 space-y-1 ml-4">
                    <li>• Meet in public places with good lighting and foot traffic</li>
                    <li>• Bring a friend or let someone know where you're going</li>
                    <li>• Meet during daylight hours when possible</li>
                    <li>• Consider meeting at police stations or designated safe exchange zones</li>
                    <li>• Test items thoroughly before purchasing</li>
                  </ul>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2 text-red-700">✗ DON'T</h3>
                  <ul className="text-sm text-slate-600 space-y-1 ml-4">
                    <li>• Meet at your home or the seller's home</li>
                    <li>• Meet in isolated or poorly lit areas</li>
                    <li>• Go alone to meet someone you don't know</li>
                    <li>• Give out personal information unnecessarily</li>
                    <li>• Rush into a transaction</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Payment Safety */}
            <Card className="shadow-lg border-slate-200">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-md">
                    <CreditCard className="h-4 w-4 text-white" />
                  </div>
                  <CardTitle>Payment Safety</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Safe Payment Methods</h3>
                  <ul className="text-sm text-slate-600 space-y-1 ml-4">
                    <li>• Cash (for in-person transactions)</li>
                    <li>• PayPal Goods & Services (buyer protection)</li>
                    <li>• Bank transfers for verified sellers</li>
                    <li>• Escrow services for high-value items</li>
                  </ul>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2 text-red-700">Avoid These Payment Methods</h3>
                  <ul className="text-sm text-slate-600 space-y-1 ml-4">
                    <li>• Wire transfers or Western Union</li>
                    <li>• Gift cards or prepaid cards</li>
                    <li>• Cryptocurrency (unless you're experienced)</li>
                    <li>• Personal checks from strangers</li>
                    <li>• PayPal Friends & Family (no protection)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Online Communication */}
            <Card className="shadow-lg border-slate-200">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-md">
                    <MessageCircle className="h-4 w-4 text-white" />
                  </div>
                  <CardTitle>Online Communication</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Red Flags to Watch For</h3>
                  <ul className="text-sm text-slate-600 space-y-1 ml-4">
                    <li>• Prices significantly below market value</li>
                    <li>• Urgent pressure to complete the transaction</li>
                    <li>• Requests to move communication off-platform</li>
                    <li>• Poor grammar or generic responses</li>
                    <li>• Refusal to meet in person or provide additional photos</li>
                    <li>• Stories about being overseas or unable to meet</li>
                  </ul>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Best Practices</h3>
                  <ul className="text-sm text-slate-600 space-y-1 ml-4">
                    <li>• Use our messaging system for initial contact</li>
                    <li>• Ask detailed questions about the item</li>
                    <li>• Request additional photos if needed</li>
                    <li>• Research market prices before buying</li>
                    <li>• Trust your instincts if something feels wrong</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Reporting Issues */}
            <Card className="shadow-lg border-slate-200">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
                <div className="flex items-center gap-3">
                  <div className="p-1.5 bg-gradient-to-r from-red-500 to-orange-500 rounded-md">
                    <Eye className="h-4 w-4 text-white" />
                  </div>
                  <CardTitle>Reporting Issues</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">When to Report</h3>
                  <ul className="text-sm text-slate-600 space-y-1 ml-4">
                    <li>• Suspicious or fraudulent behavior</li>
                    <li>• Inappropriate content or messages</li>
                    <li>• Counterfeit or stolen goods</li>
                    <li>• Harassment or threatening behavior</li>
                    <li>• Violation of our terms of service</li>
                  </ul>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">How to Report</h3>
                  <p className="text-sm text-slate-600 mb-2">
                    Contact our support team immediately at <strong>safety@usedmarket.com</strong> with:
                  </p>
                  <ul className="text-sm text-slate-600 space-y-1 ml-4">
                    <li>• Screenshots of conversations</li>
                    <li>• User profile information</li>
                    <li>• Product listing details</li>
                    <li>• Description of the issue</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Alert className="border-red-200 bg-red-50">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                <strong>Emergency:</strong> If you feel threatened or unsafe, contact local law enforcement immediately. 
                Your safety is more important than any transaction.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </Layout>
  );
}
