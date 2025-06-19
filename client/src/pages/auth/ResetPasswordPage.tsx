import { useState } from "react";
import { useHttp } from '../../api/useHttp';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import toast from 'react-hot-toast';

interface ResetPasswordData {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ResetPasswordData>({
    email: searchParams.get('email') || '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });

  const { mutate: resetPassword, isPending } = useHttp<{ message: string }, ResetPasswordData>({
    url: '/auth/reset-password',
    method: 'POST',
    options: {
      onSuccess: (data) => {
        toast.success(data.message || 'Password reset successfully!');
        navigate("/login");
      },
    }
  });

  const { mutate: resendOTP, isPending: isResending } = useHttp<{ message: string }, { email: string }>({
    url: '/auth/resend-password-otp',
    method: 'POST',
    options: {
      onSuccess: (data) => {
        toast.success(data.message || 'New OTP sent successfully!');
      },
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    resetPassword({
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword,
        confirmPassword: ""
    });
  };

  const handleResendOTP = () => {
    if (!formData.email) {
      toast.error('Email is required');
      return;
    }
    resendOTP({ email: formData.email });
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="mb-8 text-center">
        <h3 className="text-xl text-gray-600">Reset Your Password</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={!!searchParams.get('email')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="otp">Verification Code</Label>
          <div className="flex gap-2">
            <Input
              id="otp"
              name="otp"
              type="text"
              placeholder="Enter OTP"
              value={formData.otp}
              onChange={handleChange}
              required
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleResendOTP}
              disabled={isResending}
            >
              {isResending ? 'Sending...' : 'Resend'}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword">New Password</Label>
          <Input
            id="newPassword"
            name="newPassword"
            type="password"
            placeholder="Enter new password"
            value={formData.newPassword}
            onChange={handleChange}
            required
            minLength={8}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            minLength={8}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isPending}
        >
          {isPending ? 'Resetting...' : 'Reset Password'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <Link to="/login" className="font-medium text-blue-600 hover:underline">
          Remember your password? Log in
        </Link>
      </div>
    </div>
  );
}