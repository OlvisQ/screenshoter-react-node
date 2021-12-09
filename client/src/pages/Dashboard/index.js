import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { dashboardService, configService } from '../../services';
import { Box, useTheme } from '@material-ui/core';
import socketIOClient from "socket.io-client";
import Pagination from '@material-ui/lab/Pagination';
import { useLocation, useParams, withRouter } from 'react-router-dom';
import './style.css';

const paginatorHeight = 38;

const useStyles = makeStyles((theme) => ({
  root: {
  },
  imgContainer: {
    position: "relative",
    width: "100%",
    paddingTop: "80%", // 4:5
    borderRadius: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: 'grey',
    borderStyle: 'solid',
  },
  img: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    backgroundPosition: "center",
  },
  img2: {
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "center",
    backgroundPosition: "top",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'grey',
    borderStyle: 'solid',
  },
  paginationContainer: {
    height: paginatorHeight
  }
}));

let socket;

const Dashboard = () => {
  const { page } = useParams();
  const classes = useStyles();
  const theme = useTheme();
  const location = useLocation();

  const [col, setCol] = useState(3);
  const [row, setRow] = useState(3);
  const [screens, setScreens] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [containerHeight, setContainerHeight] = useState(400);
  const [currPage, setCurrPage] = useState(page ? parseInt(page) : 1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    init()

    const handleResize = () => {
      const height = document.getElementById('screen-container').clientHeight;
      // setContainerHeight(height);
      setContainerHeight(height - paginatorHeight); // - pagination height
    }
    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      if (socket) {
        socket.disconnect();
        socket = undefined;
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    let tPages = Math.ceil(screens.length / (col * row));
    if (tPages == 0) {
      tPages = 1
    }
    setTotalPages(tPages)
    // if (tPages < currPage) {
    //   setCurrPage(tPages);
    // }
  }, [col, row, screens])

  const init = async () => {
    setIsLoading(true)
    try {
      const data = await dashboardService.get()
      if (data.success) {
        setScreens(data.data);
      }
      const dd = await configService.get()
      if (dd.success) {
        setCol(dd.data.col);
        setRow(dd.data.row)
      }
      const { origin } = window.location;
      socket = socketIOClient(origin, { transports: ['websocket', 'polling', 'flashsocket'] });
      socket.on("broadcast", data => {
        const { screen, config, deleted } = data;
        if (screen) { // add or update screen data
          addUpdateScreen(screen);
        } else if (config) { // config information updated
          updateConfig(config)
        } else if (deleted) { // screen was deleted
          deleteScreen(deleted);
        }
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error)
    }
  }

  const addUpdateScreen = (data) => {
    setScreens(ss => {
      const a = [...ss];
      const i = a.findIndex((s => s.id === data.id))
      if (i >= 0) {
        a[i] = data;
      } else {
        a.push(data);
      }
      return a;
    });
  }

  const updateConfig = (config) => {
    if (config.col) {
      setCol(config.col);
      setRow(config.row);
    }
  }

  const deleteScreen = (deleted) => {
    setScreens(ss => {
      const a = [...ss];
      const i = a.findIndex((s => s.siteID === deleted.id))
      if (i >= 0) {
        a.splice(i, 1)
      }
      return a
    });
  }

  const handleChangePage = (event, value) => {
    // setCurrPage(value);
    if (currPage === value) return;
    const { origin } = window.location;
    const url = `${origin}/app/dashboard/${value}`
    window.open(url, '_blank');
  }

  const imgUrl = (uri) => {
    const { origin } = window.location
    return `${origin}/${uri}`
  }

  const renderCols = (rowIndex) => {
    const p = 1;
    const items = [];
    for (var i = 0; i < col; i++) {
      const n = i + rowIndex * col + (currPage - 1) * (col * row);
      if (screens.length > n) {
        const item = screens[n];
        items.push(
          <Box p={p} key={i} width={`${100 / col}%`}>
            {/* <div className={classes.imgContainer}>
              <div className={classes.img} style={{ backgroundImage: `url("${imgUrl(item.thumbUrl)}")` }}>
                <a href={imgUrl(item.url)} target="_blank" style={{ width: '100%', height: '100%' }}></a>
              </div>
            </div> */}
            <div style={{ height: `${(containerHeight / row - theme.spacing(p * 2))}px`, overflow: 'hidden' }}>
              <div className={classes.img2} style={{ backgroundImage: `url("${imgUrl(item.thumbUrl)}")` }}>
                <a href={imgUrl(item.url)} target="_blank" style={{ width: '100%', height: '100%' }}></a>
              </div>
            </div>
          </Box>
        )
      } else { // empty cell
        items.push(
          <Box p={1} key={i} width={`${100 / col}%`}>
            <div style={{ height: `${(containerHeight / row - theme.spacing(2))}px` }} />
          </Box>
        )
      }
    }
    return items;
  }

  const renderItems = () => {
    const items = [];
    for (var i = 0; i < row; i++) {
      items.push(
        <Box
          key={`${i}-${currPage}`}
          display="flex"
          flexWrap="nowrap"
        >
          {renderCols(i)}
        </Box>
      )
    }
    return items;
  }

  return (
    <Box id='screen-container' height="100%" display="flex" flexDirection="column" className={classes.root}>
      <Box p={0} flexGrow={1}>
        {!isLoading && renderItems()}
      </Box>
      <Box className={classes.paginationContainer} display="flex" justifyContent="center" alignItems="center">
        <Pagination count={totalPages} color="primary" page={currPage} onChange={handleChangePage} />
      </Box>
    </Box>
  )
}

export default withRouter(Dashboard);
