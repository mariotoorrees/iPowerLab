import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { 
  FaDumbbell, FaUtensils, FaUsers, FaBrain, FaBed, 
  FaBolt, FaChartBar, FaBook 
} from "react-icons/fa";

type QuickAccessCard = {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  route?: string;
  action?: () => void;
  comingSoon?: boolean;
};

export function QuickAccessCards() {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  
  const quickAccessItems: QuickAccessCard[] = [
    {
      id: "meals",
      title: "Log Meals",
      icon: <FaUtensils className="h-6 w-6 text-[#027eb3]" />,
      color: "bg-white text-black",
      route: "/calories"
    },
    {
      id: "activity",
      title: "Activities",
      icon: <FaDumbbell className="h-6 w-6 text-[#027eb3]" />,
      color: "bg-white text-black",
      comingSoon: true
    },
    {
      id: "advisor",
      title: "iAI Coach",
      icon: <FaBrain className="h-6 w-6 text-[#027eb3]" />,
      color: "bg-white text-black",
      route: "/chatbot"
    },
    {
      id: "nutrition",
      title: "Nutrition",
      icon: <FaChartBar className="h-6 w-6 text-[#027eb3]" />,
      color: "bg-white text-black",
      comingSoon: true
    },
    {
      id: "sleep",
      title: "Sleep",
      icon: <FaBed className="h-6 w-6 text-[#027eb3]" />,
      color: "bg-white text-black",
      comingSoon: true
    },
    {
      id: "insights",
      title: "Insights",
      icon: <FaBolt className="h-6 w-6 text-[#027eb3]" />,
      color: "bg-white text-black",
      comingSoon: true
    },
    {
      id: "recipes",
      title: "Recipes",
      icon: <FaBook className="h-6 w-6 text-[#027eb3]" />,
      color: "bg-white text-black",
      comingSoon: true
    },
    {
      id: "community",
      title: "Community",
      icon: <FaUsers className="h-6 w-6 text-[#027eb3]" />,
      color: "bg-white text-black",
      comingSoon: true
    },
  ];

  const handleItemClick = (item: QuickAccessCard) => {
    if (item.comingSoon) {
      toast({
        title: "Coming Soon",
        description: `The ${item.title} feature will be available soon.`,
        duration: 3000
      });
      return;
    }
    
    if (item.route) {
      navigate(item.route);
    } else if (item.action) {
      item.action();
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        {quickAccessItems.map((item) => (
          <div 
            key={item.id}
            className="flex flex-col items-center p-3 rounded-xl cursor-pointer transition-transform hover:scale-105 active:scale-95 shadow-md bg-white"
            onClick={() => handleItemClick(item)}
          >
            <div className="w-14 h-14 rounded-xl border-2 border-[#eaeaea] shadow-sm flex items-center justify-center mb-2 bg-[#f7f7f7]">
              {item.icon}
            </div>
            <p className="text-xs text-gray-700 font-medium">{item.title}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
