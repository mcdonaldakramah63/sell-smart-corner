
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useUserVerification } from '@/hooks/useUserVerification';
import { Shield, Phone, FileText, CheckCircle, Clock, XCircle } from 'lucide-react';

export const VerificationCenter = () => {
  const { loading, submitPhoneVerification, submitIDVerification, getVerificationStatus } = useUserVerification();
  const [verifications, setVerifications] = useState<any[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [documentType, setDocumentType] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');

  useEffect(() => {
    loadVerificationStatus();
  }, []);

  const loadVerificationStatus = async () => {
    const status = await getVerificationStatus();
    setVerifications(status);
  };

  const handlePhoneVerification = async () => {
    const result = await submitPhoneVerification(phoneNumber);
    if (result.success) {
      setPhoneNumber('');
      loadVerificationStatus();
    }
  };

  const handleIDVerification = async () => {
    const result = await submitIDVerification(documentType, documentNumber, []);
    if (result.success) {
      setDocumentType('');
      setDocumentNumber('');
      loadVerificationStatus();
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getVerificationByType = (type: string) => {
    return verifications.find(v => v.verification_type === type);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Shield className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">Verification Center</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Phone Verification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Phone className="h-5 w-5" />
              <span>Phone Verification</span>
              {getVerificationByType('phone') && getStatusBadge(getVerificationByType('phone').status)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!getVerificationByType('phone') || getVerificationByType('phone').status === 'rejected' ? (
              <>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+233 XX XXX XXXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handlePhoneVerification} 
                  disabled={loading || !phoneNumber}
                  className="w-full"
                >
                  Submit Phone Verification
                </Button>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">
                  {getVerificationByType('phone').status === 'verified' 
                    ? 'Your phone number has been verified!' 
                    : 'Phone verification is under review.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ID Document Verification */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>ID Verification</span>
              {getVerificationByType('id_document') && getStatusBadge(getVerificationByType('id_document').status)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!getVerificationByType('id_document') || getVerificationByType('id_document').status === 'rejected' ? (
              <>
                <div>
                  <Label htmlFor="docType">Document Type</Label>
                  <Select value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select document type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="national_id">National ID</SelectItem>
                      <SelectItem value="passport">Passport</SelectItem>
                      <SelectItem value="drivers_license">Driver's License</SelectItem>
                      <SelectItem value="voters_id">Voter's ID</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="docNumber">Document Number</Label>
                  <Input
                    id="docNumber"
                    placeholder="Enter document number"
                    value={documentNumber}
                    onChange={(e) => setDocumentNumber(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={handleIDVerification} 
                  disabled={loading || !documentType || !documentNumber}
                  className="w-full"
                >
                  Submit ID Verification
                </Button>
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">
                  {getVerificationByType('id_document').status === 'verified' 
                    ? 'Your ID has been verified!' 
                    : 'ID verification is under review.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Verification Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-green-600">Phone Verification</h4>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• Increased trust from buyers</li>
                <li>• Direct contact via phone/WhatsApp</li>
                <li>• Priority in search results</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-600">ID Verification</h4>
              <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                <li>• Verified seller badge</li>
                <li>• Higher listing limits</li>
                <li>• Access to business features</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
