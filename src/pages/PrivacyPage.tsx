
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Shield, Eye, Lock, Database, UserCheck } from 'lucide-react';

export default function PrivacyPage() {
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
                Privacy Policy
              </h1>
            </div>
            <p className="text-slate-600">Last updated: December 14, 2024</p>
          </div>

          <div className="max-w-4xl space-y-6">
            {/* Introduction */}
            <Card className="shadow-lg border-slate-200">
              <CardContent className="pt-6">
                <p className="text-sm text-slate-600">
                  At Used Market, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our marketplace platform.
                </p>
              </CardContent>
            </Card>

            {/* Information We Collect */}
            <Card className="shadow-lg border-slate-200">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Information We Collect
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Personal Information</h3>
                  <p className="text-sm text-slate-600 mb-2">
                    We collect information you provide directly to us, such as:
                  </p>
                  <ul className="text-sm text-slate-600 space-y-1 ml-4">
                    <li>• Name and contact information (email, phone number)</li>
                    <li>• Profile information and photos</li>
                    <li>• Payment information (processed securely by third parties)</li>
                    <li>• Product listings and descriptions</li>
                    <li>• Messages and communications through our platform</li>
                  </ul>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-2">Automatically Collected Information</h3>
                  <p className="text-sm text-slate-600 mb-2">
                    We automatically collect certain information when you use our service:
                  </p>
                  <ul className="text-sm text-slate-600 space-y-1 ml-4">
                    <li>• Device information (IP address, browser type, operating system)</li>
                    <li>• Usage data (pages visited, time spent, features used)</li>
                    <li>• Location information (if you enable location services)</li>
                    <li>• Cookies and similar tracking technologies</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* How We Use Your Information */}
            <Card className="shadow-lg border-slate-200">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  How We Use Your Information
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-sm text-slate-600 mb-2">
                  We use the information we collect to:
                </p>
                <ul className="text-sm text-slate-600 space-y-1 ml-4">
                  <li>• Provide, operate, and maintain our marketplace service</li>
                  <li>• Process transactions and send related information</li>
                  <li>• Send you technical notices, updates, and support messages</li>
                  <li>• Respond to your comments, questions, and customer service requests</li>
                  <li>• Communicate with you about products, services, and promotional offers</li>
                  <li>• Monitor and analyze usage and trends to improve our service</li>
                  <li>• Detect, investigate, and prevent fraudulent transactions and other illegal activities</li>
                  <li>• Comply with legal obligations and enforce our terms of service</li>
                </ul>
              </CardContent>
            </Card>

            {/* Information Sharing */}
            <Card className="shadow-lg border-slate-200">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  Information Sharing and Disclosure
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-sm text-slate-600 mb-2">
                  We may share your information in the following situations:
                </p>
                
                <div>
                  <h3 className="font-semibold mb-2">With Other Users</h3>
                  <p className="text-sm text-slate-600">
                    Your profile information and product listings are visible to other users to facilitate transactions.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-2">Service Providers</h3>
                  <p className="text-sm text-slate-600">
                    We share information with third-party service providers who help us operate our platform (payment processors, hosting providers, analytics services).
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-2">Legal Requirements</h3>
                  <p className="text-sm text-slate-600">
                    We may disclose information if required by law or in response to valid legal requests by public authorities.
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-semibold mb-2">Business Transfers</h3>
                  <p className="text-sm text-slate-600">
                    In connection with any merger, sale of assets, or acquisition of our business.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Data Security */}
            <Card className="shadow-lg border-slate-200">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Data Security
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-sm text-slate-600">
                  We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
                <p className="text-sm text-slate-600">
                  However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee absolute security.
                </p>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Security Measures Include:</h4>
                  <ul className="text-sm text-blue-700 space-y-1 ml-4">
                    <li>• Encryption of sensitive data in transit and at rest</li>
                    <li>• Regular security audits and assessments</li>
                    <li>• Access controls and authentication requirements</li>
                    <li>• Employee training on data protection practices</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Your Rights */}
            <Card className="shadow-lg border-slate-200">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
                <CardTitle>Your Privacy Rights</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-sm text-slate-600 mb-2">
                  Depending on your location, you may have the following rights regarding your personal information:
                </p>
                <ul className="text-sm text-slate-600 space-y-1 ml-4">
                  <li>• <strong>Access:</strong> Request copies of your personal information</li>
                  <li>• <strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
                  <li>• <strong>Deletion:</strong> Request deletion of your personal information</li>
                  <li>• <strong>Portability:</strong> Request transfer of your information to another service</li>
                  <li>• <strong>Objection:</strong> Object to our processing of your personal information</li>
                  <li>• <strong>Restriction:</strong> Request restriction of processing under certain circumstances</li>
                </ul>
                
                <p className="text-sm text-slate-600 mt-4">
                  To exercise these rights, please contact us at <strong>privacy@usedmarket.com</strong>
                </p>
              </CardContent>
            </Card>

            {/* Cookies */}
            <Card className="shadow-lg border-slate-200">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
                <CardTitle>Cookies and Tracking</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-sm text-slate-600">
                  We use cookies and similar tracking technologies to collect and use personal information about you. For more detailed information about our use of cookies, please see our Cookie Policy.
                </p>
                <p className="text-sm text-slate-600">
                  You can set your browser to refuse all or some browser cookies, or to alert you when cookies are being sent. If you disable or refuse cookies, some parts of our service may become inaccessible or not function properly.
                </p>
              </CardContent>
            </Card>

            {/* Children's Privacy */}
            <Card className="shadow-lg border-slate-200">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
                <CardTitle>Children's Privacy</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-sm text-slate-600">
                  Our service is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                </p>
              </CardContent>
            </Card>

            {/* Changes to Privacy Policy */}
            <Card className="shadow-lg border-slate-200">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
                <CardTitle>Changes to This Privacy Policy</CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <p className="text-sm text-slate-600">
                  We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "last updated" date.
                </p>
                <p className="text-sm text-slate-600">
                  You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
                </p>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="shadow-lg border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Contact Us</h3>
                <p className="text-sm text-slate-600">
                  If you have any questions about this Privacy Policy, please contact us:
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
