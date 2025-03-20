import { Loader2 } from "lucide-react";

function Spinner({
  size = 24,
  color = "black",
  strokeWidth = 2,
}: {
  size?: number;
  color?: string;
  strokeWidth?: number;
}) {
  return (
    <Loader2
      className="animate-spin"
      size={size}
      color={color}
      strokeWidth={strokeWidth}
    />
  );
}

export default Spinner;
