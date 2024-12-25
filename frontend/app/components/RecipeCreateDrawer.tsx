import type { FC, ReactNode } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { Button } from "~/components/ui/button";
import { RecipeEdit } from "./RecipeEdit";
import { useToast } from "~/hooks/use-toast";

type Props = {
  renderButton: () => ReactNode;
};

export const RecipeCreateDrawer: FC<Props> = ({ renderButton }) => {
  const { toast } = useToast();

  return (
    <Drawer>
      <DrawerTrigger asChild>{renderButton()}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm px-2">
          <DrawerHeader>
            <DrawerTitle>レシピの作成</DrawerTitle>
          </DrawerHeader>
          <RecipeEdit
            renderAction={(onSubmit) => (
              <DrawerFooter>
                <DrawerClose asChild>
                  <Button
                    type="submit"
                    onClick={(e) => {
                      // @ts-expect-error なぜかわからない・・・
                      onSubmit(e);
                    }}>
                    作成して保存する
                  </Button>
                </DrawerClose>
                <DrawerClose asChild>
                  <Button variant="outline">キャンセル</Button>
                </DrawerClose>
              </DrawerFooter>
            )}
            onSubmit={async ({ title, sourceMemo, sourceURL, materials }) => {
              const response = await fetch(
                `${import.meta.env.VITE_API_URL}/recipes`,
                {
                  method: "POST",
                  headers: new Headers({
                    "Content-Type": "application/json",
                  }),
                  body: JSON.stringify({
                    title,
                    source_memo: sourceMemo,
                    source_url: sourceURL,
                    materials,
                  }),
                }
              );
              if (!response.ok) {
                toast({
                  description: "作成に失敗しました・・・",
                });
                return;
              }
              toast({
                description: "レシピを作成しました！",
              });
            }}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};
