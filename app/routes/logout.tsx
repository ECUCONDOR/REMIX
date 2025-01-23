import { redirect } from '@remix-run/node';
import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { signOut } from '~/utils/auth.server';
import { firebaseAuth } from '~/lib/firebase/client';

export const action: ActionFunction = async ({ request }) => {
  try {
    await firebaseAuth.signOut();
    return signOut(request);
  } catch (error) {
    console.error("Error during logout:", error);
    return signOut(request);
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  try {
    await firebaseAuth.signOut();
    return signOut(request);
  } catch (error) {
    console.error("Error during logout:", error);
    return signOut(request);
  }
};
