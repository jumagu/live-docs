import { useState } from "react";

import Image from "next/image";

import UserTypeSelector from "./UserTypeSelector";
import { Button } from "./ui/button";

function Collaborator({
  user,
  email,
  roomId,
  creatorId,
  collaborator,
}: CollaboratorProps) {
  const [loading, setLoading] = useState(false);
  const [userType, setUserType] = useState(collaborator.userType || "viewer");

  const shareDocumentHandler = async (type: string) => {};

  const removeCollaboratorHandler = async (email: string) => {};

  return (
    <li className="py-3 flex items-center justify-between gap-2">
      <div className="flex gap-2">
        <Image
          src={collaborator.avatar}
          width={36}
          height={36}
          alt={collaborator.name}
          className="size-9 rounded-full"
        />
        <div>
          <p className="text-white text-sm font-semibold leading-4 line-clamp-1">
            {collaborator.name}
            <span className="text-10-regular pl-2 text-blue-100">
              {loading && "updating..."}
            </span>
          </p>
          <p className="text-sm font-light text-blue-100">
            {collaborator.email}
          </p>
        </div>
      </div>

      {creatorId === collaborator.id ? (
        <p className="text-sm text-blue-100">Owner</p>
      ) : (
        <div className="flex items-center">
          <UserTypeSelector
            userType={userType as UserType}
            setUserType={setUserType || "viewer"}
            onClickHandler={shareDocumentHandler}
          />
          <Button
            type="button"
            onClick={() => removeCollaboratorHandler(collaborator.email)}
          >
            Remove
          </Button>
        </div>
      )}
    </li>
  );
}

export default Collaborator;
