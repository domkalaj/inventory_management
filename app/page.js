"use client";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import {
  Box,
  Modal,
  Stack,
  Typography,
  TextField,
  Button,
  useTheme,
  useMediaQuery,
  Paper,
  IconButton,
  AppBar,
  Toolbar,
  Container,
} from "@mui/material";
// import {
//   Add as AddIcon,
//   Remove as RemoveIcon,
//   Delete as DeleteIcon,
// } from "@mui/icons-material";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  query,
  getDocs,
} from "firebase/firestore";

// Spotify Color Palette
const spotifyColors = {
  background: "#121212",
  primary: "#1DB954",
  textPrimary: "#FFFFFF",
  textSecondary: "#B3B3B3",
  cardBackground: "#181818",
};

const InventoryItem = ({
  name,
  quantity,
  description,
  onRemove,
  onIncrease,
  onDelete,
}) => (
  <Paper
    key={name}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: spotifyColors.cardBackground,
      padding: "16px",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
      marginBottom: "16px",
    }}
  >
    <Stack spacing={1}>
      <Typography variant="h6" style={{ color: spotifyColors.textPrimary }}>
        {name.charAt(0).toUpperCase() + name.slice(1)}
      </Typography>
      <Typography
        variant="body2"
        style={{ color: spotifyColors.textSecondary }}
      >
        {description}
      </Typography>
    </Stack>
    <Stack direction="row" alignItems="center" spacing={1}>
      <IconButton
        style={{ color: spotifyColors.primary }}
        onClick={() => onRemove(name)}
      >
        {" "}
        -
      </IconButton>
      <Typography variant="h6" style={{ color: spotifyColors.textPrimary }}>
        {quantity}
      </Typography>
      <IconButton
        style={{ color: spotifyColors.primary }}
        onClick={() => onIncrease(name)}
      >
        +
      </IconButton>
      <IconButton
        style={{ color: spotifyColors.primary }}
        onClick={() => onDelete(name)}
      >
        <img
          src="/garbage.svg"
          alt="Delete"
          style={{ width: "24px", height: "24px" }}
        />
      </IconButton>
    </Stack>
  </Paper>
);

export default function Home() {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [quantity, setQuantity] = useState("");

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity, description } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1, description });
      }
    }

    await updateInventory();
  };

  const addItem = async (item, description, quantity) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await setDoc(docRef, { quantity: Number(quantity), description });
    } else {
      await setDoc(docRef, { quantity: Number(quantity), description });
    }
    await updateInventory();
  };

  const increaseItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity, description } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1, description });
    }
    await updateInventory();
  };

  const deleteItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await deleteDoc(docRef);
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box width="100vw" height="100vh" bgcolor={spotifyColors.background}>
      <AppBar
        position="static"
        style={{ backgroundColor: spotifyColors.cardBackground }}
      >
        <Toolbar>
          <Typography variant="h6" style={{ color: spotifyColors.textPrimary }}>
            Inventory Management
          </Typography>
        </Toolbar>
      </AppBar>
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          mt={5}
          gap={2}
        >
          <Button
            variant="contained"
            style={{
              backgroundColor: spotifyColors.primary,
              color: spotifyColors.textPrimary,
            }}
            onClick={handleOpen}
          >
            Add New Item
          </Button>

          <Modal open={open} onClose={handleClose}>
            <Box
              position="absolute"
              top="50%"
              left="50%"
              width={isSmallScreen ? "80%" : 400}
              boxShadow={24}
              p={4}
              display="flex"
              flexDirection="column"
              gap={3}
              sx={{ transform: "translate(-50%, -50%)" }}
              bgcolor="background.paper"
              borderRadius={1}
              style={{ backgroundColor: spotifyColors.cardBackground }}
            >
              <Typography
                variant="h6"
                style={{ color: spotifyColors.textPrimary }}
              >
                Add Item
              </Typography>
              <Stack direction="column" spacing={2}>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  aria-label="Item Name"
                  label="Item Name"
                  InputLabelProps={{
                    style: { color: spotifyColors.textSecondary },
                  }}
                  InputProps={{ style: { color: spotifyColors.textPrimary } }}
                />
                <TextField
                  variant="outlined"
                  fullWidth
                  value={itemDescription}
                  onChange={(e) => setItemDescription(e.target.value)}
                  aria-label="Item Description"
                  label="Item Description"
                  InputLabelProps={{
                    style: { color: spotifyColors.textSecondary },
                  }}
                  InputProps={{ style: { color: spotifyColors.textPrimary } }}
                />
                <TextField
                  variant="outlined"
                  fullWidth
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  aria-label="Item Quantity"
                  label="Item Quantity"
                  InputLabelProps={{
                    style: { color: spotifyColors.textSecondary },
                  }}
                  InputProps={{ style: { color: spotifyColors.textPrimary } }}
                />
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: spotifyColors.primary,
                    color: spotifyColors.textPrimary,
                  }}
                  onClick={() => {
                    addItem(itemName, itemDescription, quantity);
                    setItemName("");
                    setItemDescription("");
                    setQuantity("");
                    handleClose();
                  }}
                  aria-label="Add Item"
                >
                  Add Item
                </Button>
              </Stack>
            </Box>
          </Modal>

          <Box
            width={isSmallScreen ? "90%" : "800px"}
            borderRadius={1}
            boxShadow={3}
            bgcolor={spotifyColors.cardBackground}
            padding={3}
            mt={3}
          >
            <Typography
              variant="h5"
              style={{ color: spotifyColors.textPrimary }}
            >
              Inventory Items
            </Typography>
            <Stack width="100%" spacing={2} overflow="auto" padding={2}>
              {inventory.map(({ name, quantity, description }) => (
                <InventoryItem
                  key={name}
                  name={name}
                  quantity={quantity}
                  description={description}
                  onRemove={removeItem}
                  onDelete={deleteItem}
                  onIncrease={increaseItem}
                />
              ))}
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
