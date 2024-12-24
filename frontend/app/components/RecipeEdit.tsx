import type { FC, ReactNode } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import type { Recipe } from "./RecipeEditDrawer";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as yup from "yup";
import { useToast } from "~/hooks/use-toast";

const schema = yup.object().shape({
  title: yup.string().max(50, "Too Long!").required("Required"),
  sourceURL: yup.string().max(100, "Too Long!").nullable(),
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
  recipeID: number;
  initialRecipe: Recipe;
  renderAction: (onSubmit: () => void) => ReactNode;
};

export const RecipeEdit: FC<Props> = ({
  recipeID,
  initialRecipe,
  renderAction,
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
      onSubmit={async ({ title, sourceMemo, sourceURL, materials }) => {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/recipes/${recipeID}`,
          {
            method: "PATCH",
            headers: new Headers({
              "Content-Type": "application/json",
            }),
            body: JSON.stringify({
              title,
              source_memo: sourceMemo,
              source_url: sourceURL,
              materials,
            }),
          }
        );
        if (!response.ok) {
          toast({
            description: "保存に失敗しました・・・",
          });
          return;
        }
      }}>
      {({ values, handleSubmit }) => (
        <Form>
          <>
            <div className="space-y-3">
              <Field name="title">
                {/* @ts-expect-error 型があたらないため */}
                {({ field }) => (
                  <div className="space-y-1">
                    <p>レシピ名</p>
                    <Input {...field} />
                    <ErrorMessage name="title" />
                  </div>
                )}
              </Field>
              <Field name="sourceURL">
                {/* @ts-expect-error 型があたらないため */}
                {({ field }) => (
                  <div className="space-y-1">
                    <p>作り方URL</p>
                    <Input {...field} />
                    <ErrorMessage name="sourceURL" />
                  </div>
                )}
              </Field>
              <Field name="sourceMemo">
                {/* @ts-expect-error 型があたらないため */}
                {({ field }) => (
                  <div className="space-y-1">
                    <p>その他作り方メモ</p>
                    <Textarea {...field} />
                    <ErrorMessage name="sourceMemo" />
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
                    <ErrorMessage name="memo" />
                  </div>
                )}
              </Field>
            </div>
            {renderAction(() => handleSubmit)}
          </>
        </Form>
      )}
    </Formik>
  );
};
