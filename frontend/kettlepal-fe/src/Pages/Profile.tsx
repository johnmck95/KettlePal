import { Grid, GridItem, useBreakpointValue } from "@chakra-ui/react";
import React from "react";
import UserStats from "../Components/Profile/UserStats";
import AtAGlance from "../Components/Profile/AtAGlance";
import YourProgression from "../Components/Profile/YourProgression";

export default function Profile() {
  const isLargeScreen = useBreakpointValue({ base: false, lg: true });
  return (
    <Grid
      templateRows={isLargeScreen ? "repeat(2, 1fr)" : "repeat(3, auto)"}
      templateColumns={isLargeScreen ? "1fr minmax(350px, auto)" : "1fr"}
      gap={4}
      h="100%"
      w="100%"
      padding="1rem"
    >
      <GridItem rowSpan={1} colSpan={1}>
        <AtAGlance />
      </GridItem>

      <GridItem rowSpan={isLargeScreen ? 2 : 1} colSpan={1}>
        <UserStats />
      </GridItem>

      <GridItem rowSpan={1} colSpan={1}>
        <YourProgression />
      </GridItem>
    </Grid>
  );
}
