import { Spinner } from "@chakra-ui/react";

const LoadingSpinner = () => {
  return (
    <Spinner
      thickness="2rem"
      speed="0.65s"
      emptyColor="green.700"
      color="feldgrau.700"
    />
  );
};

export default LoadingSpinner;
