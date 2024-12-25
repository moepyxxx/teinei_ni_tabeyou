import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { BaseLayout } from "~/components/BaseLayout";

export const meta: MetaFunction = () => {
  return [
    { title: "ていねいに食べよう | 毎日の献立を作るサイト" },
    { name: "description", content: "" },
  ];
};

export default function Index() {
  return (
    <BaseLayout title="トップ">
      <div className="text-center space-y-2">
        <p>さてなにをしようかな</p>
        <ul>
          <li>
            <Link className="underline" to="/menus">
              献立を立てようかな〜
            </Link>
          </li>
        </ul>
      </div>
    </BaseLayout>
  );
}
