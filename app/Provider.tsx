"use client";

import { useUser } from "@clerk/nextjs";

import {
  LiveblocksProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import type { ResolveUsersArgs } from "@liveblocks/node";
import type { ResolveMentionSuggestionsArgs } from "@liveblocks/client";

import Loader from "@/components/Loader";
import { getClerkUsers, getDocumentUsers } from "@/lib/actions/user.actions";

function Provider({ children }: { children: React.ReactNode }) {
  const { user: clerkUser } = useUser();

  const resolveUsers = async ({ userIds }: ResolveUsersArgs) => {
    const users = await getClerkUsers({ userIds });

    return users;
  };

  const resolveMentionSuggestions = async ({
    text,
    roomId,
  }: ResolveMentionSuggestionsArgs) => {
    const roomUsers = await getDocumentUsers({
      text,
      roomId,
      currentUser: clerkUser?.emailAddresses[0].emailAddress!,
    });

    return roomUsers;
  };

  return (
    <LiveblocksProvider
      authEndpoint="/api/liveblocks-auth"
      resolveUsers={resolveUsers}
      resolveMentionSuggestions={resolveMentionSuggestions}
    >
      <ClientSideSuspense fallback={<Loader />}>{children}</ClientSideSuspense>
    </LiveblocksProvider>
  );
}

export default Provider;
