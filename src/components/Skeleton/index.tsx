import React from "react";
import { SkeletonContainer } from "./styles";

export type SkeletonBaseProps = {
  width?: number | string;
  height?: number | string;
  borderRadius?: number | string;
  className?: string;
  style?: React.CSSProperties;
};

export function SkeletonBase({
  width = "100%",
  height = 16,
  borderRadius = 8,
  className,
  style,
}: SkeletonBaseProps) {
  return (
    <SkeletonContainer
      width={width}
      height={height}
      $radius={borderRadius}
      className={className}
      style={style}
      aria-hidden="true"
    />
  );
}
