"use client";

import Image from "next/image";

import {
  type Overrides,
  InboxNotification,
  LiveblocksUIConfig,
  InboxNotificationList,
  type InboxNotificationProps,
} from "@liveblocks/react-ui";
import {
  useInboxNotifications,
  useUnreadInboxNotificationsCount,
} from "@liveblocks/react/suspense";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Notifications = () => {
  const { inboxNotifications } = useInboxNotifications();
  const { count } = useUnreadInboxNotificationsCount();

  const unreadNotifications = inboxNotifications.filter(
    (notification) => !notification.readAt
  );

  const liveblocksUioverrides: Partial<Overrides> = {
    INBOX_NOTIFICATION_TEXT_MENTION: (user) => <>{user} mentioned you</>,
  };

  const notificationKinds: InboxNotificationProps["kinds"] = {
    thread: (props) => (
      <InboxNotification.Thread
        {...props}
        showActions={false}
        showRoomName={false}
      />
    ),
    textMention: (props) => (
      <InboxNotification.TextMention {...props} showRoomName={false} />
    ),
    $documentAccess: (props) => (
      <InboxNotification.Custom
        {...props}
        title={props.inboxNotification.activities[0].data.title}
        aside={
          <InboxNotification.Icon>
            <Image
              src={
                (props.inboxNotification.activities[0].data.avatar as string) ||
                ""
              }
              width={36}
              height={36}
              alt="avatar"
              className="rounded-full"
            />
          </InboxNotification.Icon>
        }
      >
        {props.children}
      </InboxNotification.Custom>
    ),
  };

  return (
    <Popover>
      <PopoverTrigger className="relative flex items-center justify-center size-10 rounded-lg">
        <Image
          src="/assets/icons/bell.svg"
          width={24}
          height={24}
          alt="inbox"
        />
        {count > 0 && (
          <div className="absolute right-2 top-2 z-20 size-2 rounded-full bg-blue-500" />
        )}
      </PopoverTrigger>
      <PopoverContent align="end" className="shad-popover">
        <LiveblocksUIConfig overrides={liveblocksUioverrides}>
          <InboxNotificationList>
            {unreadNotifications.length <= 0 && (
              <p className="py-2 text-center text-dark-500">
                No new notifications
              </p>
            )}
            {unreadNotifications.length > 0 &&
              unreadNotifications.map((notification) => (
                <InboxNotification
                  key={notification.id}
                  inboxNotification={notification}
                  className="bg-dark-200 text-white"
                  href={`/documents/${notification.roomId}`}
                  showActions={false}
                  kinds={notificationKinds}
                />
              ))}
          </InboxNotificationList>
        </LiveblocksUIConfig>
      </PopoverContent>
    </Popover>
  );
};

export default Notifications;
