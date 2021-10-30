// import React from 'react';
// import { useState, useEffect } from "react";
// import { useHistory } from "react-router";
// import { 
//     Button,  
//     TextField,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogContentText,
//     DialogTitle,
// } from '@mui/material';
// import { DataGrid } from '@mui/x-data-grid';
// import api from "../../api";

// function AddPortfolio() {
//   var history = useHistory();
//   const [open, setOpen] = useState(false);
//   const [stock, setStock] = useState([]);
//   const [stockState, setStockState] = useState(false);
//   const [isLoading,setIsLoading] = useState(false);

//   const handleClickOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   const handleDelete = useEffect(async() => {
//     const res = await api('portfolio/delete', 'DELETE', {
//       token: localStorage.getItem('token'), portfolio_id: localStorage.getItem('id')
//     });

//     if (res) {
//       localStorage.removeItem('id');
//       alert("Successfully Delete The Portfolio.");
//     }
//     setOpen(false);
//     // history.push('/viewPortfolio');
//   });

//   return (
//     <div>
//       <Button onClick={handleClickOpen}>
//         Delete Portfolio
//       </Button>
//       <Dialog
//         open={open}
//         onClose={handleClose}
//         aria-labelledby="alert-dialog-title"
//         aria-describedby="alert-dialog-description"
//       >
//         <DialogTitle id="alert-dialog-title">
//             {"Delete Portfolio"}
//           </DialogTitle>
//           <DialogContent>
//             <DialogContentText id="alert-dialog-description">
//               Do You Want To Delete This Portfolio?
//             </DialogContentText>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleClose}>Cancel</Button>
//             <Button onClick={handleDelete} autoFocus>
//               Confirm
//             </Button>
//           </DialogActions>
//         </Dialog>
//     </div>
//   );
// }

// export default AddPortfolio;