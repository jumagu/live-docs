"use server";

import { revalidatePath } from "next/cache";

import { nanoid } from "nanoid";

import { liveblocks } from "../liveblocks";
import { parseStringify } from "../utils";

// Each document is a room
export const createDocument = async ({
  userId,
  email,
}: CreateDocumentParams) => {
  const roomId = nanoid();

  try {
    const metadata = {
      creatorId: userId,
      email,
      title: "Untitled",
    };

    const usersAccesses: RoomAccesses = {
      [email]: ["room:write"],
    };

    // Creates a new room with the given metadata and users accesses
    const room = await liveblocks.createRoom(roomId, {
      metadata,
      usersAccesses,
      defaultAccesses: [],
    });

    // Revalidates the path, so the new document appears in the list
    revalidatePath("/");

    // Server actions returns always should be stringified
    return parseStringify(room);
  } catch (error) {
    console.log(`Error happened while creating a room: ${error}`);
  }
};
