
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText, Scale, AlertCircle } from 'lucide-react';

export default function TermsPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Terms of Service
              </h1>
            </div>
            <p className="text-slate-600">Last updated: December 14, 2024</p>
          </div>

          <div className="max-w-4xl space-y-6">
            <Card className="shadow-lg border-slate-200">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="h-5 w-5 text-blue-600" />
                  <p className="text-sm text-slate-600">
                    By using Used Market, you agree to these terms. Please read them carefully.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Agreement to Terms */}
            <Card className="shadow-lg border-slate-200">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Scale className="h-5 w-5" />
                  1. Agreement to Terms
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-sm text-slate-600">
                  By accessing and using Used Market ("Service"), you accept and agree to be bound by the terms and provision of this agreement.
                </p>
                <p className="text-sm text-slate-600">
                  If you do not agree to abide by the above, please do not use this service.
                </p>
              </CardContent>
            </Card>

            {/* Use License */}
            <Card className="shadow-lg border-slate-200">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
                <CardTitle>2. Use License</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-sm text-slate-600">
                  Permission is granted to temporarily access Used Market for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="text-sm text-slate-600 space-y-1 ml-4">
                  <li>• modify or copy the materials</li>
                  <li>• use the materials for any commercial purpose or for any public display (commercial or non-commercial)</li>
                  <li>• attempt to decompile or reverse engineer any software contained on the website</li>
                  <li>• remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </CardContent>
            </Card>

            {/* User Accounts */}
            <Card className="shadow-lg border-slate-200">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
                <CardTitle>3. User Accounts</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-sm text-slate-600">
                  When you create an account with us, you must provide information that is accurate, complete, and current at all times.
                </p>
                <p className="text-sm text-slate-600">
                  You are responsible for safeguarding the password and for maintaining the security of your account. You agree not to disclose your password to any third party.
                </p>
                <p className="text-sm text-slate-600">
                  You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
                </p>
              </CardContent>
            </Card>

            {/* Prohibited Uses */}
            <Card className="shadow-lg border-slate-200">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
                <CardTitle>4. Prohibited Uses</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-sm text-slate-600">
                  You may not use our service:
                </p>
                <ul className="text-sm text-slate-600 space-y-1 ml-4">
                  <li>• For any unlawful purpose or to solicit others to perform unlawful acts</li>
                  <li>• To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                  <li>• To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                  <li>• To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                  <li>• To submit false or misleading information</li>
                  <li>• To upload or transmit viruses or any other type of malicious code</li>
                  <li>• To collect or track the personal information of others</li>
                  <li>• To spam, phish, pharm, pretext, spider, crawl, or scrape</li>
                </ul>
              </CardContent>
            </Card>

            {/* Content */}
            <Card className="shadow-lg border-slate-200">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
                <CardTitle>5. User Generated Content</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-sm text-slate-600">
                  Our Service may allow you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content").
                </p>
                <p className="text-sm text-slate-600">
                  You are responsible for Content that you post to the Service, including its legality, reliability, and appropriateness.
                </p>
                <p className="text-sm text-slate-600">
                  By posting Content to the Service, You grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the Service.
                </p>
              </CardContent>
            </Card>

            {/* Privacy Policy */}
            <Card className="shadow-lg border-slate-200">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
                <CardTitle>6. Privacy Policy</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-sm text-slate-600">
                  Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information when you use our Service.
                </p>
                <p className="text-sm text-slate-600">
                  By using our Service, you agree to the collection and use of information in accordance with our Privacy Policy.
                </p>
              </CardContent>
            </Card>

            {/* Termination */}
            <Card className="shadow-lg border-slate-200">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
                <CardTitle>7. Termination</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-sm text-slate-600">
                  We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever including without limitation if you breach the Terms.
                </p>
                <p className="text-sm text-slate-600">
                  If you wish to terminate your account, you may simply discontinue using the Service.
                </p>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Card className="shadow-lg border-slate-200">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
                <CardTitle>8. Disclaimer</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-sm text-slate-600">
                  The information on this website is provided on an "as is" basis. To the fullest extent permitted by law, this Company:
                </p>
                <ul className="text-sm text-slate-600 space-y-1 ml-4">
                  <li>• excludes all representations and warranties relating to this website and its contents</li>
                  <li>• does not warrant that the service will be uninterrupted or error-free</li>
                  <li>• does not warrant that the information will be accurate or reliable</li>
                </ul>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="shadow-lg border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Contact Us</h3>
                <p className="text-sm text-slate-600">
                  If you have any questions about these Terms of Service, please contact us at:
                </p>
                <p className="text-sm text-slate-600 mt-2">
                  <strong>Email:</strong> mcdonaldakramah650@gmail.com<br />
                  <strong>Address:</strong> 123 Market Street, San Francisco, CA 94105<br />
                  <strong>Phone:</strong> 0539445725
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
