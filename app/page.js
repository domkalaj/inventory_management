"use client";
import dynamic from "next/dynamic";
import { Box, AppBar, Toolbar, Typography } from "@mui/material";

// Dynamically import the ClientSideHome component
const ClientSideHome = dynamic(() => import("./ClientSideHome.js"), {
  ssr: false,
});

const sColors = {
  background: "#121212",
  primary: "#1DB954",
  textPrimary: "#FFFFFF",
  textSecondary: "#B3B3B3",
  cardBackground: "#181818",
};

export default function Home() {
  return (
    <Box
      width="100vw"
      height="100vh"
      bgcolor={sColors.background}
      overflow="auto"
    >
      <AppBar
        position="static"
        style={{ backgroundColor: sColors.cardBackground }}
      >
        <Toolbar>
          <Typography variant="h6" style={{ color: sColors.textPrimary }}>
            Inventory Management
          </Typography>
        </Toolbar>
      </AppBar>
      <ClientSideHome />
    </Box>
  );
}
