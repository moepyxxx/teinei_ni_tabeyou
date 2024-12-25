import { BaseLayout } from "~/components/BaseLayout";
import { parse, isValid, format } from "date-fns";
import invariant from "tiny-invariant";
import {
  useLoaderData,
  useNavigate,
  type ClientLoaderFunctionArgs,
} from "@remix-run/react";
import { ja } from "date-fns/locale/ja";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { RecipeEditDrawer } from "~/components/RecipeEditDrawer";
import { type Menus, type Recipe, Sections } from "./menus.$date";
import { useState } from "react";
import { RecipeCombobox } from "~/components/RecipeCombobox";
import { RecipeCreateDrawer } from "~/components/RecipeCreateDrawer";
import { useToast } from "~/hooks/use-toast";

export const clientLoader = async ({ params }: ClientLoaderFunctionArgs) => {
  invariant(params.date, "missing date");
  const date = parse(params.date, "yyyyMMdd", new Date());
  if (!isValid(date)) {
    throw new Response("", { status: 404, statusText: "Not Found" });
  }

  const menus: Menus = await (
    await fetch(`${import.meta.env.VITE_API_URL}/menus/${params.date}`, {
      method: "GET",
      credentials: "include",
    })
  ).json();

  return {
    date,
    menus,
  };
};

export default function MenuEdit() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { date, menus } = useLoaderData<typeof clientLoader>();

  const [currentMenus, setCurrentMenus] = useState<Menus>(menus);
  const [isSetAdditionalRecipe, setIsSetAdditionalRecipe] =
    useState<boolean>(false);
  const [additionalRecipe, setAdditionalRecipe] = useState<Recipe | null>(null);

  const onSubmit = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/menus/${format(date, "yyyyMMdd")}`,
      {
        method: "PATCH",
        credentials: "include",
        headers: new Headers({
          "Content-Type": "application/json",
        }),
        body: JSON.stringify({
          lunch: currentMenus.lunch?.map((r) => r.id) ?? [],
          dinner: currentMenus.dinner?.map((r) => r.id) ?? [],
          morning: currentMenus.morning?.map((r) => r.id) ?? [],
        }),
      }
    );
    if (!response.ok) {
      toast({
        description: "保存に失敗しました・・・",
      });
      return;
    }

    toast({
      description: "献立を保存しました！",
    });
    navigate(`/menus/${format(date, "yyyyMMdd")}`);
  };

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
                  {!isSetAdditionalRecipe ? (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsSetAdditionalRecipe(true);
                        setAdditionalRecipe(null);
                      }}>
                      レシピを追加する
                    </Button>
                  ) : (
                    <div className="space-y-1">
                      <div className="flex gap-3">
                        <div className="basis-1/2">
                          <RecipeCombobox
                            alreadySelectedIDs={
                              recipes?.map((recipe) => recipe.id) || []
                            }
                            current={additionalRecipe}
                            onChange={setAdditionalRecipe}
                          />
                        </div>
                        <Button
                          disabled={additionalRecipe === null}
                          onClick={() => {
                            setCurrentMenus({
                              ...currentMenus,
                              [section.value]: [
                                ...(recipes || []),
                                additionalRecipe,
                              ],
                            });
                            setIsSetAdditionalRecipe(false);
                          }}>
                          レシピを追加
                        </Button>
                      </div>
                      <div className="basis-1-2">
                        <p className="text-sm">
                          気に入ったレシピがない時は…
                          <RecipeCreateDrawer
                            renderButton={() => (
                              <Button className="underline" variant="link">
                                レシピを作成
                              </Button>
                            )}
                          />
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
      <div className="text-center mt-8">
        <Button onClick={onSubmit}>変更内容を保存する</Button>
      </div>
    </BaseLayout>
  );
}
