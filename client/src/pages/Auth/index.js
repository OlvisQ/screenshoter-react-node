import { Box, Button, Container, Grid, makeStyles, TextField } from "@material-ui/core";
import { useState } from "react";
import { useDispatch } from 'react-redux';
import Snackbar from '@material-ui/core/Snackbar';
import { userActions } from '../../redux/actions';

const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(3),
  },
}));

const Auth = () => {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [snack, setSnack] = useState({
    openSnackBar: false,
    errorMessage: '',
  })
  const dispatch = useDispatch();

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(userActions.login(email, password, ({ error }) => {
      if (error) {
        setSnack({
          openSnackBar: true,
          errorMessage: error.message || 'Unknown Error'
        })
      }
    }))
    // setEmail('')
    // setPassword('');
  }

  return (
    <Container className={classes.container} maxWidth="xs">
      <form onSubmit={onSubmit} autoComplete="off">
        <Box mt={12}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    size="small"
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    size="small"
                    type="password"
                    variant="outlined"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Button color="secondary" fullWidth type="submit" variant="contained">
                Log in
              </Button>
            </Grid>
          </Grid>
        </Box>
      </form>
      <Snackbar
        open={snack.openSnackBar}
        message={snack.errorMessage}
        autoHideDuration={3000}
        onClose={() => setSnack({ openSnackBar: false })}
      />
    </Container>
  );
}

export default Auth;
