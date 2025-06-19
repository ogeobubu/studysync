import { useEffect, useState } from "react";
import {
  GraduationCap, Mail, NotebookPen, Calendar, Edit, Save, X
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../components/ui/select";
import { Progress } from "../../components/ui/progress";
import { useHttp } from "../../api/useHttp";
import toast from "react-hot-toast";

type UserProfile = {
  name: string;
  email: string;
  phoneNumber?: string;
  address?: string;
  gender?: "male" | "female" | null;
  matricNumber?: string;  // Added matric number
  program?: string;
  level?: string;
  cgpa?: number;
  gpa?: number;
};

const programs = [
  'Computer Science', 
  'Computer Science with Mathematics', 
  'Computer Science with Economics', 
  'Computer Engineering'
];

export default function StudentProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const { data, isPending } = useHttp<{ data: UserProfile }>({
    url: "/users/me",
    method: "GET"
  });

  const updateMutation = useHttp<{ data: UserProfile }, Partial<UserProfile>>({
    url: "/users/me",
    method: "PUT"
  });

  useEffect(() => {
    if (data?.data) setProfile(data.data);
  }, [data]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev!, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setProfile(prev => ({ ...prev!, [name]: value }));
  };

  const handleSave = () => {
    if (!profile) return;

    updateMutation.mutate(profile, {
      onSuccess: (res) => {
        setProfile(res);
        setIsEditing(false);
        toast.success("Profile updated successfully!");
      }
    });
  };

  if (isPending || !profile) return <div className="p-6">Loading profile...</div>;

  return (
    <div className="p-6 space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start">
          <div className="w-full space-y-6">
            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={profile.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="matricNumber">Matric Number</Label>
                  <Input
                    id="matricNumber"
                    name="matricNumber"
                    type="text"
                    value={profile.matricNumber || ""}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="text"
                    value={profile.phoneNumber || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    value={profile.address || ""}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={profile.gender || ""}
                      onValueChange={(value) => handleSelectChange("gender", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="program">Program</Label>
                    <Select
                      value={profile.program || ""}
                      onValueChange={(value) => handleSelectChange("program", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select program" />
                      </SelectTrigger>
                      <SelectContent>
                        {programs.map((program) => (
                          <SelectItem key={program} value={program}>{program}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Select
                    value={profile.level || ""}
                    onValueChange={(value) => handleSelectChange("level", value)}
                  >
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
              </>
            ) : (
              <div>
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <div className="flex items-center gap-4 mt-2 text-gray-600">
                  <div className="flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" />
                    <span>{profile.program || "Program N/A"}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{profile.level || "Level N/A"}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 ml-4 mt-2">
            {isEditing ? (
              <>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSave} disabled={updateMutation.isPending}>
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            )}
          </div>
        </div>

        {/* Academic Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">GPA</h3>
            <span className="text-3xl font-bold">{profile.gpa?.toFixed(2) || "0.00"}</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">CGPA</h3>
            <span className="text-3xl font-bold">{profile.cgpa?.toFixed(2) || "0.00"}</span>
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-gray-500">Level</h3>
            <span className="text-3xl font-bold">{profile.level || "N/A"}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button className="h-12">
          <Mail className="h-5 w-5 mr-2" />
          Contact Advisor
        </Button>
        <Button className="h-12">
          <NotebookPen className="h-5 w-5 mr-2" />
          View Academic Record
        </Button>
      </div>
    </div>
  );
}