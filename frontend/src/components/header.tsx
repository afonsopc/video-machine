import { ModeToggle } from "./theme/mode-toggle";

type Props = {};

const header = (_props: Props) => {
  return (
    <div className="flex w-full justify-between border-b p-2 px-3 shadow-sm">
      <div className="hidden w-32 items-center text-xs text-nowrap select-none hover:opacity-80 sm:flex">
        🔴 🟡 🟢
      </div>
      <div className="w-full text-center font-bold sm:w-32">Video Machine</div>
      <div className="hidden w-32 items-center justify-end sm:flex">
        <ModeToggle className="size-6" />
      </div>
    </div>
  );
};

export default header;
