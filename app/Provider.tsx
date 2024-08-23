"use client";

import {
  LiveblocksProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import type { ResolveUsersArgs } from "@liveblocks/node";

import Loader from "@/components/Loader";
import { getClerkUsers } from "@/lib/actions/user.actions";

function Provider({ children }: { children: React.ReactNode }) {
  const resolveUserHandler = async ({ userIds }: ResolveUsersArgs) => {
    const users = await getClerkUsers({ userIds });

    return users;
  };

  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks-auth"
      resolveUsers={resolveUserHandler}
    >
      <ClientSideSuspense fallback={<Loader />}>{children}</ClientSideSuspense>
    </LiveblocksProvider>
  );
}

export default Provider;
