import React from 'react';
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

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
        padding: theme.spacing(2)
    }
}))

function PortfolioOverview() {
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    const handleClickOpen = () => {
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
    };

    const classes = useStyles()
    const data = [
        { Portfolio: 1, earnings: 13000 },
        { Portfolio: 2, earnings: 16500 },
        { Portfolio: 3, earnings: 14250 },
        { Portfolio: 4, earnings: 19000 }
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
                        <TextField id="demo-helper-text-misaligned-no-helper" label="Title"></TextField>
                        </DialogContent>                            
                        <br></br>
                        <DialogActions>
                        <Button autoFocus onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleClose} autoFocus>
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
                        <Card>
                            <CardHeader
                                title={`Portfolio : ${elem.Portfolio}`}
                                subheader={`earnings : ${elem.earnings}`}
                            />
                            <CardContent>
                                <Typography variant="h5" gutterBottom>
                                    Hello World
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