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
import { Checkbox } from '../../components/ui/checkbox';
import TimePicker from '../../components/ui/time-picker';
import toast from 'react-hot-toast';
import { DayOfWeek } from '../../types/enums';

type AdvisingRequestData = {
  reason: string;
  additionalInfo: string;
  preferredDays: string[];
  preferredTimeRange: {
    start: string;
    end: string;
  };
};

export default function AdvisingRequest() {
  const [formData, setFormData] = useState<AdvisingRequestData>({
    reason: '',
    additionalInfo: '',
    preferredDays: [],
    preferredTimeRange: {
      start: '09:00',
      end: '10:00'
    }
  });
  const navigate = useNavigate();

  const { mutate: submitRequest, isPending } = useHttp({
    url: '/advising',
    method: 'POST',
    options: {
      onSuccess: () => {
        toast.success('Advising request submitted successfully!');
        navigate('/student/advising');
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

  const handleDaySelection = (day: string, checked: boolean) => {
    setFormData(prev => {
      const newDays = checked
        ? [...prev.preferredDays, day]
        : prev.preferredDays.filter(d => d !== day);
      return { ...prev, preferredDays: newDays };
    });
  };

  const handleTimeChange = (type: 'start' | 'end') => (time: string) => {
    setFormData(prev => ({
      ...prev,
      preferredTimeRange: {
        ...prev.preferredTimeRange,
        [type]: time
      }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.reason) {
      toast.error('Please select a reason for advising');
      return;
    }

    if (formData.preferredDays.length === 0) {
      toast.error('Please select at least one preferred day');
      return;
    }

    // Validate time range
    if (formData.preferredTimeRange.start >= formData.preferredTimeRange.end) {
      toast.error('End time must be after start time');
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
          <Label htmlFor="reason">Reason for Advising *</Label>
          <Select 
            value={formData.reason} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, reason: value }))}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a reason" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="course-selection">Course Selection</SelectItem>
              <SelectItem value="degree-planning">Degree Planning</SelectItem>
              <SelectItem value="academic-concerns">Academic Concerns</SelectItem>
              <SelectItem value="graduation-check">Graduation Check</SelectItem>
              <SelectItem value="career-guidance">Career Guidance</SelectItem>
              <SelectItem value="other">Other</SelectItem>
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
            className="min-h-[120px]"
          />
          <p className="text-sm text-muted-foreground">
            Maximum 1000 characters
          </p>
        </div>

        {/* Availability Section */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Availability Preferences *</h2>
          
          {/* Preferred Days */}
          <div className="space-y-2">
            <Label>Preferred Days</Label>
            <div className="flex flex-wrap gap-4">
              {Object.values(DayOfWeek).map(day => (
                <div key={day} className="flex items-center space-x-2">
                  <Checkbox
                    id={`day-${day}`}
                    checked={formData.preferredDays.includes(day)}
                    onCheckedChange={(checked) => handleDaySelection(day, checked)}
                  />
                  <Label htmlFor={`day-${day}`} className="font-normal">
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Preferred Time Range */}
          <div className="space-y-2">
            <Label>Preferred Time Range</Label>
            <div className="flex items-center gap-4">
              <div className="w-full">
                <Label htmlFor="start-time" className="block mb-1">From</Label>
                <TimePicker
                  value={formData.preferredTimeRange.start}
                  onChange={handleTimeChange('start')}
                />
              </div>
              <div className="w-full">
                <Label htmlFor="end-time" className="block mb-1">To</Label>
                <TimePicker
                  value={formData.preferredTimeRange.end}
                  onChange={handleTimeChange('end')}
                  minTime={formData.preferredTimeRange.start}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isPending}
        >
          {isPending ? (
            <>
              <span className="animate-spin mr-2">↻</span>
              Submitting...
            </>
          ) : (
            'Submit Request'
          )}
        </Button>
      </form>
    </div>
  );
}