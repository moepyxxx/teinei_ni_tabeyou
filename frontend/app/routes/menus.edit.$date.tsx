import { BaseLayout } from "~/components/BaseLayout";
import { parse, isValid, format } from "date-fns";
import invariant from "tiny-invariant";
import { useLoaderData, type ClientLoaderFunctionArgs } from "@remix-run/react";
import { ja } from "date-fns/locale/ja";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { RecipeEditDrawer } from "~/components/RecipeEditDrawer";
import { type Menus, Sections } from "./menus.$date";
import { useState } from "react";
import { RecipeCombobox } from "~/components/RecipeCombobox";
import { RecipeCreateDrawer } from "~/components/RecipeCreateDrawer";

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
  invariant(params.date, "missing date");
  const date = parse(params.date, "yyyyMMdd", new Date());
  if (!isValid(date)) {
    throw new Response("", { status: 404, statusText: "Not Found" });
  }

  const menus: Menus = await (
    await fetch(`${import.meta.env.VITE_API_URL}/menus/${params.date}`)
  ).json();

  return {
    date,
    menus,
  };
};

export default function MenuEdit() {
  const { date, menus } = useLoaderData<typeof clientLoader>();
  const [currentMenus, setCurrentMenus] = useState<Menus>(menus);
  const [additionalRecipe, setAdditionalRecipe] = useState<{
    id: null | number;
  } | null>(null);

  return (
    <BaseLayout
      title={`${format(date, "MM/dd(E)", { locale: ja })}の献立を編集`}>
      <Accordion type="single" collapsible>
        {Sections.map((section) => {
          const recipes = currentMenus[section.value];
          return (
            <AccordionItem value={section.value} key={section.value}>
              <AccordionTrigger className="text-base no-underline">
                {section.label}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-1">
                  {recipes?.map((recipe, recipeIndex) => (
                    <div
                      className="flex justify-between items-center gap-2"
                      key={recipe.id}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setCurrentMenus((prev) => {
                            const filteredIDs = prev[section.value]?.filter(
                              (_, index) => recipeIndex !== index
                            );
                            return {
                              ...prev,
                              [section.value]: filteredIDs,
                            };
                          })
                        }>
                        <i className="fa-regular fa-square-minus" />
                      </Button>
                      <div className="w-1/2">
                        <p>{recipe.title}</p>
                      </div>
                      <div className="flex gap-2 grow justify-end">
                        <RecipeEditDrawer
                          recipeID={recipe.id}
                          renderButton={(onClick) => (
                            <button
                              onClick={onClick}
                              type="button"
                              className="flex items-center gap-1">
                              <i className="fa-solid fa-file" />
                              <span>詳細</span>
                            </button>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                  {additionalRecipe === null ? (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setAdditionalRecipe({
                          id: null,
                        });
                      }}>
                      レシピを追加する
                    </Button>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex gap-3">
                        <div className="basis-1/2">
                          <RecipeCombobox
                            current={additionalRecipe.id}
                            onChange={(id) => setAdditionalRecipe({ id })}
                          />
                        </div>
                        <div className="basis-1-2">
                          <RecipeCreateDrawer
                            renderButton={() => (
                              <Button className="basis-1/2">
                                レシピを作成
                              </Button>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
      {/* <div className="mt-8">
        <h3 className="text-lg mb-2 font-bold">アドバイス</h3>
        <p>
          このレシピにはサラダが入っていてとても良い感じです。きのこも鉄分が豊富なのでいいですね。ただ、お肉や魚の品数が、お肉に偏っているので、お魚も食べてみてください。
        </p>
      </div> */}
      <div className="text-center mt-8">
        <Button>変更内容を保存する</Button>
      </div>
    </BaseLayout>
  );
}
