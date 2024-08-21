import { Spinner } from "@chakra-ui/react";
import theme from "../Constants/theme";

const LoadingSpinner = () => {
  return (
    <Spinner
      boxSize={72}
      thickness="0.4rem"
      speed="1s"
      emptyColor={theme.colors.grey[200]}
      color={theme.colors.feldgrau[700]}
    />
  );
};

export default LoadingSpinner;
