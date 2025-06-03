import { ReactNode } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";

export function UserCard({
  extra,
  disableName = false,
}: {
  extra?: ReactNode;
  disableName?: boolean;
}) {
  const user = undefined as any;

  const profilePhotoUrl = "";

  // useEffect(() => {
  //   if (user?.photoUrl) {
  //     getProfilePhotoUrl(user.photoUrl)
  //       .then((url) => setProfilePhotoUrl(url))
  //       .catch((error) => console.error(error));
  //   }
  // }, [user]);

  return (
    user && (
      <Link to={`https://t.me/${user.username}`}>
        <span className="inline-flex items-center gap-2">
          <Avatar>
            <AvatarImage src={profilePhotoUrl} />
            <AvatarFallback>{user.username}</AvatarFallback>
          </Avatar>
          {!disableName && (
            <span className="flex flex-col items-start">
              <span className="font-bold">{user.username}</span>
              {extra}
            </span>
          )}
        </span>
      </Link>
    )
  );
}
