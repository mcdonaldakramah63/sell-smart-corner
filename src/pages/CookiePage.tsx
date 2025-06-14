import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Cookie, Settings, BarChart, Target, Shield } from 'lucide-react';
import { useState } from 'react';

export default function CookiePage() {
  const [essentialCookies, setEssentialCookies] = useState(true);
  const [analyticsCookies, setAnalyticsCookies] = useState(false);
  const [marketingCookies, setMarketingCookies] = useState(false);
  const [functionalCookies, setFunctionalCookies] = useState(false);

  const handleSavePreferences = () => {
    // TODO: Implement cookie preference saving
    console.log('Cookie preferences saved');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg">
              <Cookie className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
              Cookie Policy
            </h1>
          </div>
          <p className="text-slate-600">Last updated: December 14, 2024</p>
        </div>

        <div className="max-w-4xl space-y-6">
          {/* Introduction */}
          <Card className="shadow-lg border-slate-200">
            <CardContent className="pt-6">
              <p className="text-sm text-slate-600">
                This Cookie Policy explains how Used Market uses cookies and similar technologies to recognize you when you visit our website. It explains what these technologies are and why we use them, as well as your rights to control our use of them.
              </p>
            </CardContent>
          </Card>

          {/* What are Cookies */}
          <Card className="shadow-lg border-slate-200">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Cookie className="h-5 w-5" />
                What are Cookies?
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm text-slate-600">
                Cookies are small data files that are placed on your computer or mobile device when you visit a website. Cookies are widely used by website owners to make their websites work, or to work more efficiently, as well as to provide reporting information.
              </p>
              <p className="text-sm text-slate-600">
                Cookies set by the website owner (in this case, Used Market) are called "first party cookies." Cookies set by parties other than the website owner are called "third party cookies."
              </p>
            </CardContent>
          </Card>

          {/* Cookie Preferences */}
          <Card className="shadow-lg border-slate-200">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Manage Your Cookie Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Essential Cookies */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <Label htmlFor="essential" className="font-semibold">Essential Cookies</Label>
                  </div>
                  <p className="text-sm text-slate-600">
                    These cookies are strictly necessary to provide you with services available through our website and to use some of its features.
                  </p>
                </div>
                <Switch
                  id="essential"
                  checked={essentialCookies}
                  onCheckedChange={setEssentialCookies}
                  disabled
                />
              </div>

              {/* Analytics Cookies */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart className="h-4 w-4 text-blue-600" />
                    <Label htmlFor="analytics" className="font-semibold">Analytics Cookies</Label>
                  </div>
                  <p className="text-sm text-slate-600">
                    These cookies help us understand how visitors interact with our website, which helps us measure and improve the performance of our site.
                  </p>
                </div>
                <Switch
                  id="analytics"
                  checked={analyticsCookies}
                  onCheckedChange={setAnalyticsCookies}
                />
              </div>

              {/* Marketing Cookies */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-purple-600" />
                    <Label htmlFor="marketing" className="font-semibold">Marketing Cookies</Label>
                  </div>
                  <p className="text-sm text-slate-600">
                    These cookies are used to make advertising messages more relevant to you and your interests.
                  </p>
                </div>
                <Switch
                  id="marketing"
                  checked={marketingCookies}
                  onCheckedChange={setMarketingCookies}
                />
              </div>

              {/* Functional Cookies */}
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="h-4 w-4 text-orange-600" />
                    <Label htmlFor="functional" className="font-semibold">Functional Cookies</Label>
                  </div>
                  <p className="text-sm text-slate-600">
                    These cookies enable the website to provide enhanced functionality and personalization.
                  </p>
                </div>
                <Switch
                  id="functional"
                  checked={functionalCookies}
                  onCheckedChange={setFunctionalCookies}
                />
              </div>

              <Button onClick={handleSavePreferences} className="w-full">
                Save Preferences
              </Button>
            </CardContent>
          </Card>

          {/* Types of Cookies We Use */}
          <Card className="shadow-lg border-slate-200">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
              <CardTitle>Types of Cookies We Use</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Session Cookies</h3>
                <p className="text-sm text-slate-600">
                  These cookies are temporary and are deleted when you close your browser. They help us identify you during a single browsing session.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-2">Persistent Cookies</h3>
                <p className="text-sm text-slate-600">
                  These cookies remain on your device until they expire or you delete them. They help us recognize you as a returning visitor.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-2">First-Party Cookies</h3>
                <p className="text-sm text-slate-600">
                  These cookies are set directly by our website and can only be read by us.
                </p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-semibold mb-2">Third-Party Cookies</h3>
                <p className="text-sm text-slate-600">
                  These cookies are set by third-party services that we use, such as analytics providers or advertising networks.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* How to Control Cookies */}
          <Card className="shadow-lg border-slate-200">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
              <CardTitle>How to Control Cookies</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm text-slate-600">
                You have the right to decide whether to accept or reject cookies. You can exercise your cookie preferences by using the cookie preference center above.
              </p>
              
              <div>
                <h3 className="font-semibold mb-2">Browser Settings</h3>
                <p className="text-sm text-slate-600 mb-2">
                  You can also set or amend your web browser controls to accept or refuse cookies:
                </p>
                <ul className="text-sm text-slate-600 space-y-1 ml-4">
                  <li>• <strong>Chrome:</strong> Settings → Privacy and security → Cookies and other site data</li>
                  <li>• <strong>Firefox:</strong> Options → Privacy & Security → Cookies and Site Data</li>
                  <li>• <strong>Safari:</strong> Preferences → Privacy → Cookies and website data</li>
                  <li>• <strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
                </ul>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-800">
                  <strong>Note:</strong> If you choose to refuse cookies, some functionality of our website may be impaired.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Updates to This Policy */}
          <Card className="shadow-lg border-slate-200">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-t-lg">
              <CardTitle>Updates to This Cookie Policy</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <p className="text-sm text-slate-600">
                We may update this Cookie Policy from time to time in order to reflect changes to the cookies we use or for other operational, legal, or regulatory reasons.
              </p>
              <p className="text-sm text-slate-600">
                Please revisit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
              </p>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="shadow-lg border-slate-200 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Questions About Our Cookie Policy?</h3>
              <p className="text-sm text-slate-600">
                If you have any questions about our use of cookies or other technologies, please contact us:
              </p>
              <p className="text-sm text-slate-600 mt-2">
                <strong>Email:</strong> privacy@usedmarket.com<br />
                <strong>Address:</strong> 123 Market Street, San Francisco, CA 94105
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
