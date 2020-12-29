import React, { FunctionComponent } from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { ANALYSIS, HOME, LOGIN, MEMBERMANAGE, RESULT, SETTING } from '../../constants/constants';
import { Link, useHistory } from 'react-router-dom';
import './header.css';
import { useCookies } from 'react-cookie';
import { Button, Typography } from '@material-ui/core';
const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      backgroundColor: "#1EB8B8",
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(9) + 1,
      },
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    title: {
      flexGrow: 1,
    }
  }),
);

export const Header:FunctionComponent = (prop) => {
  const classes = useStyles();
  const [ cookies, setCookie, removeCookie ] = useCookies();
  const history = useHistory();
  let role: string = cookies['user-role'];
  let name: string = cookies['user-name'];
  let token: string = cookies['jwt-auth-token'];

  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
  };
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  function logout () {
    console.log(role,name,token);
    removeCookie('user-role',{path: '/'});
    removeCookie('user-name',{path: '/'});
    removeCookie('jwt-auth-token',{path: '/'});
    history.push('/');
    window.location.reload();
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Link to={HOME} onClick={(event) => handleListItemClick(event, 0)}>
            <img height="60px" alt="InstantNano" src="/assets/Instant Logo_White.png" />
          </Link>
          <Typography className={classes.title}>
          </Typography>
          {token?
            <>
              <Typography>
              {role==='admin'?'admin':'Medical Technologist'} {name} 已登入
              </Typography>
              <Button color="inherit" onClick={logout} style={{ textDecoration: 'none', color:'white', fontSize:"large"}}>
                  登出
              </Button>
            </>
            :
            <Button color="inherit">
              <Link to={LOGIN} style={{ textDecoration: 'none', color:'white', fontSize:"large"}} >
                登入
              </Link>
            </Button>
          }
          
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
            <Link to={ANALYSIS} style={{ textDecoration: 'none' }}>
                <ListItem  button key="Data Analysis" selected={selectedIndex === 1} onClick={(event) => handleListItemClick(event, 1)}>
                <ListItemIcon><img width="24px" height="24px" alt="edit" src="/assets/edit.png"/></ListItemIcon>
                <ListItemText primary="Data Analysis" />
                </ListItem>
            </Link>
            <Link to={RESULT} style={{ textDecoration: 'none' }}>
                <ListItem  button key="Results Overview" selected={selectedIndex === 2} onClick={(event) => handleListItemClick(event, 2)}>
                <ListItemIcon><img width="24px" height="24px" alt="result" src="/assets/file.png"/></ListItemIcon>
                <ListItemText primary="Results Overview" />
                </ListItem>
            </Link>
            <Link to={SETTING} style={{ textDecoration: 'none' }}>
                <ListItem  button key="Setting" selected={selectedIndex === 3} onClick={(event) => handleListItemClick(event, 3)}>
                <ListItemIcon><img width="24px" height="24px" alt="setting" src="/assets/settings.png"/></ListItemIcon>
                <ListItemText primary="Setting" />
                </ListItem>
            </Link>
            {(role==='admin'&&token!==undefined&&token!=="")?
              <Link to={MEMBERMANAGE} style={{ textDecoration: 'none' }}>
                  <ListItem  button key="Membermanage" selected={selectedIndex === 4} onClick={(event) => handleListItemClick(event, 4)}>
                  <ListItemIcon><img width="24px" height="24px" alt="member manage" src="/assets/memberlist.png"/></ListItemIcon>
                  <ListItemText primary="Member Manage" />
                  </ListItem>
              </Link>:null
            }
        </List>
      </Drawer>
      <main className="container-fluid mw-1200 py-4 px-3">
        <div className={classes.toolbar} />
          {prop.children}
      </main>
    </div>
  );
}