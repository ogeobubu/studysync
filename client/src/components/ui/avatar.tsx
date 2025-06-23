import * as React from "react";

interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {}
interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}
interface AvatarFallbackProps extends React.HTMLAttributes<HTMLSpanElement> {}

const Avatar = React.forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className = "", ...props }, ref) => (
    <span
      ref={ref}
      className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className}`}
      {...props}
    />
  )
);
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef<HTMLImageElement, AvatarImageProps>(
  ({ className = "", ...props }, ref) => (
    <img
      ref={ref}
      className={`aspect-square h-full w-full ${className}`}
      {...props}
    />
  )
);
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef<HTMLSpanElement, AvatarFallbackProps>(
  ({ className = "", ...props }, ref) => (
    <span
      ref={ref}
      className={`flex h-full w-full items-center justify-center rounded-full bg-gray-200 ${className}`}
      {...props}
    />
  )
);
AvatarFallback.displayName = "AvatarFallback";

export { Avatar, AvatarImage, AvatarFallback };