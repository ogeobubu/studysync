import { useState } from "react"
import { useHttp } from '../../api/useHttp';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('');

  // Using your useHttp hook for the mutation
  const { mutate: sendResetLink, isPending } = useHttp<{ message: string }, { email: string }>({
    url: '/auth/forgot-password',
    method: 'POST',
    options: {
      onSuccess: (data) => {
        toast.success(data.message || 'Password reset link sent successfully!');
        navigate("/reset-password")
      },
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    sendResetLink({ email });
  };

  return (
    <div className="w-full">
      <div className="mb-8 text-center">
        <h3 className="text-xl text-gray-600">Forgot your password?</h3>
      </div>

      <p className="text-gray-600 mb-6 text-center">
        Enter the email address associated with your account and we'll send you a link to reset your password.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <Button 
          type="submit" 
          className="w-full" 
          disabled={isPending}
        >
          {isPending ? 'Sending...' : 'Send Reset Link'}
        </Button>
      </form>

      <div className="mt-6 text-center text-sm">
        <Link
          to="/login"
          className="font-medium text-blue-600 hover:underline"
        >
          Remember your password? Log in
        </Link>
      </div>
    </div>
  );
}