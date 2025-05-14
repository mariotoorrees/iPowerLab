import { User, ChevronRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useUser, useUpdateUser } from "@/hooks/use-metrics";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type SettingItemProps = {
  title: string;
  description: string;
  value: string | number | boolean;
  isSwitch?: boolean;
  onClick?: () => void;
};

function SettingItem({ title, description, value, isSwitch = false, onClick }: SettingItemProps) {
  return (
    <div className="p-4 flex justify-between items-center">
      <div>
        <h3 className="font-medium">{title}</h3>
        <p className="text-sm text-on-surface-variant">{description}</p>
      </div>
      <div className="text-right flex items-center">
        {isSwitch ? (
          <Switch checked={value as boolean} onCheckedChange={onClick} />
        ) : (
          <>
            <span className="font-medium mr-2">{value}</span>
            <ChevronRight className="text-on-surface-variant h-4 w-4" />
          </>
        )}
      </div>
    </div>
  );
}

export default function Settings() {
  const { data: user, isLoading } = useUser();
  const { mutate: updateUser } = useUpdateUser();

  const toggleDarkMode = () => {
    if (user) {
      updateUser({
        id: user.id,
        updates: { useDarkMode: !user.useDarkMode }
      });
    }
  };

  const toggleNotifications = () => {
    if (user) {
      updateUser({
        id: user.id,
        updates: { notificationsEnabled: !user.notificationsEnabled }
      });
    }
  };

  return (
    <div className="px-5 py-6 pb-20 animate-in fade-in duration-300">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>
      
      {/* Profile Settings */}
      <div className="bg-white rounded-[12px] shadow-card p-5 mb-6">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 rounded-full bg-surface-variant mr-4 flex items-center justify-center">
            <User className="h-6 w-6 text-on-surface-variant" />
          </div>
          <div>
            {isLoading ? (
              <>
                <Skeleton className="h-6 w-32 mb-1" />
                <Skeleton className="h-4 w-48" />
              </>
            ) : (
              <>
                <h2 className="font-semibold text-lg">{user?.name || 'User'}</h2>
                <p className="text-on-surface-variant">{user?.email || 'user@example.com'}</p>
              </>
            )}
          </div>
        </div>
        <Button variant="outline" className="w-full">
          Edit Profile
        </Button>
      </div>
      
      {/* Personal Info */}
      <h2 className="text-lg font-semibold mb-3">Personal Information</h2>
      <div className="bg-white rounded-[12px] shadow-card divide-y divide-divider mb-6">
        <SettingItem
          title="Weight"
          description="Used for calorie calculations"
          value={isLoading ? <Skeleton className="h-5 w-12" /> : `${user?.weight || '175'} ${user?.weightUnit || 'lbs'}`}
          onClick={() => {}}
        />
        
        <SettingItem
          title="Height"
          description="Used for BMI calculations"
          value={isLoading ? <Skeleton className="h-5 w-12" /> : "5'10\""}
          onClick={() => {}}
        />
        
        <SettingItem
          title="Age"
          description="Used for metabolism estimates"
          value={isLoading ? <Skeleton className="h-5 w-12" /> : user?.age || '32'}
          onClick={() => {}}
        />
        
        <SettingItem
          title="Activity Level"
          description="Used for calorie goals"
          value={isLoading ? <Skeleton className="h-5 w-20" /> : capitalize(user?.activityLevel || 'Moderate')}
          onClick={() => {}}
        />
      </div>
      
      {/* Goals */}
      <h2 className="text-lg font-semibold mb-3">Goals</h2>
      <div className="bg-white rounded-[12px] shadow-card divide-y divide-divider mb-6">
        <SettingItem
          title="Target Weight"
          description="Your weight goal"
          value={isLoading ? <Skeleton className="h-5 w-12" /> : `${user?.targetWeight || '165'} ${user?.weightUnit || 'lbs'}`}
          onClick={() => {}}
        />
        
        <SettingItem
          title="Weekly Goal"
          description="Rate of weight change"
          value={isLoading ? <Skeleton className="h-5 w-20" /> : "Lose 1 lb/week"}
          onClick={() => {}}
        />
        
        <SettingItem
          title="Macronutrient Goals"
          description="Your protein/fat/carb targets"
          value="Customize"
          onClick={() => {}}
        />
      </div>
      
      {/* App Settings */}
      <h2 className="text-lg font-semibold mb-3">App Settings</h2>
      <div className="bg-white rounded-[12px] shadow-card divide-y divide-divider mb-6">
        <SettingItem
          title="Units"
          description="Measurement units"
          value={isLoading ? <Skeleton className="h-5 w-16" /> : capitalize(user?.units || 'Imperial')}
          onClick={() => {}}
        />
        
        <SettingItem
          title="Notifications"
          description="Reminders and alerts"
          value={isLoading ? false : (user?.notificationsEnabled ?? true)}
          isSwitch={true}
          onClick={toggleNotifications}
        />
        
        <SettingItem
          title="Dark Mode"
          description="Toggle dark theme"
          value={isLoading ? false : (user?.useDarkMode ?? false)}
          isSwitch={true}
          onClick={toggleDarkMode}
        />
        
        <SettingItem
          title="Data Privacy"
          description="Manage your data"
          value=""
          onClick={() => {}}
        />
      </div>
      
      {/* Account Actions */}
      <div className="space-y-3 mb-8">
        <Button variant="outline" className="w-full py-3">
          Help & Support
        </Button>
        <Button variant="outline" className="w-full py-3 text-red-500 border-red-500">
          Sign Out
        </Button>
      </div>
      
      <p className="text-xs text-center text-on-surface-variant mb-4">
        NutriTrack v1.0.0 • Terms of Service • Privacy Policy
      </p>
    </div>
  );
}

// Helper function
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
