import { cn } from "@/lib/utils";
import { HTMLAttributes, useState } from "react";
import { ControlValues } from "@/lib/type";
import Header from "./header";
import Output from "./output";
import Control from "./control";

type Props = HTMLAttributes<HTMLDivElement>;

const Machine = ({ className, ...props }: Props) => {
  const [values, setValues] = useState<ControlValues>();

  return (
    <div
      className={cn(
        "bg-background overflow-hidden rounded-lg border shadow-md",
        className,
      )}
      {...props}
    >
      <Header />
      <div className="size-full overflow-scroll p-10">
        {values ? (
          <Output values={values} />
        ) : (
          <Control onSubmit={setValues} className="flex items-center" />
        )}
      </div>
    </div>
  );
};

export default Machine;
