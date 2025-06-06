export type ColorShades = {
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
}

export const baseTheme = {
  space: [0, 2, 4, 8, 16, 32],
  fontSizes: [14, 16, 18, 24, 32],
  colors: {
    blue: {
      100: "#DAE3EB",
      200: "#B5C7D7",
      300: "#90ABC3",
      400: "#6B8FAF",
      500: "#46749B",
      600: "#215887",
      700: "#08457A",
    },
    green: {
      100: "#DAE6E5",
      200: "#B4CDCB",
      300: "#8FB4B2",
      400: "#6A9B98",
      500: "#44827E",
      600: "#1F6964",
      700: "#065853",
    },
    crimson: {
      100: "#EADBDD",
      200: "#D5B7BA",
      300: "#C09397",
      400: "#AC6E75",
      500: "#974A53",
      600: "#822630",
      700: "#740E19",
    },
    red: {
      100: "#F0E1DD",
      200: "#E2C2BC",
      300: "#D3A49A",
      400: "#C58579",
      500: "#B66757",
      600: "#A84835",
      700: "#9E341F",
    },
    yellow: {
      100: "#FAF6E3",
      200: "#F6EDC6",
      300: "#F1E4A9",
      400: "#ECDB8D",
      500: "#E8D270",
      600: "#E3C954",
      700: "#E0C341",
    },
    purple: {
      100: "#E5E0F1",
      200: "#CBC1E2",
      300: "#B1A2D4",
      400: "#9783C5",
      500: "#7C64B7",
      600: "#6245A9",
      700: "#51309F",
    },
    gray: {
      100: "#DDDEE0",
      200: "#BABDC2",
      300: "#989CA3",
      400: "#767B85",
      500: "#535A66",
      600: "#313947",
      700: "#1A2333",
    },
    clear: {
      100: "#F5F6F7",
      200: "#EBEDEE",
      300: "#E2E4E6",
      400: "#D8DBDD",
      500: "#CED2D5",
      600: "#C4C9CD",
      700: "#BEC3C7",
    },
    primary: {
      100: "#FFFFFF",
      200: "#000000",
    },
    gradient: {
      green: "linear-gradient(to bottom right, #075854, #4DE2C5);",
      blue: "linear-gradient(-70deg, #020344 0%, #28b8d5 100%)",
    },
  },
}

export const theme = {
  primary: {
    text: baseTheme.colors.primary[100],
    border: baseTheme.colors.clear[100],
    bg: baseTheme.colors.green[600],
    hoverText: baseTheme.colors.green[600],
    hoverBg: baseTheme.colors.primary[100],
    hoverBorder: baseTheme.colors.green[600],
    focusBorder: baseTheme.colors.clear[100],
    activeBg: baseTheme.colors.clear[100],
    disabledText: baseTheme.colors.gray[400],
    disabledBg: baseTheme.colors.clear[100],
    disabledBorder: baseTheme.colors.clear[100],
  },
  secondary: {
    text: baseTheme.colors.gray[700],
    border: baseTheme.colors.clear[100],
    bg: baseTheme.colors.clear[200],
    hoverText: baseTheme.colors.primary[200],
    hoverBg: baseTheme.colors.clear[300],
    hoverBorder: baseTheme.colors.clear[600],
    focusBorder: baseTheme.colors.clear[100],
    focusBg: baseTheme.colors.clear[100],
    activeBg: baseTheme.colors.primary[100],
    disabledText: baseTheme.colors.gray[400],
    disabledBg: baseTheme.colors.clear[100],
    disabledBorder: baseTheme.colors.clear[100],
  },
  reject: {
    bg: baseTheme.colors.clear[200],
    border: baseTheme.colors.clear[100],
    text: baseTheme.colors.red[600],
    hoverText: baseTheme.colors.red[600],
    hoverBg: baseTheme.colors.primary[100],
    hoverBorder: baseTheme.colors.red[600],
    focusBorder: baseTheme.colors.clear[100],
    activeBg: baseTheme.colors.clear[100],
    disabledText: baseTheme.colors.gray[400],
    disabledBg: baseTheme.colors.clear[100],
    disabledBorder: baseTheme.colors.clear[100],
  },
  tertiary: {
    text: baseTheme.colors.clear[100],
    border: baseTheme.colors.clear[100],
    bg: baseTheme.colors.gray[700],
    hoverText: baseTheme.colors.gray[700],
    hoverBg: baseTheme.colors.clear[100],
    hoverBorder: baseTheme.colors.clear[100],
    focusBorder: baseTheme.colors.clear[100],
    activeBg: baseTheme.colors.clear[100],
    disabledText: baseTheme.colors.gray[400],
    disabledBg: baseTheme.colors.clear[100],
    disabledBorder: baseTheme.colors.clear[100],
  },
  white: {
    text: baseTheme.colors.gray[500],
    border: baseTheme.colors.clear[100],
    bg: baseTheme.colors.gray[700],
    hoverText: baseTheme.colors.gray[700],
    hoverBg: baseTheme.colors.clear[100],
    hoverBorder: baseTheme.colors.clear[100],
    focusBorder: baseTheme.colors.clear[100],
    activeBg: baseTheme.colors.clear[100],
    disabledText: baseTheme.colors.gray[400],
    disabledBg: baseTheme.colors.clear[100],
    disabledBorder: baseTheme.colors.clear[100],
  },
  buttonSizes: {
    small: {
      fontSize: baseTheme.fontSizes[1],
      padding: `0.3rem 0.6rem`,
    },
    medium: {
      fontSize: baseTheme.fontSizes[2],
      padding: `0.5625rem 1.125rem`,
    },
    large: {
      fontSize: baseTheme.fontSizes[4],
      padding: `1rem 2.125rem`,
    },
  },
}
