import { useUser } from "@/hooks/use-metrics";
import { CalorieProgress } from "@/components/dashboard/calorie-progress";
import { WeightChart } from "@/components/dashboard/weight-chart";
import { QuickAccessCards } from "@/components/dashboard/quick-access-cards";
import { Header } from "@/components/layouts/header";
import { format } from "date-fns";
import { Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Dashboard() {
  const { data: user, isLoading } = useUser();
  const today = format(new Date(), "EEEE, MMMM d");

  return (
    <div className="animate-in fade-in duration-300 flex flex-col h-full bg-gray-50">
      <Header />
      
      <div className="px-4 py-3 pb-16 flex-1 overflow-auto space-y-3">

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between items-start">
            <h2 className="text-lg font-bold">Calories</h2>
            <div className="flex flex-col items-end">
              <p className="text-sm text-gray-500">{today}</p>
              <div className="text-[10px] text-gray-400 mt-0.5">
                Goal - Food + Exercise = Remaining
              </div>
            </div>
          </div>
          <CalorieProgress />
        </div>

        <div className="bg-white rounded-xl shadow p-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-bold">Weight Progress</h2>
            <p className="text-sm text-gray-500">Last 90 days</p>
          </div>
          <WeightChart />
        </div>

        <div className="bg-white rounded-xl shadow p-4 pb-5">
          <h2 className="text-lg font-bold mb-3">Quick Access</h2>
          <QuickAccessCards />
        </div>
      </div>
    </div>
  );
}
