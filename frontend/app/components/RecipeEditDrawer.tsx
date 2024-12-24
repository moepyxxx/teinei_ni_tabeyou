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
  const [initialRecipe, setInitialRecipe] = useState<Recipe | null>(null);
  const onClick = async () => {
    const recipe: Recipe = await (
      await fetch(`${import.meta.env.VITE_API_URL}/recipes/${recipeID}`)
    ).json();
    setInitialRecipe(recipe);
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>{renderButton(onClick)}</DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm px-2">
          <DrawerHeader>
            <DrawerTitle>レシピを編集する</DrawerTitle>
          </DrawerHeader>
          {initialRecipe ? (
            <RecipeEdit
              initialRecipe={initialRecipe}
              recipeID={recipeID}
              renderAction={(onSubmit) => (
                <DrawerFooter>
                  <DrawerClose asChild>
                    <Button type="submit" onClick={onSubmit}>
                      保存する
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
            />
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};
