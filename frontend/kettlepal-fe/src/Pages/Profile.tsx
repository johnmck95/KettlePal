import { Grid, GridItem, useBreakpointValue } from "@chakra-ui/react";
import React from "react";
import UserStats from "../Components/Profile/UserStats";
import AtAGlance from "../Components/Profile/AtAGlance";
import YourProgression from "../Components/Profile/YourProgression";

export default function Profile() {
  const isLargeScreen = useBreakpointValue({ base: false, lg: true });
  return (
    <Grid
      templateRows={isLargeScreen ? "repeat(2, auto)" : "repeat(3, auto)"}
      templateColumns={isLargeScreen ? "1fr minmax(300px, auto)" : "1fr"}
      gap={4}
      w="100%"
      maxW="1440px"
      padding={["0.25rem", "1rem"]}
      justifySelf="center"
    >
      <GridItem rowSpan={1} colSpan={1} order={1}>
        <AtAGlance />
      </GridItem>

      <GridItem
        rowSpan={isLargeScreen ? 2 : 1}
        colSpan={1}
        order={isLargeScreen ? 2 : 3}
      >
        <UserStats />
      </GridItem>

      <GridItem rowSpan={1} colSpan={1} order={isLargeScreen ? 3 : 2}>
        <YourProgression />
      </GridItem>
    </Grid>
  );
}
