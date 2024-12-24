import type { FC, PropsWithChildren } from "react";

type Props = PropsWithChildren;
export const Title: FC<Props> = ({ children }) => {
  return (
    <div className="text-center pt-16 pb-6">
      <h1 className="text-xl font-bold">{children}</h1>
    </div>
  );
};
