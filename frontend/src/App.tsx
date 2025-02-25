import { HTMLAttributes } from "react";
import { cn } from "./lib/utils";
import Machine from "./components/machine";

type Props = HTMLAttributes<HTMLDivElement>;

function MainBackground({ className, ...props }: Props) {
  return (
    <div className={cn("relative", className)} {...props}>
      <div className="bg-background absolute top-0 left-0 size-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <div className="absolute top-0 right-0 size-full bg-[radial-gradient(#ffffff33_1px,#00091d00_1px)] bg-[size:20px_20px]"></div>
    </div>
  );
}

const App = () => {
  return (
    <div className="relative flex h-dvh items-center justify-center">
      <MainBackground className="absolute inset-0 z-[-2]" />
      <Machine className="size-full max-h-5/6 max-w-5/6" />
    </div>
  );
};

export default App;
