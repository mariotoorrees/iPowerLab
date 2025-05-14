import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Calories from "@/pages/calories";
import Chatbot from "@/pages/chatbot";
import Settings from "@/pages/settings";
import { BottomTabs } from "@/components/layouts/bottom-tabs";

function Router() {
  return (
    <div className="min-h-screen max-w-xl mx-auto bg-gray-100 overflow-hidden flex flex-col relative">
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/calories" component={Calories} />
        <Route path="/chatbot" component={Chatbot} />
        <Route path="/settings" component={Settings} />
        <Route component={NotFound} />
      </Switch>
      <BottomTabs />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
