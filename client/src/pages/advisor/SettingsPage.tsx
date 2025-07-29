import { useState, useEffect } from 'react';
import { useAuth } from "../../context/AuthContext"
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
import { Switch } from '../../components/ui/switch';
import toast from 'react-hot-toast';
import { useHttp } from '../../api/useHttp';
import type { UserSettings } from '../../types';
import noImage from "../../assets/noImage.jpg";

export default function SettingsPage() {
const { setUser } = useAuth()
  const { data: userData, isPending: isLoading, error: fetchError } = useHttp<{ data: UserSettings }>({
    url: '/users/me',
    method: 'GET',
  });

  const updateMutation = useHttp<FormData, { data: UserSettings }>({
    url: '/users/me',
    method: 'PUT',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  const [profileData, setProfileData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    profilePhoto: null as File | null,
    profilePhotoUrl: '',
  });

  const [notifications, setNotifications] = useState({
    email: false,
    sms: false,
  });

  const [preferences, setPreferences] = useState({
    language: 'en',
    theme: 'light',
  });

  const [privacy, setPrivacy] = useState({
    shareData: true,
    profileVisible: false,
  });

  useEffect(() => {
    if (userData?.data) {
      const data = userData.data;
      setProfileData({
        fullName: data.name || '',
        email: data.email || '',
        phoneNumber: data.phoneNumber || '',
        profilePhoto: null,
        profilePhotoUrl: data.profilePhoto || '',
      });

      if (data.settings) {
        setNotifications(data.settings.notifications || { email: false, sms: false });
        setPreferences(data.settings.preferences || { language: 'en', theme: 'light' });
        setPrivacy(data.settings.privacy || { shareData: true, profileVisible: false });
      }
    }
  }, [userData]);

  useEffect(() => {
    if (fetchError) {
      toast.error('Failed to load user data');
    }
  }, [fetchError]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfileData(prev => ({
        ...prev,
        profilePhoto: file,
        profilePhotoUrl: URL.createObjectURL(file),
      }));
    }
  };

  const handleNotificationToggle = (type: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const handlePreferenceChange = (key: keyof typeof preferences, value: string) => {
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  const handlePrivacyToggle = (type: keyof typeof privacy) => {
    setPrivacy(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('name', profileData.fullName);
    formData.append('email', profileData.email);
    formData.append('phoneNumber', profileData.phoneNumber);
    if (profileData.profilePhoto) {
      formData.append('profilePhoto', profileData.profilePhoto);
    }

    formData.append('settings[notifications][email]', notifications.email.toString());
    formData.append('settings[notifications][sms]', notifications.sms.toString());
    formData.append('settings[preferences][language]', preferences.language);
    formData.append('settings[preferences][theme]', preferences.theme);
    formData.append('settings[privacy][shareData]', privacy.shareData.toString());
    formData.append('settings[privacy][profileVisible]', privacy.profileVisible.toString());

    updateMutation.mutate(formData, {
      onSuccess: (data) => {
        toast.success('Settings saved successfully!');
        setUser(data.data)
      },
      onError: (error) => {
        toast.error(`Failed to save settings: ${error.message || 'Unknown error'}`);
      },
    });
  };

  return (
    <div className="w-full max-w-2xl p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Settings</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Profile</h3>
          <div>
            <Label htmlFor="profilePhoto">Profile Photo</Label>
            <div className="mb-2">
              <img
                src={profileData.profilePhotoUrl && profileData.profilePhotoUrl !== "default.jpg" ? profileData.profilePhotoUrl : noImage}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
            </div>
            <Input
              id="profilePhoto"
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="mt-1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              value={profileData.fullName}
              onChange={handleProfileChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={profileData.email}
              onChange={handleProfileChange}
              disabled
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              value={profileData.phoneNumber}
              onChange={handleProfileChange}
            />
          </div>
        </div>

        {/* Notifications Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Notifications</h3>
          <div className="flex items-center justify-between">
            <Label htmlFor="emailNotifications">Email Notifications</Label>
            <Switch
              id="emailNotifications"
              checked={notifications.email}
              onCheckedChange={() => handleNotificationToggle('email')}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="smsNotifications">SMS Notifications</Label>
            <Switch
              id="smsNotifications"
              checked={notifications.sms}
              onCheckedChange={() => handleNotificationToggle('sms')}
            />
          </div>
        </div>

        {/* Preferences Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Application Preferences</h3>
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select
              value={preferences.language}
              onValueChange={(value) => handlePreferenceChange('language', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select
              value={preferences.theme}
              onValueChange={(value) => handlePreferenceChange('theme', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Privacy</h3>
          <div className="flex items-center justify-between">
            <Label htmlFor="shareData">Share Data with Advisors</Label>
            <Switch
              id="shareData"
              checked={privacy.shareData}
              onCheckedChange={() => handlePrivacyToggle('shareData')}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="profileVisible">Make Profile Visible to Other Students</Label>
            <Switch
              id="profileVisible"
              checked={privacy.profileVisible}
              onCheckedChange={() => handlePrivacyToggle('profileVisible')}
            />
          </div>
        </div>

        <div className="pt-4">
          <Button type="submit" className="w-full" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
}