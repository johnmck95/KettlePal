import { Box, Heading } from "@chakra-ui/react";
import theme from "../../Constants/theme";
import {
  hexToRgb,
  interpolateColours,
  rgbToCss,
} from "../../utils/Colours/interpolation";

export default function Countdwn({ remaining }: { remaining: number }) {
  const green = hexToRgb(theme.colors.green[700]);
  const greenLight = hexToRgb(theme.colors.green[300]);
  const yellow = hexToRgb(theme.colors.lion[700]);
  const yellowLight = hexToRgb(theme.colors.lion[300]);
  const red = hexToRgb(theme.colors.bole[700]);
  const redLight = hexToRgb(theme.colors.bole[300]);

  // The ring colours
  let colourPrimary: string;
  let colourSecondary: string;

  // 59–21s remaining: green ring
  if (remaining > 20) {
    colourPrimary = rgbToCss(green);
    colourSecondary = rgbToCss(greenLight);
    // 20-11s: fade ring from green to yellow
  } else if (remaining > 10) {
    const ratio = (20 - remaining) / 10; // 0 to 1
    colourPrimary = rgbToCss(interpolateColours(green, yellow, ratio));
    colourSecondary = rgbToCss(
      interpolateColours(greenLight, yellowLight, ratio)
    );
    // 10-0s: fade from yellow to red
  } else {
    const ratio = (10 - remaining) / 10; // 0 to 1
    colourPrimary = rgbToCss(interpolateColours(yellow, red, ratio));
    colourSecondary = rgbToCss(
      interpolateColours(yellowLight, redLight, ratio)
    );
  }

  return (
    <Box position="relative" width="200px" height="200px">
      {/* Background Circle */}
      <Box
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        borderRadius="50%"
        bg={colourSecondary}
      />

      {/* Inner "Donut" */}
      <Box
        position="absolute"
        top="10%"
        left="10%"
        width="80%"
        height="80%"
        zIndex={2}
        borderRadius="50%"
        bg="white"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Heading fontSize="7xl" fontWeight="bold">
          {remaining}
        </Heading>
      </Box>

      {/* Progress Circle */}
      <Box
        position="absolute"
        top="0"
        left="0"
        width="100%"
        height="100%"
        borderRadius="50%"
        sx={{
          background: `conic-gradient(${colourPrimary} ${
            (60 - (remaining % 60)) * 6
          }deg, transparent ${(60 - (remaining % 60)) * 6}deg)`,
        }}
      />
    </Box>
  );
}
