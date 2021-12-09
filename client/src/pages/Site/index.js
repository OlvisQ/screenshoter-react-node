import React, { Fragment, useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, TextField, Typography, withStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { siteService } from '../../services';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}))(TableRow);

const columns = [
  { id: 'name', label: 'NAME', width: 200 },
  { id: 'url', label: 'URL' },
  { id: 'action', label: 'Actions', width: 100, align: 'right', },
];

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(2)
  },
  tableRoot: {
    width: '100%',
  },
  container: {},
  link: {
    color: 'white',
  }
}));

const initSiteInfo = {
  url: '', name: '', id: undefined
}

const URL_REGEX = new RegExp('([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?')

const Site = () => {
  const classes = useStyles();
  const [sites, setSites] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [delDlgOpen, setDelDlgOpen] = useState(false);
  const [willChangeSiteInfo, setWillEDSiteInfo] = useState(initSiteInfo);

  useEffect(() => {
    siteService.get().then(ret => {
      if (ret.success) {
        setSites(ret.data);
      }
    }).catch(e => console.log(e));
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const delAction = (data) => {
    setWillEDSiteInfo(data);
    setDelDlgOpen(true);
  }

  const editAction = (data) => {
    setWillEDSiteInfo(data);
    setIsEdit(true);
    setOpen(true);
  }

  const handleAddSite = () => {
    setWillEDSiteInfo(initSiteInfo);
    setIsEdit(false);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setDelDlgOpen(false);
  };

  const onAddEditSite = () => {
    setOpen(false);
    if (isEdit) {
      siteService.update(willChangeSiteInfo).then(ret => {
        if (ret.success) {
          const { data } = ret;
          const a = [...sites];
          const i = a.findIndex((s => s.id === data.id))
          if (i >= 0) {
            a[i] = data
          }
          setSites(a);
        }
      }).catch(e => console.log(e));
    } else {
      siteService.add(willChangeSiteInfo).then(ret => {
        if (ret.success) {
          const a = [...sites];
          a.push(ret.data);
          setSites(a);
        }
      }).catch(e => console.log(e));
    }
  }

  const onConfirmDel = () => {
    if (willChangeSiteInfo.id) {
      siteService.deleteSite(willChangeSiteInfo.id)
        .then(ret => {
          if (ret.success) {
            const { data } = ret;
            const a = [...sites];
            const i = a.findIndex((s => s.id === data.id))
            if (i >= 0) {
              a.splice(i, 1)
            }
            setSites(a);
          }
        })
        .catch(e => console.log(e));
    }
    setDelDlgOpen(false);
  }

  const actionButtons = (data) => {
    return (
      <Fragment>
        <IconButton aria-label="delete" size="small" onClick={() => editAction(data)}>
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton aria-label="delete" size="small" onClick={() => delAction(data)}>
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Fragment>
    )
  }

  const wrapUrl = (text) => {
    const target = '_blank'
    return (
      <a href={text} target={target} className={classes.link}>{text}</a>
    )
  }

  return (
    <div className={classes.root}>
      <Box mb={2}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item>
            <Typography variant="h5" gutterBottom>
              Site list
            </Typography>
          </Grid>
          <Grid item>
            <Button variant="contained" color="primary" onClick={handleAddSite}>
              Add New Site
            </Button>
          </Grid>
        </Grid>
      </Box>
      <Paper className={classes.tableRoot}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <StyledTableCell
                    key={column.id}
                    align={column.align}
                    style={{ width: column.width }}
                  >
                    {column.label}
                  </StyledTableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sites.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => {
                return (
                  <StyledTableRow hover role="checkbox" tabIndex={-1} key={`${row.url}-${index}`}>
                    {columns.map((column, index) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {index < columns.length - 1 && URL_REGEX.test(value) ? wrapUrl(value) : value}
                          {index == columns.length - 1 && actionButtons(row)}
                        </TableCell>
                      );
                    })}
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={sites.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{isEdit ? 'Edit Site' : 'Add New Site'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {isEdit ? 'Edit' : 'Add'} the site to take the screenshot
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="NAME"
            type="text"
            fullWidth
            value={willChangeSiteInfo.name}
            onChange={(e) => setWillEDSiteInfo({ ...willChangeSiteInfo, name: e.target.value })}
          />
          <TextField
            margin="dense"
            id="url"
            label="URL"
            type="text"
            fullWidth
            value={willChangeSiteInfo.url}
            onChange={(e) => setWillEDSiteInfo({ ...willChangeSiteInfo, url: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} >
            Cancel
          </Button>
          <Button onClick={onAddEditSite} >
            {isEdit ? 'Edit' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={delDlgOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Waring!!!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure to delete the site?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            No
          </Button>
          <Button onClick={onConfirmDel} autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Site;
