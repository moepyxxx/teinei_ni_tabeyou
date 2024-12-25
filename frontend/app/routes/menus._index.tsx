import { BaseLayout } from "~/components/BaseLayout";
import { addDays, formatDate, parse } from "date-fns";
import type { Menus } from "./menus.$date";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { Button } from "~/components/ui/button";

const fetchMenus = async (from: string, to: string) => {
  const menus: MenusWithDate[] = await (
    await fetch(
      `${import.meta.env.VITE_API_URL}/menus/?from=${from}&to=${to}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
  ).json();
  return menus;
};

type MenusWithDate = Menus & {
  date: string;
};

export const clientLoader = async () => {
  const now = new Date();
  const from = formatDate(now, "yyyyMMdd");
  const to = formatDate(addDays(now, 6), "yyyyMMdd");

  const menus = await fetchMenus(from, to);

  return {
    menus,
    from,
    to,
  };
};

export default function MenusIndex() {
  const { menus, from, to } = useLoaderData<typeof clientLoader>();

  const [period, setPeriod] = useState<{ from: string; to: string }>({
    from,
    to,
  });
  const [weeklyMenus, setWeeklyMenus] = useState<MenusWithDate[]>(menus);

  const onFetchWeeklyMenus = async (isPrev: boolean) => {
    const from = formatDate(
      addDays(parse(period.from, "yyyyMMdd", new Date()), isPrev ? -6 : 6),
      "yyyyMMdd"
    );
    const to = formatDate(
      addDays(parse(period.to, "yyyyMMdd", new Date()), isPrev ? -6 : 6),
      "yyyyMMdd"
    );
    const menus = await fetchMenus(from, to);

    setPeriod({ from, to });
    setWeeklyMenus(menus);
  };

  return (
    <BaseLayout title="献立をたてよう">
      <div className="space-y-2">
        <div className="flex justify-between">
          <Button variant="ghost" onClick={() => onFetchWeeklyMenus(true)}>
            <i className="fa-solid fa-chevron-left" />
          </Button>
          <Button variant="ghost" onClick={() => onFetchWeeklyMenus(false)}>
            <i className="fa-solid fa-chevron-right" />
          </Button>
        </div>
        <div>
          {weeklyMenus.map((menus, index) => (
            <Link
              to={`/menus/${formatDate(new Date(menus.date), "yyyyMMdd")}`}
              key={menus.date}>
              <span
                className={`flex border-b border-b-slate-300 ${
                  index === 0 ? "border-t border-t-slate-300" : ""
                } border-dotted py-5 items-start gap-2`}>
                <span className="w-20">
                  {formatDate(new Date(menus.date), "MM/dd(E)")}
                </span>
                <span className="grow space-y-1">
                  <span className="flex column">
                    <span>朝</span>
                    <span>
                      {menus.morning?.map((recipe) => (
                        <span key={recipe.id}>{recipe.title}</span>
                      ))}
                    </span>
                  </span>
                  <span className="flex column">
                    <span>昼</span>
                    <span>
                      {menus.lunch?.map((recipe) => (
                        <span key={recipe.id}>{recipe.title}</span>
                      ))}
                    </span>
                  </span>
                  <span className="flex column">
                    <span>夜</span>
                    <span>
                      {menus.dinner?.map((recipe) => (
                        <span key={recipe.id}>{recipe.title}</span>
                      ))}
                    </span>
                  </span>
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </BaseLayout>
  );
}
