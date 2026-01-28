import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

type SkeletonStyleProps = {
  width: number | string;
  height: number | string;
  $radius: number | string;
};

export const SkeletonContainer = styled.div<SkeletonStyleProps>`
  width: ${({ width }) => (typeof width === "number" ? `${width}px` : width)};
  height: ${({ height }) =>
    typeof height === "number" ? `${height}px` : height};
  border-radius: ${({ $radius }) =>
    typeof $radius === "number" ? `${$radius}px` : $radius};

  /* Base + brilho seguindo seu theme */
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.backgroundInput} 0%,
    ${({ theme }) => theme.active} 50%,
    ${({ theme }) => theme.backgroundInput} 100%
  );

  background-size: 200% 100%;
  animation: ${shimmer} 1.15s ease-in-out infinite;

  display: inline-block;
`;
