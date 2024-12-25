import { BaseLayout } from "~/components/BaseLayout";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as yup from "yup";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useToast } from "~/hooks/use-toast";
import { Link, useNavigate } from "@remix-run/react";

const schema = yup.object().shape({
  email: yup.string().email().max(50, "Too Long!").required("Required"),
  password: yup.string().max(50, "Too Long!").required("Required"),
});

type SignupFormType = yup.InferType<typeof schema>;

export default function Signin() {
  const { toast } = useToast();
  const navigate = useNavigate();

  return (
    <BaseLayout title="ログイン">
      <div className="w-10/12 mx-auto">
        <Formik<SignupFormType>
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={schema}
          validateOnMount
          onSubmit={async ({ email, password }) => {
            const response = await fetch(
              `${import.meta.env.VITE_API_URL}/login`,
              {
                method: "POST",
                headers: new Headers({
                  "Content-Type": "application/json",
                }),
                body: JSON.stringify({
                  email,
                  password,
                }),
                credentials: "include",
              }
            );
            if (!response.ok) {
              toast({
                description: "メールアドレスもしくはパスワードが違います",
              });
              return;
            }
            toast({
              description: "ログインに成功しました",
            });
            navigate("/");
          }}>
          {({ handleSubmit }) => (
            <Form onSubmit={handleSubmit}>
              <div className="space-y-3">
                <Field name="email">
                  {/* @ts-expect-error 型があたらないため */}
                  {({ field }) => (
                    <div className="space-y-1">
                      <p>メールアドレス</p>
                      <Input {...field} />
                      <p className="text-sm text-red-400">
                        <ErrorMessage name="email" />
                      </p>
                    </div>
                  )}
                </Field>
                <Field name="password">
                  {/* @ts-expect-error 型があたらないため */}
                  {({ field }) => (
                    <div className="space-y-1">
                      <p>パスワード</p>
                      <Input type="password" {...field} />
                      <p className="text-sm text-red-400">
                        <ErrorMessage name="password" />
                      </p>
                    </div>
                  )}
                </Field>
                <div className="text-center space-y-2">
                  <Button type="submit">ログイン</Button>
                  <p className="text-sm">
                    まだの場合は
                    <Link to="/signup" className="underline">
                      会員登録
                    </Link>
                    してください
                  </p>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </BaseLayout>
  );
}
