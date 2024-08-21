import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    transparent: "transparent",
    black: "#000",
    white: "#fff",
    error: "#E53E3E",
    grey: {
      50: "#F7FAFC",
      100: "#EDF2F7",
      200: "#E2E8F0",
      300: "#CBD5E0",
      400: "#A0AEC0",
      500: "#718096",
      600: "#4A5568",
      700: "#2D3748",
      800: "#1A202C",
      900: "#171923",
    },
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
      25: "#EEF1EE",
      50: "#D4DDD5",
      100: "#51906A",
      200: "#4B8562",
      300: "#447959",
      400: "#3E6E51",
      500: "#386249",
      600: "#315740",
      700: "#2B4B38",
      800: "#24402F",
      900: "#1E3427",
    },
    feldgrau: {
      100: "#68A192",
      200: "#619688",
      300: "#5A8C7F",
      400: "#538175",
      500: "#4C766B",
      600: "#446B61",
      700: "#3D6158",
      800: "#36564E",
      900: "#2F4B44",
    },
    bole: {
      100: "#B3716B",
      200: "#A96964",
      300: "#9E615C",
      400: "#945955",
      500: "#89524E",
      600: "#7F4A46",
      700: "#74423F",
      800: "#6A3A37",
      900: "#5F3230",
    },
    lion: {
      100: "#E3CEB5",
      200: "#DEC5A8",
      300: "#DABD9B",
      400: "#D5B48E",
      500: "#D0AB81",
      600: "#CBA273",
      700: "#C79A66",
      800: "#C29159",
      900: "#BD884C",
    },
  },
  components: {
    Button: {
      variants: {
        primary: {
          bg: "green.400",
          color: "white",
          _hover: {
            bg: "green.600",
          },
          _active: {
            bg: "green.800",
          },
        },
        secondary: {
          bg: "white",
          color: "green.700",
          border: "2px solid #3E6E51",
          _hover: {
            bg: "green.25",
          },
          _active: {
            bg: "green.50",
          },
        },
        warn: {
          bg: "error",
          color: "white",
          _hover: {
            bg: "red.600",
          },
          _active: {
            bg: "red.700",
          },
        },
        closeX: {
          color: "black",
          _hover: {
            bg: "rgba(250,249,246,1)",
          },
          _active: {
            filter: "brightness(0.98)",
          },
        },
        start: {
          bg: "white",
          color: "black",
          border: "1px solid #516753",
          _hover: {
            border: "2px solid #516753",
          },
          _active: {
            border: "2px solid #121713",
          },
        },
        stop: {
          bg: "white",
          color: "black",
          border: "1px solid #C79A66",
          _hover: {
            border: "2px solid #C79A66",
          },
          _active: {
            border: "2px solid #BD884C",
          },
        },
      },
    },
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
