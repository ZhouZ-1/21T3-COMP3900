import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    CardHeader
} from '@material-ui/core/';
import { 
    Button,  
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    useMediaQuery,
    useTheme
} from '@mui/material';
import NavBar from "../NavBar";
import PortfolioPage from "../PortfolioPage";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(2)
    }
}))

function PortfolioOverview() {
    const [open, setOpen] = React.useState(false);
    const [title,setTitle] = useState('');
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    const handleCreate = () => {
        //  api call for create new portfolio
        const token = localStorage.getItem('token');
        api('portfolio/create', 'POST', {token, portfolio_name: title}) 
            .then(res => {
                if (res.is_success) {
                    // Success
                    alert("Successfully update your password!");
                } else {
                    // Something went wrong
                    alert(res.message);
                }
            })
        setOpen(false);
    };
    

    const classes = useStyles()
    const data = [
        { id: 1, Portfolio: 1, earnings: 13000 },
        { id: 2, Portfolio: 2, earnings: 16500 },
        { id: 3, Portfolio: 3, earnings: 14250 },
        { id: 4, Portfolio: 4, earnings: 19000 }
    ]
    return (
        <div className={classes.root}>
            <NavBar/>
            <br></br>
            <div>
                <h3>Portfolio Overview</h3>
                <div>
                    <Button variant="outlined" onClick={handleClickOpen}>
                        Create Portfolio
                    </Button>
                    <Dialog
                        fullScreen={fullScreen}
                        open={open}
                        onClose={handleClose}
                        aria-labelledby="responsive-dialog-title"
                    >
                        <DialogTitle id="responsive-dialog-title">
                        {"Create Portfolio"}
                        </DialogTitle>
                        <DialogContent>
                        <DialogContentText>
                            Please enter title of Portfolio:  
                        </DialogContentText>
                        <TextField id="demo-helper-text-misaligned-no-helper" label="Title"  required autofocus onChange={(evt)=>setTitle(evt.target.value)}></TextField>
                        </DialogContent>                            
                        <br></br>
                        <DialogActions>
                        <Button autoFocus onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreate} autoFocus>
                            Confirm
                        </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
            <br></br>
            <Grid
                container
                spacing={2}
                direction="row"
                justify="flex-start"
                alignItems="flex-start"
            >
                {data.map(elem => (
                    <Grid item xs={12} sm={6} md={3} key={data.indexOf(elem)}>
                        <Card 
                            variant="outlined"
                            component={PortfolioPage}
                            to={`portfolio/${elem.id}`}>
                            <CardHeader
                                    title={`Portfolio : ${elem.Portfolio}`}
                                    subheader={`earnings : ${elem.earnings}`}
                                />  
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Description
                                </Typography>
                            </CardContent>
                        </Card>
                     </Grid>
                ))}
            </Grid>
        </div>
        
    )
}

export default PortfolioOverview;