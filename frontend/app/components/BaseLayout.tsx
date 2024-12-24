import type { FC, PropsWithChildren } from "react";
import { Logo } from "./Logo";
import { Title } from "~/components/Title";

type Props = PropsWithChildren & {
  title: string;
};

export const BaseLayout: FC<Props> = ({ children, title }) => {
  return (
    <div className="min-h-dvh pb-10">
      <Logo />
      <Title>{title}</Title>
      <div className="px-4">{children}</div>
    </div>
  );
};
