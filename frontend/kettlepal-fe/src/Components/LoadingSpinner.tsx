import { Spinner } from "@chakra-ui/react";
import theme from "../Constants/theme";

const LoadingSpinner = ({ size }: { size: number }) => {
  return (
    <Spinner
      boxSize={size}
      thickness="0.4rem"
      speed="1s"
      emptyColor={theme.colors.grey[200]}
      color={theme.colors.feldgrau[700]}
    />
  );
};

export default LoadingSpinner;
