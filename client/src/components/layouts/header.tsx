import { Bell } from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { useUser } from "@/hooks/use-metrics";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type HeaderProps = {
  title?: string;
};

export function Header({ title }: HeaderProps) {
  const { data: user } = useUser();
  const initials = user?.name ? user.name.split(' ').map((n: string) => n[0]).join('') : 'U';
  
  return (
    <header className="bg-gray-50 px-4 py-3">
      <div className="flex items-center justify-between">
        <Avatar className="h-8 w-8 ring-1 ring-gray-200 shadow-sm">
          <AvatarImage src="/avatar-placeholder.jpg" alt={user?.name || "User"} />
          <AvatarFallback className="bg-white text-gray-700">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <Logo className="h-7" />
        
        <button className="w-8 h-8 flex items-center justify-center text-black relative">
          <Bell className="h-[20px] w-[20px] stroke-[2.5px]" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
        </button>
      </div>
    </header>
  );
}