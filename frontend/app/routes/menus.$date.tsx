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
import { useMemo } from "react";
import { RecipeEditDrawer } from "~/components/RecipeEditDrawer";

type Recipe = {
  id: number;
  title: string;
  source_url: string | null;
};

type Menus = {
  dinner: Recipe[] | null;
  lunch: Recipe[] | null;
  morning: Recipe[] | null;
};

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

const Sections: {
  value: keyof Menus;
  label: string;
}[] = [
  {
    value: "dinner",
    label: "夜ごはん",
  },
  {
    value: "lunch",
    label: "お昼ごはん",
  },
  {
    value: "morning",
    label: "朝ごはん",
  },
];

export default function Menus() {
  const { date, menus } = useLoaderData<typeof clientLoader>();

  const isNotMenu = useMemo(() => {
    return (
      (menus.dinner === null || menus.dinner.length === 0) &&
      (menus.lunch === null || menus.lunch.length === 0) &&
      (menus.morning === null || menus.morning.length === 0)
    );
  }, [menus]);

  return (
    <BaseLayout title={`${format(date, "MM/dd(E)", { locale: ja })}の献立`}>
      <Accordion type="single" collapsible>
        {isNotMenu ? (
          <p className="text-center">まだ献立はありません</p>
        ) : (
          Sections.map((section) => {
            const recipes = menus[section.value];
            return (
              <AccordionItem value={section.value} key={section.value}>
                <AccordionTrigger className="text-base no-underline">
                  {section.label}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    {recipes?.map((recipe) => (
                      <div className="flex justify-between" key={recipe.id}>
                        <div className="w-1/2">
                          <p>{recipe.title}</p>
                        </div>
                        <div className="flex gap-2">
                          {recipe.source_url && (
                            <a
                              href={recipe.source_url}
                              rel="noreferrer"
                              target="_blank"
                              className="flex items-center gap-1">
                              <i className="fa-solid fa-paper-plane" />
                              <span>リンク</span>
                            </a>
                          )}
                          <button
                            type="button"
                            className="flex items-center gap-1">
                            <i className="fa-solid fa-file" />
                            <span>詳細</span>
                          </button>
                          <RecipeEditDrawer
                            recipeID={recipe.id}
                            renderButton={(onClick) => (
                              <button
                                onClick={onClick}
                                type="button"
                                className="flex items-center gap-1">
                                <i className="fa-solid fa-pen" />
                                <span>編集</span>
                              </button>
                            )}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })
        )}
      </Accordion>
      <div className="mt-8">
        <h3 className="text-lg mb-2 font-bold">アドバイス</h3>
        <p>
          このレシピにはサラダが入っていてとても良い感じです。きのこも鉄分が豊富なのでいいですね。ただ、お肉や魚の品数が、お肉に偏っているので、お魚も食べてみてください。
        </p>
      </div>
      <div className="text-center mt-8">
        <Button variant="link">献立を編集する</Button>
      </div>
    </BaseLayout>
  );
}
