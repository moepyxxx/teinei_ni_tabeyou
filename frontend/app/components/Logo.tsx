import { Link } from "@remix-run/react";
import type { FC } from "react";

export const Logo: FC = () => {
  return (
    <div className="fixed top-4 left-4">
      <Link to="/">ていねいに食べよう</Link>
    </div>
  );
};
