'use client'
import { useState, useEffect } from 'react'
import { firestore } from '@/firebase'
import { Box, Button, Modal, Stack, TextField, Typography } from '@mui/material';
import { collection, deleteDoc, doc, getDoc, getDocs, query, setDoc } from 'firebase/firestore';

export default function Home() {

  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')

  const updateInventory = async() => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }

  const add = async(item) => {
    const docRef = doc(collection(firestore, 'inventory'), item.toLowerCase())
    const docSnapshot = await getDoc(docRef)
    if (docSnapshot.exists()){
      const {count} = docSnapshot.data()
      await setDoc(docRef, {count: count + 1})
    } else {
      await setDoc(docRef, {count: 1})
    }
    updateInventory()
  }

  const remove = async(item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnapshot = await getDoc(docRef)
    if (docSnapshot.exists()){
      const {count} = docSnapshot.data()
      if (count == 1){
        await deleteDoc(docRef);
      }
      else {
        await setDoc(docRef, {count: count - 1})
      }
    }
    updateInventory()
  }

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  useEffect(() => {
    updateInventory()
  }, [])

  const filteredInventory = inventory.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Box
      width="100vw" 
      height="100vh"
      display="flex"      
      justifyContent="center"
      alignItems="center"
      gap={2}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          left="50%"
          top="50%"
          bgcolor="white"
          border="2px solid #800"
          width={400}
          display="flex"
          flexDirection="column"
          boxShadow={24}
          p={4}
          gap={3}
          sx={{
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack
            width="100%"
            flexDirection="row"
            spacing={2}
          >
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value)
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                add(itemName)
                setItemName("")
                handleClose()
              }}
            >Add</Button>
          </Stack>
        </Box>
      </Modal>
      <Box
        width="800px"
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
      >
        <Box
          width="800px"
          height="100px"
          bgcolor="#ADD8E6"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <Typography variant="h2">Inventory Management</Typography>
        </Box>
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Search items"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={handleOpen}
        >
          Add New Item
        </Button>
        <Stack width="800px" height="300px" spacing={2} overflow="auto" flexDirection="column" display="flex">
          {filteredInventory.map((item) => (
            <Box 
              key={item.name} 
              width="100%" 
              minHeight="150px"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              bgcolor="#f0f0f0"
              padding={5}
            >
              <Typography variant="h3" color="#333" textAlign="center">
                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
              </Typography>
              <Typography variant="h3" color="#333" textAlign="center">
                {item.count}
              </Typography>
              <Button variant="contained" onClick={() => add(item.name)}>
                Add
              </Button>
              <Button variant="contained" onClick={() => remove(item.name)}>
                Remove
              </Button>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
