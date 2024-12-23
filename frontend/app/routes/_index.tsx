import type { MetaFunction } from "@remix-run/node";
import { Logo } from "~/components/Logo";

export const meta: MetaFunction = () => {
  return [
    { title: "ていねいに食べよう | 毎日の献立を作るサイト" },
    { name: "description", content: "" },
  ];
};

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      <Logo />
    </div>
  );
}
