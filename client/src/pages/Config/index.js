import { Fragment, useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { Box, Button, FormControlLabel, Grid, Snackbar, Switch } from "@material-ui/core";
import { configService } from '../../services';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}));

const Config = () => {
  const classes = useStyles();
  const [col, setCol] = useState(5);
  const [row, setRow] = useState(4);
  const [minutes, setMinutes] = useState(3);
  const [willDelOldFile, setWillDelOldFile] = useState(true);
  const [id, setID] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [snack, setSnack] = useState({
    openSnackBar: false,
    errorMessage: '',
  })

  const onUpdateConfig = () => {
    const params = { id, interval: minutes, col, row, willDelOldFile }
    configService.update(params).then(data => {
      setSnack({
        openSnackBar: true,
        errorMessage: data.success ? 'Success' : 'Failed'
      })
    }).catch(e => {
      setSnack({
        openSnackBar: true,
        errorMessage: 'Something went wrong'
      })
      console.log(e)
    });
  }

  useEffect(() => {
    configService.get().then(data => {
      if (data.success) {
        const { col, row, interval, id, willDelOldFile } = data.data;
        setCol(col);
        setRow(row);
        setMinutes(interval);
        setWillDelOldFile(willDelOldFile);
        setID(id);
      }
      setIsLoading(false);
    }).catch(e => {
      console.log(e);
      setIsLoading(false);
      setSnack({
        openSnackBar: true,
        errorMessage: 'Something went wrong'
      })
    })
  }, [])

  return (
    <Fragment>
      {!isLoading && (
        <div className={classes.root}>
          <Grid
            container
            direction="row"
            justify="flex-start"
            alignItems="center"
            spacing={2}
          >
            <Grid item>
              <TextField
                id="outlined-select-currency"
                select
                label="row"
                value={row}
                onChange={(event) => setRow(event.target.value)}
                helperText="Please select number of row"
                variant="outlined"
              >
                {[2, 3, 4].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item>
              <TextField
                id="outlined-select-currency"
                select
                label="colunm"
                value={col}
                onChange={(event) => setCol(event.target.value)}
                helperText="Please select number of column"
                variant="outlined"
              >
                {[2, 3, 4, 5].map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item>
              <TextField
                id="outlined-select-currency"
                label="minutes"
                value={minutes}
                onChange={(event) => setMinutes(event.target.value)}
                helperText="number of minutes"
                variant="outlined"
                type="number"
                InputProps={{ inputProps: { min: 1, max: 30 } }}
              >
              </TextField>
            </Grid>
          </Grid>
          <Box mt={2}>
            <FormControlLabel
              control={<Switch checked={willDelOldFile} onChange={(e) => setWillDelOldFile(e.target.checked)} />}
              label="Will delete the old files"
            />
          </Box>
          <Box mt={5}>
            <Button color="primary" variant="contained" onClick={onUpdateConfig}>
              Update
            </Button>
          </Box>
        </div>
      )}
      <Snackbar
        open={snack.openSnackBar}
        message={snack.errorMessage}
        autoHideDuration={3000}
        onClose={() => setSnack({ openSnackBar: false })}
      />
    </Fragment>
  )
}

export default Config;
