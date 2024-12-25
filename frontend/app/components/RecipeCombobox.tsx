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
import type { Recipe } from "~/routes/menus.$date";

const recipes: Recipe[] = [
  {
    id: 3,
    title: "Recipe A",
    source_url: null,
  },
  {
    id: 6,
    title: "たまご焼き edit!",
    source_url: null,
  },
  {
    id: 7,
    title: "サンドイッチ",
    source_url: null,
  },
  {
    id: 8,
    title: "お好み焼き",
    source_url: null,
  },
  {
    id: 9,
    title: "サラダ",
    source_url: null,
  },
  {
    id: 10,
    title: "冷奴",
    source_url: null,
  },
];

type Props = {
  current: Recipe | null;
  alreadySelectedIDs: number[];
  onChange: (recipe: Recipe | null) => void;
};

export const RecipeCombobox: FC<Props> = ({
  current,
  alreadySelectedIDs,
  onChange,
}) => {
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
            ? recipes.find((recipe) => recipe.id === current.id)?.title
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
              {recipes.map((recipe) => (
                <CommandItem
                  disabled={alreadySelectedIDs.includes(recipe.id)}
                  key={recipe.id}
                  value={recipe.id.toString()}
                  onSelect={(currentValue) => {
                    const recipe = recipes.find(
                      (recipe) => recipe.id === Number(currentValue)
                    );
                    onChange(recipe ?? null);
                    setSearchOpen(false);
                  }}>
                  {recipe.title}
                  <i
                    className={`fa-solid fa-check ${
                      current?.id === recipe.id ? "opacity-100" : "opacity-0"
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
