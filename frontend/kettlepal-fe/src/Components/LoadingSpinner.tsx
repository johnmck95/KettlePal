import React, { useState, useEffect } from "react";
import { Spinner, VStack, Text } from "@chakra-ui/react";
import theme from "../Constants/theme";

interface LoadingSpinnerProps {
  size?: string | number;
  disableMessage?: boolean;
}

const LoadingSpinner = ({
  size = 24,
  disableMessage = false,
}: LoadingSpinnerProps) => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <VStack w="100%">
      <Spinner
        boxSize={size}
        thickness="0.4rem"
        speed="1s"
        emptyColor={theme.colors.grey[200]}
        color={theme.colors.feldgrau[700]}
      />
      {showMessage && !disableMessage && (
        <Text
          margin="1rem"
          maxWidth="600px"
          fontSize="1rem"
          textAlign="justify"
          background="rgba(249, 249, 249, 0.85)"
          p="1rem"
          borderRadius="1rem"
        >
          KettlePal's backend service automatically spins down after a period of
          inactivity. This is because Kettlepal is built entirely on free
          serivces. You will need to restart the application in 30-90 seconds.
        </Text>
      )}
    </VStack>
  );
};

export default LoadingSpinner;
