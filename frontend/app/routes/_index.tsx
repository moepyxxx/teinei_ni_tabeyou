import type { MetaFunction } from "@remix-run/node";
import { BaseLayout } from "~/components/BaseLayout";

export const meta: MetaFunction = () => {
  return [
    { title: "ていねいに食べよう | 毎日の献立を作るサイト" },
    { name: "description", content: "" },
  ];
};

export default function Index() {
  return <BaseLayout title="トップ">###</BaseLayout>;
}
