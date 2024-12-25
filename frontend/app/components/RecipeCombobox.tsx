import { useState, type FC } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "./ui/button";

const recipes = [
  {
    value: 1,
    label: "たまごかけごはん",
  },
  {
    value: 2,
    label: "ほげふがぴよ",
  },
  {
    value: 3,
    label: "ピーピー",
  },
];

type Props = {
  current: number | null;
  onChange: (id: number | null) => void;
};

export const RecipeCombobox: FC<Props> = ({ current, onChange }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <Popover open={searchOpen} onOpenChange={setSearchOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          // biome-ignore lint: suspicious/noArrayIndexKey
          role="combobox"
          aria-expanded={searchOpen ? "true" : "false"}
          className="w-[200px] justify-between">
          {current
            ? recipes.find((framework) => framework.value === current)?.label
            : "レシピを検索..."}
          <i className="fa-solid fa-chevron-down opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="キーワード..." className="h-9" />
          <CommandList>
            <CommandEmpty>レシピがありません</CommandEmpty>
            <CommandGroup>
              {recipes.map((framework) => (
                <CommandItem
                  key={framework.value}
                  value={framework.value.toString()}
                  onSelect={(currentValue) => {
                    onChange(
                      Number(currentValue) === current
                        ? null
                        : Number(currentValue)
                    );
                    setSearchOpen(false);
                  }}>
                  {framework.label}
                  <i
                    className={`fa-solid fa-check ${
                      current === framework.value ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
