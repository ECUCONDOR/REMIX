import { redirect } from '@remix-run/node';
import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { signOut } from '~/utils/auth.server';

export const action: ActionFunction = async ({ request }) => {
  return signOut(request);
};

export const loader: LoaderFunction = async ({ request }) => {
  return signOut(request);
};
