
import { Layout } from '@/components/layout/Layout';
import { AdvancedPromotionManager } from '@/components/promotions/AdvancedPromotionManager';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Clock, DollarSign } from "lucide-react";

export default function PromotionsPage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Promote Your Listings</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Boost visibility, reach more buyers, and sell faster with our advanced promotion tools
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Boost
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3.5x</div>
              <p className="text-xs text-muted-foreground">
                More views with promotions
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Reach
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">10K+</div>
              <p className="text-xs text-muted-foreground">
                Daily active users
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Faster Sales
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">60%</div>
              <p className="text-xs text-muted-foreground">
                Faster than regular listings
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Starting From
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">GHS 10</div>
              <p className="text-xs text-muted-foreground">
                Most affordable promotion
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Benefits Section */}
        <Card>
          <CardHeader>
            <CardTitle>Why Promote Your Listings?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold">Increased Visibility</h3>
                <p className="text-sm text-muted-foreground">
                  Get your listings seen by more potential buyers with priority placement
                </p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold">Sell Faster</h3>
                <p className="text-sm text-muted-foreground">
                  Promoted listings typically sell 60% faster than regular listings
                </p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold">Better Reach</h3>
                <p className="text-sm text-muted-foreground">
                  Reach buyers across multiple channels including social media and newsletters
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Promotion Manager */}
        <AdvancedPromotionManager />

        {/* Payment Options Info */}
        <Card>
          <CardHeader>
            <CardTitle>Secure Payment Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">Mobile Money</h4>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">MTN Mobile Money</Badge>
                  <Badge variant="outline">Vodafone Cash</Badge>
                  <Badge variant="outline">AirtelTigo Money</Badge>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Cards & Banking</h4>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">Visa</Badge>
                  <Badge variant="outline">Mastercard</Badge>
                  <Badge variant="outline">Bank Transfer</Badge>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4">
              All payments are processed securely. Your financial information is never stored on our servers.
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
