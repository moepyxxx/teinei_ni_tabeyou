import { useState, type FC, type ReactNode } from "react";
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

type Material = {
  item: string;
  amount: string;
};

export type Recipe = {
  title: string;
  source_url: string | null;
  source_memo: string | null;
  materials: Material[];
  memo: string | null;
};

type Props = {
  recipeID: number;
  renderButton: (onClick: () => void) => ReactNode;
};

export const RecipeEditDrawer: FC<Props> = ({ recipeID, renderButton }) => {
  const { toast } = useToast();

  const [initialRecipe, setInitialRecipe] = useState<Recipe | null>(null);
  const onClick = async () => {
    const recipe: Recipe = await (
      await fetch(`${import.meta.env.VITE_API_URL}/recipes/${recipeID}`, {
        method: "GET",
        credentials: "include",
      })
    ).json();
    setInitialRecipe(recipe);
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>{renderButton(onClick)}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm px-2">
          <DrawerHeader>
            <DrawerTitle>レシピの詳細</DrawerTitle>
          </DrawerHeader>
          {initialRecipe ? (
            <RecipeEdit
              initialRecipe={initialRecipe}
              renderAction={(onSubmit) => (
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button
                      type="submit"
                      onClick={(e) => {
                        // @ts-expect-error なぜかわからない・・・
                        onSubmit(e);
                      }}>
                      変更を保存する
                    </Button>
                  </DrawerClose>
                  <DrawerClose asChild>
                    <Button
                      variant="outline"
                      onClick={() => setInitialRecipe(null)}>
                      キャンセル
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              )}
              onSubmit={async ({ title, sourceMemo, sourceURL, materials }) => {
                const response = await fetch(
                  `${import.meta.env.VITE_API_URL}/recipes/${recipeID}`,
                  {
                    method: "PATCH",
                    headers: new Headers({
                      "Content-Type": "application/json",
                    }),
                    body: JSON.stringify({
                      title,
                      source_memo: sourceMemo,
                      source_url: sourceURL,
                      materials,
                    }),
                    credentials: "include",
                  }
                );
                if (!response.ok) {
                  toast({
                    description: "保存に失敗しました・・・",
                  });
                  return;
                }
                toast({
                  description: "レシピを保存しました！",
                });
              }}
            />
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
