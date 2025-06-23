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

interface AddStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddStudentModal({ isOpen, onClose, onSuccess }: AddStudentModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    matricNumber: '',
    program: '',
    level: '',
    password: '',
    confirmPassword: ''
  });

  const { mutate: createStudent, isPending: isCreating } = useHttp({
    url: '/users',
    method: 'POST',
  });

  const handleProgramChange = (value: string) => {
    setFormData(prev => ({ ...prev, program: value }));
  };

  const handleLevelChange = (value: string) => {
    setFormData(prev => ({ ...prev, level: value }));
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
      createStudent({
        name: formData.name,
        email: formData.email,
        matricNumber: formData.matricNumber,
        program: formData.program,
        level: formData.level,
        password: formData.password,
        role: 'student'
      }, {
        onSuccess: () => {
          toast.success('Student created successfully');
          onSuccess();
          onClose();
          setFormData({
            name: '',
            email: '',
            matricNumber: '',
            program: '',
            level: '',
            password: '',
            confirmPassword: ''
          });
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to create student');
        }
      });
    } catch (error) {
      toast.error('Failed to create student');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <UserPlus className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-bold">Add New Student</h2>
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
            <Label htmlFor="matricNumber">Matric Number</Label>
            <Input
              id="matricNumber"
              name="matricNumber"
              value={formData.matricNumber}
              onChange={handleChange}
              placeholder="CS/ENG/20/1234"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="program">Program</Label>
            <Select value={formData.program} onValueChange={handleProgramChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select program" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Computer Science with Mathematics">Computer Science with Mathematics</SelectItem>
                <SelectItem value="Computer Science with Economics">Computer Science with Economics</SelectItem>
                <SelectItem value="Computer Engineering">Computer Engineering</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="level">Level</Label>
            <Select value={formData.level} onValueChange={handleLevelChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Part I">Part I</SelectItem>
                <SelectItem value="Part II">Part II</SelectItem>
                <SelectItem value="Part III">Part III</SelectItem>
                <SelectItem value="Part IV">Part IV</SelectItem>
                <SelectItem value="Part V">Part V</SelectItem>
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
              Create Student
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}