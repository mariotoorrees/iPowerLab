import { useLocation, Link } from "wouter";
import { BarChart2, Brain, Home, Settings } from "lucide-react";

type TabItemProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
};

function TabItem({ to, icon, label, isActive }: TabItemProps) {
  return (
    <Link href={to}>
      <div className="flex flex-col items-center justify-center">
        <div className={`flex flex-col items-center ${isActive ? 'text-[#027eb3]' : 'text-gray-400'}`}>
          <div className="mb-0.5">
            {icon}
          </div>
          <span className="text-[10px] font-medium">{label}</span>
          {isActive && <div className="w-1 h-1 rounded-full bg-[#027eb3] mt-0.5" />}
        </div>
      </div>
    </Link>
  );
}

export function BottomTabs() {
  const [location] = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-xl mx-auto bg-white/95 backdrop-blur-md border-t border-gray-200 py-2 pb-6 z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
      <div className="flex justify-around items-center px-3">
        <TabItem 
          to="/"
          icon={<Home className="h-5 w-5" />}
          label="Profile"
          isActive={location === "/" || location === "/dashboard"}
        />
        <TabItem 
          to="/calories"
          icon={<BarChart2 className="h-5 w-5" />}
          label="Meals"
          isActive={location === "/calories"}
        />
        <TabItem 
          to="/chatbot"
          icon={<Brain className="h-5 w-5" />}
          label="iAI"
          isActive={location === "/chatbot"}
        />
        <TabItem 
          to="/settings"
          icon={<Settings className="h-5 w-5" />}
          label="Settings"
          isActive={location === "/settings"}
        />
      </div>
    </div>
  );
}
