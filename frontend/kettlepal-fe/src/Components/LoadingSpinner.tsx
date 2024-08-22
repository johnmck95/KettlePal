import React, { useState, useEffect } from "react";
import { Spinner, VStack, Text } from "@chakra-ui/react";
import theme from "../Constants/theme";

const LoadingSpinner = ({ size }: { size: string | number }) => {
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <VStack w="100%" m="1rem">
      <Spinner
        boxSize={size}
        thickness="0.4rem"
        speed="1s"
        emptyColor={theme.colors.grey[200]}
        color={theme.colors.feldgrau[700]}
      />
      {showMessage && (
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
          inactivity. This is a cost saving measure. Please be patient while a
          brand new service is being spun up just for you! This may take a few
          minutes.
        </Text>
      )}
    </VStack>
  );
};

export default LoadingSpinner;
