"use client";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  query,
  getDocs,
} from "firebase/firestore";

const sColors = {
  background: "#121212", //dark gray
  primary: "#1DB954", //green
  textPrimary: "#FFFFFF", //white
  textSecondary: "#B3B3B3", //light fray
  cardBackground: "#181818", //dark gray
};

const InventoryItem = ({
  name,
  quantity,
  description,
  selectedExp,
  onRemove,
  onIncrease,
  onDelete,
  onEdit,
}) => (
  <Paper
    key={name}
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: sColors.cardBackground,
      padding: "16px",
      borderRadius: "8px",
      boxShadow: "0 2px 4px rgba(0,0,0,0.5)",
      marginBottom: "16px",
    }}
  >
    <Stack spacing={1}>
      <Typography variant="h6" style={{ color: sColors.textPrimary }}>
        {name.charAt(0).toUpperCase() + name.slice(1)}
      </Typography>
      <Typography variant="body2" style={{ color: sColors.textSecondary }}>
        {description}
      </Typography>
      <Typography variant="body2" style={{ color: sColors.textSecondary }}>
        Expiry: {selectedExp}
      </Typography>
    </Stack>
    <Stack direction="row" alignItems="center" spacing={1}>
      <IconButton
        style={{ color: sColors.primary }}
        onClick={() => onRemove(name)}
      >
        -
      </IconButton>
      <Typography variant="h6" style={{ color: sColors.textPrimary }}>
        {quantity}
      </Typography>
      <IconButton
        style={{ color: sColors.primary }}
        onClick={() => onIncrease(name)}
      >
        +
      </IconButton>
      <IconButton
        style={{ color: sColors.primary }}
        onClick={() => onDelete(name)}
      >
        <img
          src="/garbage.svg"
          alt="Delete"
          style={{ width: "24px", height: "24px" }}
        />
      </IconButton>
      <IconButton
        style={{ color: sColors.primary }}
        onClick={() => onEdit(name, description, quantity, selectedExp)}
      >
        <img
          src="../edit.svg"
          alt="Edit"
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
  const [editOpen, setEditOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [itemDescription, setItemDescription] = useState("");
  const [quantity, setQuantity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedExp, setSelectedExp] = useState(dayjs());
  const [currentItem, setCurrentItem] = useState(null);
  const [sortOption, setSortOption] = useState("name");

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
      const { quantity, description, selectedExp } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, {
          quantity: quantity - 1,
          description,
          selectedExp,
        });
      }
    }

    await updateInventory();
  };

  const addItem = async (item, description, quantity, selectedExp) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await setDoc(docRef, {
        quantity: Number(quantity),
        description,
        selectedExp: selectedExp.format("MM/DD/YYYY"),
      });
    } else {
      await setDoc(docRef, {
        quantity: Number(quantity),
        description,
        selectedExp: selectedExp.format("MM/DD/YYYY"),
      });
    }
    await updateInventory();
  };

  const increaseItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity, description, selectedExp } = docSnap.data();
      await setDoc(docRef, {
        quantity: quantity + 1,
        description,
        selectedExp,
      });
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

  const handleEditItem = (name, description, quantity, selectedExp) => {
    setCurrentItem({ name, description, quantity, selectedExp });
    setItemName(name);
    setItemDescription(description);
    setQuantity(quantity);
    setSelectedExp(dayjs(selectedExp));
    setEditOpen(true);
  };

  const handleUpdateItem = async () => {
    const { name } = currentItem;
    await setDoc(doc(collection(firestore, "inventory"), name), {
      quantity: Number(quantity),
      description: itemDescription,
      selectedExp: selectedExp.format("MM/DD/YYYY"),
    });
    await updateInventory();
    setEditOpen(false);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

const sortInventory = (items) => {
  switch (sortOption) {
    case "name":
      return items.sort((a, b) => a.name.localeCompare(b.name));
    case "quantity":
      return items.sort((a, b) => b.quantity - a.quantity);
    case "expiry":
      return items.sort((a, b) =>
        dayjs(a.selectedExp).isAfter(dayjs(b.selectedExp)) ? 1 : -1
      );
    case "description": // New case for sorting by description
      return items.sort((a, b) => a.description.localeCompare(b.description));
    default:
      return items;
  }
};


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
      <Container>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search Items"
          InputProps={{
            sx: {
              margin: "10px",
              backgroundColor: sColors.textPrimary,
              color: sColors.background,
            },
          }}
          InputLabelProps={{
            style: { color: sColors.textSecondary },
          }}
        />
        <Box display="flex" alignItems="center">
          <FormControl
            fullWidth
            margin="normal"
            sx={{ flexGrow: 1, marginRight: 1 }}
          >
            <InputLabel sx={{ color: sColors.textSecondary }}>
              Sort By
            </InputLabel>
            <Select
              value={sortOption}
              onChange={handleSortChange}
              sx={{ color: sColors.textPrimary }}
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="quantity">Quantity</MenuItem>
              <MenuItem value="expiry">Expiration</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={handleOpen}
            sx={{
              backgroundColor: sColors.primary,
              color: sColors.textPrimary,
              padding: "px 15px",
            }}
          >
            Add Item
          </Button>
        </Box>

        {sortInventory(
          inventory.filter(
            (item) =>
              item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              item.description.toLowerCase().includes(searchQuery.toLowerCase())
          )
        ).map((item) => (
          <InventoryItem
            key={item.name}
            {...item}
            onRemove={removeItem}
            onIncrease={increaseItem}
            onDelete={deleteItem}
            onEdit={handleEditItem}
          />
        ))}

        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={2}
          marginTop={2}
        ></Stack>

        <Modal open={open} onClose={handleClose}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            width={isSmallScreen ? "90%" : "400px"}
            bgcolor={sColors.cardBackground}
            boxShadow={24}
            p={4}
            borderRadius="8px"
          >
            <Typography
              variant="h6"
              component="h2"
              style={{ color: sColors.textPrimary }}
            >
              Add New Item
            </Typography>
            <Stack spacing={2} marginTop={2}>
              <TextField
                label="Item Name"
                variant="outlined"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                fullWidth
                InputProps={{
                  sx: {
                    backgroundColor: sColors.cardBackground,
                    color: sColors.textPrimary,
                  },
                }}
                InputLabelProps={{
                  style: { color: sColors.textSecondary },
                }}
              />
              <TextField
                label="Description"
                variant="outlined"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                fullWidth
                InputProps={{
                  sx: {
                    backgroundColor: sColors.cardBackground,
                    color: sColors.textPrimary,
                  },
                }}
                InputLabelProps={{
                  style: { color: sColors.textSecondary },
                }}
              />
              <TextField
                label="Quantity"
                variant="outlined"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                type="number"
                fullWidth
                InputProps={{
                  sx: {
                    backgroundColor: sColors.cardBackground,
                    color: sColors.textPrimary,
                  },
                }}
                InputLabelProps={{
                  style: { color: sColors.textSecondary },
                }}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Select Date"
                  value={selectedExp}
                  onChange={(newValue) => {
                    setSelectedExp(newValue ? newValue : null);
                  }}
                  slots={{
                    textField: (params) => (
                      <TextField
                        {...params}
                        sx={{
                          "& .MuiInputBase-input": {
                            color: sColors.textPrimary, // Text color
                          },
                          "& .MuiFormLabel-root": {
                            color: sColors.textSecondary, // Label color
                          },
                          "& .MuiFormLabel-root.Mui-focused": {
                            color: sColors.primary, // Focused label color
                          },
                          "& .MuiInputAdornment-root .MuiSvgIcon-root": {
                            color: sColors.textSecondary, // Icon color
                          },
                        }}
                      />
                    ),
                  }}
                />
              </LocalizationProvider>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  onClick={handleClose}
                  style={{
                    backgroundColor: sColors.primary,
                    color: sColors.textPrimary,
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    addItem(itemName, itemDescription, quantity, selectedExp);
                    handleClose();
                  }}
                  style={{
                    backgroundColor: sColors.primary,
                    color: sColors.textPrimary,
                  }}
                >
                  Add
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Modal>

        <Modal open={editOpen} onClose={() => setEditOpen(false)}>
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            width={isSmallScreen ? "90%" : "400px"}
            bgcolor={sColors.cardBackground}
            boxShadow={24}
            p={4}
            borderRadius="8px"
          >
            <Typography
              variant="h6"
              component="h2"
              style={{ color: sColors.textPrimary }}
            >
              Edit Item
            </Typography>
            <Stack spacing={2} marginTop={2}>
              <TextField
                label="Item Name"
                variant="outlined"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                fullWidth
                InputProps={{
                  sx: {
                    backgroundColor: sColors.cardBackground,
                    color: sColors.textPrimary,
                  },
                }}
                InputLabelProps={{
                  style: { color: sColors.textSecondary },
                }}
              />
              <TextField
                label="Description"
                variant="outlined"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                fullWidth
                InputProps={{
                  sx: {
                    backgroundColor: sColors.cardBackground,
                    color: sColors.textPrimary,
                  },
                }}
                InputLabelProps={{
                  style: { color: sColors.textSecondary },
                }}
              />
              <TextField
                label="Quantity"
                variant="outlined"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                type="number"
                fullWidth
                InputProps={{
                  sx: {
                    backgroundColor: sColors.cardBackground,
                    color: sColors.textPrimary,
                  },
                }}
                InputLabelProps={{
                  style: { color: sColors.textSecondary },
                }}
              />
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Expiry Date"
                  value={selectedExp}
                  onChange={(newValue) => setSelectedExp(newValue)}
                  inputFormat="MM/DD/YYYY"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      InputProps={{
                        sx: {
                          backgroundColor: sColors.cardBackground,
                          color: sColors.textPrimary,
                        },
                      }}
                      InputLabelProps={{
                        style: { color: sColors.textSecondary },
                      }}
                    />
                  )}
                />
              </LocalizationProvider>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  onClick={() => setEditOpen(false)}
                  style={{
                    backgroundColor: sColors.primary,
                    color: sColors.textPrimary,
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdateItem}
                  style={{
                    backgroundColor: sColors.primary,
                    color: sColors.textPrimary,
                  }}
                >
                  Update
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Modal>
      </Container>
    </Box>
  );
}
