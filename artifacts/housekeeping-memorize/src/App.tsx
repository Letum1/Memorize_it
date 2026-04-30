import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Study from "@/pages/study";
import Results from "@/pages/results";
import Review from "@/pages/review";
import BrainDump from "@/pages/brain-dump";
import TeachIt from "@/pages/teach-it";
import Mnemonic from "@/pages/mnemonic";
import Match from "@/pages/match";
import DailyDrill from "@/pages/daily-drill";
import SpeedRound from "@/pages/speed-round";
import Procedures from "@/pages/procedures";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/review" component={Review} />
      <Route path="/review/:slide" component={Review} />
      <Route path="/brain-dump" component={BrainDump} />
      <Route path="/teach-it" component={TeachIt} />
      <Route path="/mnemonic" component={Mnemonic} />
      <Route path="/match" component={Match} />
      <Route path="/procedures" component={Procedures} />
      <Route path="/procedures/:slide" component={Procedures} />
      <Route path="/daily-drill" component={DailyDrill} />
      <Route path="/speed-round" component={SpeedRound} />
      <Route path="/study/:mode" component={Study} />
      <Route path="/results" component={Results} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
