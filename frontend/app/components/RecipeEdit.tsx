import type { FC, MouseEvent, ReactNode } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import type { Recipe } from "./RecipeEditDrawer";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as yup from "yup";
import { useToast } from "~/hooks/use-toast";

// TODO: nullは空文字にする
const schema = yup.object().shape({
  title: yup.string().max(50, "Too Long!").required("Required"),
  sourceURL: yup.string().url().max(100, "Too Long!").nullable(),
  sourceMemo: yup.string().max(100, "Too Long!").nullable(),
  memo: yup.string().max(100, "Too Long!").nullable(),
  materials: yup.array().of(
    yup.object().shape({
      item: yup.string().max(50, "Too Long!").required("Required"),
      amount: yup.string().max(50, "Too Long!").nullable(),
    })
  ),
});

type EditRecipeSchemaType = yup.InferType<typeof schema>;

type Props = {
  initialRecipe?: Recipe;
  renderAction: (
    onSubmit: (e: MouseEvent<HTMLButtonElement, MouseEvent>) => void
  ) => ReactNode;
  onSubmit: (recipe: EditRecipeSchemaType) => void;
};

const InitialRecipe: Recipe = {
  title: "",
  source_memo: null,
  source_url: null,
  memo: null,
  materials: [],
};

export const RecipeEdit: FC<Props> = ({
  initialRecipe = InitialRecipe,
  renderAction,
  onSubmit,
}) => {
  const { toast } = useToast();

  return (
    <Formik<EditRecipeSchemaType>
      initialValues={{
        ...initialRecipe,
        sourceURL: initialRecipe.source_url,
        sourceMemo: initialRecipe.source_memo,
      }}
      validationSchema={schema}
      validateOnMount
      onSubmit={(recipe) => {
        onSubmit(recipe);
      }}>
      {({ values, handleSubmit, isValid }) => (
        <Form>
          <>
            <div className="space-y-3">
              <Field name="title">
                {/* @ts-expect-error 型があたらないため */}
                {({ field }) => (
                  <div className="space-y-1">
                    <p>レシピ名</p>
                    <Input {...field} />
                    <p className="text-sm text-red-400">
                      <ErrorMessage name="title" />
                    </p>
                  </div>
                )}
              </Field>
              <Field name="sourceURL">
                {/* @ts-expect-error 型があたらないため */}
                {({ field }) => (
                  <div className="space-y-1">
                    <p>作り方URL</p>
                    <Input {...field} />
                    <p className="text-sm text-red-400">
                      <ErrorMessage name="sourceURL" />
                    </p>
                  </div>
                )}
              </Field>
              <Field name="sourceMemo">
                {/* @ts-expect-error 型があたらないため */}
                {({ field }) => (
                  <div className="space-y-1">
                    <p>その他作り方メモ</p>
                    <Textarea {...field} />
                    <p className="text-sm text-red-400">
                      <ErrorMessage name="sourceMemo" />
                    </p>
                  </div>
                )}
              </Field>
              <FieldArray
                name="materials"
                render={(arrayHelpers) => (
                  <div className="space-y-1">
                    <p>材料</p>
                    <div className="space-y-2">
                      {values.materials?.map((_, index) => (
                        // biome-ignore lint: suspicious/noArrayIndexKey
                        <div className="flex gap-2" key={`material_${index}`}>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => arrayHelpers.remove(index)}>
                            <i className="fa-regular fa-square-minus" />
                          </Button>
                          <Field name={`materials[${index}].item`}>
                            {/* @ts-expect-error 型があたらないため */}
                            {({ field }) => (
                              <div className="shrink">
                                <Input {...field} />
                              </div>
                            )}
                          </Field>
                          <Field name={`materials[${index}].amount`}>
                            {/* @ts-expect-error 型があたらないため */}
                            {({ field }) => (
                              <div className="shrink">
                                <Input {...field} />
                              </div>
                            )}
                          </Field>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        className="min-w-20"
                        onClick={() =>
                          arrayHelpers.push({
                            item: "",
                            amount: null,
                          })
                        }>
                        追加
                      </Button>
                    </div>
                  </div>
                )}
              />
              <Field name="memo">
                {/* @ts-expect-error 型があたらないため */}
                {({ field }) => (
                  <div className="space-y-1">
                    <p>その他メモ</p>
                    <Textarea {...field} />
                    <p className="text-sm text-red-400">
                      <ErrorMessage name="memo" />
                    </p>
                  </div>
                )}
              </Field>
            </div>
            {renderAction((e) => {
              if (!isValid) {
                toast({
                  description: "エラーを修正してください",
                });
                e.preventDefault();
                return;
              }
              handleSubmit();
            })}
          </>
        </Form>
      )}
    </Formik>
  );
};
