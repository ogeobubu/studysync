import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHttp } from '../../api/useHttp';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import toast from 'react-hot-toast';

type AdvisingRequestData = {
  reason: string;
  additionalInfo: string;
  preferredDay: string;
  preferredTime: string;
};

export default function AdvisingRequest() {
  const [formData, setFormData] = useState<AdvisingRequestData>({
    reason: '',
    additionalInfo: '',
    preferredDay: '',
    preferredTime: ''
  });
  const navigate = useNavigate();

  const { mutate: submitRequest, isPending } = useHttp({
    url: '/advising/request',
    method: 'POST',
    options: {
      onSuccess: () => {
        toast.success('Advising request submitted successfully!');
        navigate('/student/dashboard');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to submit request');
      },
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof AdvisingRequestData) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.reason) {
      toast.error('Please select a reason for advising');
      return;
    }

    submitRequest(formData);
  };

  return (
    <div className="max-w-xl p-6">
      <h1 className="text-2xl font-bold mb-6">Request Advising</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Reason for Advising Section */}
        <div className="space-y-2">
          <Label htmlFor="reason">Reason for Advising</Label>
          <Select 
            value={formData.reason} 
            onValueChange={handleSelectChange('reason')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a reason" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="course-selection">Course Selection</SelectItem>
              <SelectItem value="degree-planning">Degree Planning</SelectItem>
              <SelectItem value="academic-concerns">Academic Concerns</SelectItem>
              <SelectItem value="graduation-check">Graduation Check</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Additional Information Section */}
        <div className="space-y-2">
          <Label htmlFor="additionalInfo">Additional Information</Label>
          <Textarea
            id="additionalInfo"
            name="additionalInfo"
            placeholder="Provide any additional details about your request"
            value={formData.additionalInfo}
            onChange={handleChange}
            className="min-h-[100px]"
          />
        </div>

        {/* Availability Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Availability</h2>
          
          {/* Preferred Day */}
          <div className="space-y-2">
            <Label htmlFor="preferredDay">Preferred Day</Label>
            <Select 
              value={formData.preferredDay} 
              onValueChange={handleSelectChange('preferredDay')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a day" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="monday">Monday</SelectItem>
                <SelectItem value="tuesday">Tuesday</SelectItem>
                <SelectItem value="wednesday">Wednesday</SelectItem>
                <SelectItem value="thursday">Thursday</SelectItem>
                <SelectItem value="friday">Friday</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Preferred Time */}
          <div className="space-y-2">
            <Label htmlFor="preferredTime">Preferred Time</Label>
            <Select 
              value={formData.preferredTime} 
              onValueChange={handleSelectChange('preferredTime')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="morning">Morning (9AM-12PM)</SelectItem>
                <SelectItem value="afternoon">Afternoon (12PM-3PM)</SelectItem>
                <SelectItem value="evening">Evening (3PM-6PM)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Submit Button */}
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Submitting...' : 'Submit Request'}
        </Button>
      </form>
    </div>
  );
}