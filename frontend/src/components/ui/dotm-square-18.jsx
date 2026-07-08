import { DotMatrixBase } from "@/lib/dotmatrix-core";

export function DotmSquare18({ className, ...props }) {
  return (
    <DotMatrixBase
      size={24}
      dotSize={2}
      pattern="diamond"
      speed={1.15}
      ariaLabel="Loading"
      className={className}
      {...props}
    />
  );
}

export default DotmSquare18;
