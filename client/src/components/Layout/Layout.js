import clsx from 'clsx';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import DashboardIcon from '@material-ui/icons/Dashboard';
import SettingsIcon from '@material-ui/icons/Settings';
import { useLocation, withRouter } from 'react-router-dom';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Divider from '@material-ui/core/Divider';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import FullscreenIcon from '@material-ui/icons/Fullscreen';

const drawerWidth = 240;
const toolbarHeight = 48; // dense size

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    // ...theme.mixins.toolbar,
    minHeight: toolbarHeight,
    justifyContent: 'flex-end',
  },
  childContent: {
    height: `calc(100% - ${toolbarHeight}px)`
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
    height: `100vh`,
  },
  title: {
    flexGrow: 1,
    textAlign: 'center',
  }
}));

const menus = [
  {
    name: 'dashboard',
    label: 'Dashboard',
    route: '/app/dashboard',
    icon: <DashboardIcon />
  },
  {
    name: 'config',
    label: 'Configs',
    route: '/app/config',
    icon: <SettingsIcon />
  },
  {
    name: 'site',
    label: 'Sites',
    route: '/app/site',
    icon: <AccountBalanceIcon />
  }
]

const Layout = ({ children, history }) => {
  const classes = useStyles();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);
  const handle = useFullScreenHandle();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const isCurrItem = (route) => {
    return location.pathname.startsWith(`${route}`);
  }

  const onClickMenuItem = (menu) => {
    handleDrawerClose();
    if (isCurrItem(menu.route)) return;
    history.push(menu.route);
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar)}
      >
        <Toolbar variant="dense">
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap className={classes.title}>
            Website Watcher
          </Typography>
          <IconButton
            color="inherit"
            aria-label="full screen"
            onClick={handle.enter}
            edge="end"
          >
            <FullscreenIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        anchor="left"
        open={open}
        classes={{
          paper: classes.drawerPaper,
        }}
        onClose={() => setOpen(false)}
      >
        <div className={classes.drawerHeader}>
          <Typography variant="button" noWrap className={classes.title}>
            Website Watcher
          </Typography>
        </div>
        <Divider />
        <List>
          {menus.map((item, index) => (
            <ListItem button key={index} selected={isCurrItem(item.route)} onClick={() => onClickMenuItem(item)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main className={clsx(classes.content)} >
        <div className={classes.drawerHeader} />
        <div className={classes.childContent}>
          <FullScreen handle={handle} style={{ height: '100% !important' }}>
            {children}
          </FullScreen>
        </div>
      </main>
    </div>
  );
}

export default withRouter(Layout);
