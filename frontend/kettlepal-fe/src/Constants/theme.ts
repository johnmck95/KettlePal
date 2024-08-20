import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    transparent: "transparent",
    black: "#000",
    white: "#fff",
    error: "#E53E3E",
    olive: {
      100: "#5A725C",
      200: "#516753",
      300: "#485B4A",
      400: "#3F5041",
      500: "#364538",
      600: "#2D392F",
      700: "#212922",
      800: "#1B221C",
      900: "#121713",
    },
    green: {
      100: "#51906A",
      200: "#498360",
      300: "#427657",
      400: "#3B684D",
      500: "#335B43",
      700: "#294936",
      800: "#254130",
      900: "#1E3427",
    },
    feldgrau: {
      100: "#68A192",
      200: "#5E9788",
      300: "#568A7C",
      400: "#4F7D71",
      500: "#477166",
      700: "#3E6259",
      800: "#375850",
      900: "#2F4B44",
    },
    bole: {
      100: "#B3716B",
      200: "#AC635D",
      300: "#A25853",
      400: "#94514C",
      500: "#874945",
      700: "#79413E",
      800: "#6C3A37",
      900: "#5F3230",
    },
    lion: {
      100: "#E3CEB5",
      200: "#DDC4A6",
      300: "#D8BA97",
      400: "#D3B088",
      500: "#CDA679",
      700: "#C89C6A",
      800: "#C2925B",
      900: "#BD884C",
    },
  },
  components: {
    Editable: {
      padding: "0rem",
      baseStyle: {
        input: {
          _focus: {
            boxShadow: "none",
          },
        },
      },
    },
  },
});

export default theme;
