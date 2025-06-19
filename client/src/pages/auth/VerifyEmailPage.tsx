import { useState } from "react";
import { useHttp } from '../../api/useHttp';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import toast from 'react-hot-toast';

export default function VerifyEmailPage() {
  const navigate = useNavigate()
  const [otpCode, setOtpCode] = useState('');

  const { mutate: verifyEmail, isPending } = useHttp<{ message: string }, { otp: string }>({
    url: '/auth/verify-email',
    method: 'POST',
    options: {
      onSuccess: (data) => {
        toast.success(data.message || 'Email verified successfully!');
        navigate("/login")
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Verification failed.');
      },
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!otpCode) {
      toast.error('Please enter your verification code');
      return;
    }

    verifyEmail({ otp: otpCode });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8 text-center">
        <h3 className="text-xl text-gray-600">Verify Your Email</h3>
      </div>

      <p className="text-gray-600 mb-6 text-center">
        Enter the OTP sent to your email address.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="otp">Verification Code</Label>
          <Input
            id="otp"
            type="text"
            placeholder="Enter your verification code"
            value={otpCode}
            onChange={(e) => setOtpCode(e.target.value)}
            required
          />
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isPending}
        >
          {isPending ? 'Verifying...' : 'Verify Email'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <Link to="/resend-verification" className="font-medium text-blue-600 hover:underline">
          Didn't receive the code? Resend verification email
        </Link>
      </div>
    </div>
  );
}