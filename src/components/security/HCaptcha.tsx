import HCaptcha from '@hcaptcha/react-hcaptcha';
import { useRef, forwardRef, useImperativeHandle } from 'react';

interface HCaptchaComponentProps {
  onVerify: (token: string) => void;
  onError?: () => void;
  theme?: 'light' | 'dark';
}

export interface HCaptchaRef {
  resetCaptcha: () => void;
}

const HCaptchaComponent = forwardRef<HCaptchaRef, HCaptchaComponentProps>(
  ({ onVerify, onError, theme = 'light' }, ref) => {
    const captchaRef = useRef<HCaptcha>(null);
    
    // Use a test site key for development
    const siteKey = "10000000-ffff-ffff-ffff-000000000001";

    useImperativeHandle(ref, () => ({
      resetCaptcha: () => {
        captchaRef.current?.resetCaptcha();
      }
    }));

    return (
      <div className="flex justify-center my-4">
        <HCaptcha
          ref={captchaRef}
          sitekey={siteKey}
          onVerify={onVerify}
          onError={onError}
          theme={theme}
        />
      </div>
    );
  }
);

HCaptchaComponent.displayName = 'HCaptchaComponent';

export default HCaptchaComponent;