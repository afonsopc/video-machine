import Machine from "./components/machine";
import { ThemeProvider } from "./components/theme/theme-provider";
import { Toaster } from "./components/ui/sonner";

const App = () => {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Machine className="h-dvh w-full p-10" />
      <Toaster />
    </ThemeProvider>
  );
};

export default App;
