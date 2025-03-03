import { HTMLAttributes, useState } from "react";
import { ControlValues } from "@/lib/type";
import Output from "./output";
import Control from "./control";
import { cn } from "@/lib/utils";

type Props = HTMLAttributes<HTMLDivElement>;

const Machine = ({ className, ...props }: Props) => {
  const [values, setValues] = useState<ControlValues>();

  return (
    <div className={cn("relative", className)} {...props}>
      <MainBackground className="absolute top-0 left-0 -z-10 h-full w-full opacity-50" />
      <div className="z-10">
        {values ? (
          <Output values={values} />
        ) : (
          <Control onSubmit={setValues} className="flex items-center" />
        )}
      </div>
    </div>
  );
};

type MainBackgroundProps = HTMLAttributes<HTMLDivElement>;

function MainBackground({ className, ...props }: MainBackgroundProps) {
  return (
    <div className={cn("relative", className)} {...props}>
      <div className="bg-background absolute top-0 left-0 size-full bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <div className="absolute top-0 right-0 size-full bg-[radial-gradient(#ffffff33_1px,#00091d00_1px)] bg-[size:20px_20px]"></div>
    </div>
  );
}

export default Machine;
