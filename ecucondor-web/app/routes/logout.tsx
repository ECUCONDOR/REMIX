import { json, redirect } from "@remix-run/node";
import { destroyUserSession } from "~/utils/auth.server";

export const action = async ({ request }: { request: Request }) => {
  return destroyUserSession(request, "/");
};

export const loader = async () => {
  return redirect("/");
};
