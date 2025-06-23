import { useState } from 'react';
import { Button } from '../../ui/button';
import { Modal } from '../../ui/modal';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { UserPlus } from 'lucide-react';
import { useHttp } from '../../../api/useHttp';
import { toast } from 'react-hot-toast';

interface AddAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddAdvisorModal({ isOpen, onClose, onSuccess }: AddAdvisorModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialization: '',
    password: '',
    confirmPassword: ''
  });

  const { mutate: createAdvisor, isPending: isCreating } = useHttp({
    url: '/users',
    method: 'POST',
  });

  const handleSpecializationChange = (value: string) => {
    setFormData(prev => ({ ...prev, specialization: value }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      createAdvisor({
            name: formData.name,
            email: formData.email,
            specialization: formData.specialization,
            password: formData.password,
            role: 'advisor'
        }, {
            onSuccess: () => {
                toast.success('Advisor created successfully');
                onSuccess();
                onClose();
                setFormData({
                    name: '',
                    email: '',
                    specialization: '',
                    password: '',
                    confirmPassword: ''
                });
            },
            onError: (error) => {
                toast.error(error.message || 'Failed to create advisor');
            }
        });
    } catch (error) {
      toast.error('Failed to create advisor');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <UserPlus className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-bold">Add New Advisor</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="space-y-2">
          <Label htmlFor="specialization">Specialization</Label>
          <Select value={formData.specialization} onValueChange={handleSpecializationChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select specialization" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Computer Science with Mathematics">Computer Science with Mathematics</SelectItem>
              <SelectItem value="Computer Science with Economics">Computer Science with Economics</SelectItem>
              <SelectItem value="Computer Engineering">Computer Engineering</SelectItem>
            </SelectContent>
          </Select>
        </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
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
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              minLength={8}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isCreating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isCreating}
              isLoading={isCreating}
            >
              Create Advisor
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}