import { QueryClientProvider } from "@tanstack/react-query";
import { Route, Switch } from "wouter";
import { queryClient } from "./lib/queryClient";
import Home from "./pages/Home";
import Discover from "./pages/Discover";
import StoryDetail from "./pages/StoryDetail";
import CreateStory from "./pages/CreateStory";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/discover" component={Discover} />
          <Route path="/create" component={CreateStory} />
          <Route path="/stories/:id" component={StoryDetail} />
          <Route component={NotFound} />
        </Switch>
      </Layout>
    </QueryClientProvider>
  );
}
