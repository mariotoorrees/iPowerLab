import { cn } from "@/lib/utils";
import fruitBowlLogo from "../../assets/fruit-bowl-logo.png";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center", className)}>
      <div className="flex items-center">
        <div className="w-8 h-8 flex items-center justify-center relative">
          <img 
            src={fruitBowlLogo} 
            alt="iPowerLab Logo" 
            className="object-contain w-full h-full" 
          />
        </div>
        <span className="text-lg font-semibold ml-2 tracking-tighter text-[#027eb3]">iPowerLab</span>
      </div>
    </div>
  );
}