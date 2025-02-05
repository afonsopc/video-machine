import React from "react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

const EditorMenubar = ({ className }: Props) => {
  return (
    <div className={cn(className)}>
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              Save <MenubarShortcut>⇧ S</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Export <MenubarShortcut>⇧ E</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Tracks</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              New Audio Track <MenubarShortcut>⇧ A</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              New Captions Track <MenubarShortcut>⇧ C</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              New Track <MenubarShortcut>⇧ T</MenubarShortcut>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </div>
  );
};

export default EditorMenubar;
