"use client";

import Image from "next/image";

import { useEffect, useRef, useState } from "react";

import { ClientSideSuspense, RoomProvider } from "@liveblocks/react/suspense";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

import Loader from "./Loader";
import { Input } from "./ui/input";
import Header from "@/components/Header";
import { Editor } from "@/components/editor/Editor";
import ActiveCollaborators from "./ActiveCollaborators";
import { updateDocument } from "@/lib/actions/room.actions";

const CollaborativeRoom = ({
  roomId,
  roomMetadata,
}: CollaborativeRoomProps) => {
  const currentUserType = "editor";

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [documentTitle, setDocumentTitle] = useState(roomMetadata.title);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const startUpdateDocument = async () => {
    setLoading(true);

    try {
      if (documentTitle !== roomMetadata.title) {
        const updatedDocument = await updateDocument(roomId, documentTitle);

        if (updatedDocument) {
          setEditing(false);
        }
      }
    } catch (error) {
      console.log(error);
    }

    setLoading(false);
  };

  const updateTitleHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      startUpdateDocument();
    }
  };

  const handleClickOutside = () => {
    setEditing(false);
    startUpdateDocument();
  };

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editing]);

  return (
    <RoomProvider id={roomId}>
      <ClientSideSuspense fallback={<Loader />}>
        <div className="collaborative-room">
          <Header>
            <div
              ref={containerRef}
              className="flex w-fit items-center justify-center gap-2"
            >
              {editing && !loading ? (
                <Input
                  ref={inputRef}
                  type="text"
                  value={documentTitle}
                  placeholder="Enter title"
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  onKeyDown={updateTitleHandler}
                  onBlur={handleClickOutside}
                  disabled={!editing}
                  className="document-title-input"
                />
              ) : (
                <p className="document-title">{documentTitle}</p>
              )}

              {currentUserType === "editor" && !editing && !loading && (
                <Image
                  src="/assets/icons/edit.svg"
                  width={24}
                  height={24}
                  alt="Edit"
                  onClick={() => setEditing(true)}
                  className="cursor-pointer"
                />
              )}

              {currentUserType !== "editor" && !editing && (
                <p className="view-only-tag">View only</p>
              )}

              {loading && <p className="text-sm text-gray-400">Saving...</p>}
            </div>

            <div className="flex w-full flex-1 justify-end gap-2 sm:gap-3">
              <ActiveCollaborators />
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </Header>
          <Editor />
        </div>
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default CollaborativeRoom;
