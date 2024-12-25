import type { FC, PropsWithChildren } from "react";
import { Logo } from "./Logo";
import { Title } from "~/components/Title";
import { Button } from "./ui/button";
import { useNavigate } from "@remix-run/react";
import { useToast } from "~/hooks/use-toast";

type Props = PropsWithChildren & {
  title: string;
};

export const BaseLayout: FC<Props> = ({ children, title }) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/logout`, {
      method: "POST",
      headers: new Headers({
        "Content-Type": "application/json",
      }),
      credentials: "include",
    });
    if (!response.ok) {
      toast({
        description: "ログアウトに失敗しました・・・",
      });
      return;
    }
    toast({
      description: "ログアウトしました",
    });
    navigate("/signin");
  };
  return (
    <div className="min-h-dvh pb-10">
      <div className="fixed top-3 px-3 w-full flex justify-between items-center">
        <Logo />
        <Button variant="ghost" onClick={handleLogout}>
          ログアウト
          <i className="fa-solid fa-right-from-bracket" />
        </Button>
      </div>

      <Title>{title}</Title>
      <div className="px-4">{children}</div>
    </div>
  );
};
