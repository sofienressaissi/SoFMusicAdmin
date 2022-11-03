import React, { useContext, useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import Axios from "axios";
import { toast } from "toast-notification-alert";
import AdminContext from '../context/AdminContext';
import { FaDoorOpen, FaFileVideo, FaFolder, FaFolderPlus, FaStar, FaVideo } from 'react-icons/fa';
import Pagination from '../pagination/pagination';
import Favicon from 'react-favicon';

let PageSize = 6;

export default function AllVideos() {

    const { adminData, setAdminData } = useContext(AdminContext);
    const history = useHistory();
    let [allMsgs, setAllMsgs] = useState([]);
    let [allFeedbacks, setAllFeedbacks] = useState([]);
    let [nbUF] = useState(0);
    useEffect(async() => {
        const result_feedbacks = await Axios.get('https://sofmusic-backend.herokuapp.com/user/allFeedbacks');
        setAllFeedbacks(result_feedbacks.data);
      },[]);
      allFeedbacks.map((itemf,indexf)=>{
        itemf.unread === true ? nbUF = nbUF + 1 : <></>
      });
      const updateUnread = (e) => {
        e.preventDefault();
        try {
            Axios.put('https://sofmusic-backend.herokuapp.com/user/update-unread');
        } catch (err) {
            toast.show({title: err.response.data.msg, position: 'topright', type: 'alert'});
        }
    }
    let [nbUM] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    let [allVideos, setAllVideos] = useState([]);
    let [searchVid, setSearchVid] = useState('');
    useEffect(async() => {
        const result_msgs = await Axios.get('https://sofmusic-backend.herokuapp.com/user/allMsgs');
        setAllMsgs(result_msgs.data);
      },[]);
      useEffect(async() => {
        const result_vid = await Axios.get('https://sofmusic-backend.herokuapp.com/video/allVideos');
        setAllVideos(result_vid.data);
      },[]);
      allMsgs.map((itemu,index)=>{
        itemu.status === false ? nbUM = nbUM + 1 : <></>
      });
      let reverseTab = [];
      for (let i = allVideos.length - 1; i >=0; i--) {
        reverseTab.push({ytbVidUrl: allVideos[i].ytbVidUrl});
      }
      const currentVidData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return reverseTab.slice(firstPageIndex, lastPageIndex);
      }, [currentPage, reverseTab]);
    const logout = () => {
      setAdminData({
        token: undefined,
        admin: undefined
        });
      localStorage.setItem("auth-token", "");
      history.push('/admin/login');
      window.location.reload();
    }
    return (
        <>
        {
            adminData.admin ?
            <>
            <html>
            <head>
                <title>SoF Music - All Videos</title>
                <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
      <meta charSet="utf-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0, minimal-ui"/>
      <link rel="icon" href="../assetsAdmin/images/favicon.ico" type="image/x-icon"/>
    <link href="https://fonts.googleapis.com/css?family=Roboto:400,500" rel="stylesheet"/>
    <link rel="stylesheet" href="../assetsAdmin/pages/waves/css/waves.min.css" type="text/css" media="all"/>
      <link rel="stylesheet" type="text/css" href="../assetsAdmin/css/bootstrap/css/bootstrap.min.css"/>
      <link rel="stylesheet" href="../assetsAdmin/pages/waves/css/waves.min.css" type="text/css" media="all"/>
      <link rel="stylesheet" type="text/css" href="../assetsAdmin/icon/themify-icons/themify-icons.css"/>
      <link rel="stylesheet" type="text/css" href="../assetsAdmin/icon/font-awesome/css/font-awesome.min.css"/>
      <link rel="stylesheet" type="text/css" href="../assetsAdmin/css/jquery.mCustomScrollbar.css"/>

        <link rel="stylesheet" href="https://www.amcharts.com/lib/3/plugins/export/export.css" 
        type="text/css" media="all" />
      <link rel="stylesheet" type="text/css" href="../assetsAdmin/css/style.css"/>
            </head>
            <body className="dashboardBody">
            <Favicon url='https://sofmusic-backend.herokuapp.com/uploads/logoIcon.png'/>
            <div id="pcoded" className="pcoded">
      <div className="pcoded-overlay-box"></div>
      <div className="pcoded-container navbar-wrapper">
          <nav className="navbar header-navbar pcoded-header" 
          style={{backgroundColor: '#5a0018'}}>
              <div className="navbar-wrapper">
                  <div className="navbar-logo">
                      
                  <a href = "/admin"><span style={{color: 'white', fontWeight: 'bold',
                  fontFamily: 'Mistral', fontSize: '40px'}}>SoF</span></a>
                  </div>
                
                  <div className="navbar-container container-fluid">
                      <ul className="nav-left">
                          <li>
                              <div className="sidebar_toggle"><a href="javascript:void(0)">
                                  <i className="ti-menu"></i></a></div>
                          </li>
                      </ul>
                      <style>
                      {`\
        #messages:hover {\
          text-decoration: underline;\
          color: white;\
        }\
      `}
      {`\
        #feedbacks:hover {\
          text-decoration: underline;\
          color: white;\
        }\
      `}
                      </style>
                      <ul className="nav-right">
                      <li className="user-profile header-notification">
                         <a className="waves-effect waves-light" id="messages" href = "/admin/messages">
                         <span style={{fontSize:'15px', color: 'white'}}>Messages ({nbUM})</span>
                         </a>
                         </li>
                         <li className="user-profile header-notification">
                             {
                                 nbUF > 0 ?
                                 <a className="waves-effect waves-light" id="feedbacks" 
                         href = "/admin/feedbacks" onClick={updateUnread}>
                         <span style={{fontSize:'15px', color: 'white'}}>Feedbacks ({nbUF})</span>
                         </a> : 
                                <>
                                <a className="waves-effect waves-light" id="feedbacks" 
                         href = "/admin/feedbacks">
                         <span style={{fontSize:'15px', color: 'white'}}>Feedbacks ({nbUF})</span>
                         </a>
                                </>
                             }
                         </li>
                          <li className="user-profile header-notification">
                              <a className="waves-effect waves-light">
                                        <img src="https://sof-music-auth-backend.herokuapp.com/uploads/adminIcon.png" 
                                  className="img-radius" 
                                  alt="Admin-Profile-Image"/>
                                  <span style={{color: 'white'}} onClick={logout}><b>Logout</b> <span style={{fontSize: '20px;'}}><FaDoorOpen/></span></span>
                              </a>
                          </li>
                      </ul>
                  </div>
              </div>
          </nav>

          <div className="pcoded-main-container">
              <div className="pcoded-wrapper">
                  <nav className="pcoded-navbar">
                      <div className="sidebar_toggle"><a href="#"><i className="icon-close icons"></i></a></div>
                      <div className="pcoded-inner-navbar main-menu">
                          <div className="">
                              <div className="main-menu-header">
                              <img src="https://sof-music-auth-backend.herokuapp.com/uploads/adminIcon.png" 
                                  className="img-radius" 
                                  alt="Admin-Profile-Image"/>
                                  <div class="user-details">
                                      <span id="more-details">
                                          {adminData.admin.firstName} {adminData.admin.lastName} <FaStar style={{color: '#d4af37'}}/>
                                      </span>
                                  </div>
                              </div>
                          </div>
                          <div className="pcoded-navigation-label" data-i18n="nav.category.navigation">
                              Admin Management
                          </div>
                          <ul className="pcoded-item pcoded-left-item">
                              <li className="pcoded-hasmenu">
                                  <a href="/admin/releases" className="waves-effect waves-dark">
                                      <span className="pcoded-micon"><FaFolder style={{color: '#5a0018'}}/></span>
                                      <span className="pcoded-mtext" data-i18n="nav.dash.main"
                                      style={{color: '#9E002B'}}>All Releases</span>
                                      <span className="pcoded-mcaret"></span>
                                  </a>
                              </li>
                              <li className="pcoded-hasmenu">
                                  <a href="/admin/new-release/add" className="waves-effect waves-dark">
                                      <span className="pcoded-micon"><FaFolderPlus style={{color: '#5a0018'}}/></span>
                                      <span className="pcoded-mtext" data-i18n="nav.dash.main"
                                      style={{color: '#9E002B'}}>Add New Release</span>
                                      <span className="pcoded-mcaret"></span>
                                  </a>
                              </li>
                              <li className="pcoded-hasmenu">
                                  <a href="/admin/videos" className="waves-effect waves-dark">
                                      <span className="pcoded-micon"><FaVideo style={{color: '#5a0018'}}/></span>
                                      <span className="pcoded-mtext" data-i18n="nav.dash.main"
                                      style={{color: '#9E002B'}}>All Videos</span>
                                      <span className="pcoded-mcaret"></span>
                                  </a>
                              </li>
                              <li className="pcoded-hasmenu">
                                  <a href="/admin/new-video/add" className="waves-effect waves-dark">
                                      <span className="pcoded-micon"><FaFileVideo style={{color: '#5a0018'}}/></span>
                                      <span className="pcoded-mtext" data-i18n="nav.dash.main"
                                      style={{color: '#9E002B'}}>Add New Video</span>
                                      <span className="pcoded-mcaret"></span>
                                  </a>
                              </li>
                              <li className="pcoded-hasmenu">
                                  <a className="waves-effect waves-dark">
                                      <span className="pcoded-micon"><FaDoorOpen style={{color: '#5a0018'}}/></span>
                                      <span className="pcoded-mtext"  
                                      data-i18n="nav.basic-components.main" onClick={logout} 
                                      style={{color: '#9E002B'}}>Logout</span>
                                      <span className="pcoded-mcaret"></span>
                                  </a>
                              </li>
                          </ul>
                          
                      </div>
                  </nav>
                  <div className="pcoded-content">
                      <div className="page-header">
                          <div className="page-block">
                              <div className="row align-items-center">
                                  <div className="col-md-8">
                                      <div className="page-header-title">
                                          <h5 className="m-b-10">Admin Dashboard</h5>
                                      </div>
                                  </div>
                                  <div className="col-md-4">
                                      <ul className="breadcrumb-title">
                                          <li className="breadcrumb-item">
                                              <a href="/admin"> <i className="fa fa-home"></i> </a>
                                          </li>
                                          <li className="breadcrumb-item"><a href="/admin">Admin Dashboard</a>
                                          </li>
                                          <li className="breadcrumb-item"><a >All Videos</a>
                                          </li>
                                      </ul>
                                  </div>
                                  
                              </div>
                          </div>
                      </div>
                    </div>
                    <style>
                    {`\
        .searchVid {\
          border-radius: 10px;\
          height: 30px;\
          width: 300px;\
          margin-right: 36px;\
        }\
      `}
      {`\
        .card .card-block {\
          padding: 20px;\
          height: 1430px;\
        }\
      `}
                    </style>
                    <div className="card">
                    <div className="card-header">
                        <h5>All Videos</h5>
                    </div>
                    <div align = "right">
                        {
                            allVideos.length > 0 ?
                            <input type="text"
                        placeholder="Search Video" className="searchVid"
                   onChange={(e)=>setSearchVid(e.target.value)}/> : 
                             <></>
                        }
                    </div>
                    <div className="card-block table-border-style">
                       <div className="table-responsive">
                       <table className="table table-hover">
                                                        {
                                                            allVideos.length > 0 ?
                                                            <thead>
                                                            <tr>
                                                                <div align = "center">
                                                                <th>YouTube Video</th>
                                                                </div>
                                                            </tr>
                                                        </thead> :
                                                            <>You Have No Videos.</>
                                                        }
                                                        <tbody>
                                                            {
                                                                currentVidData.filter((item=>{
                                                                    if (searchVid === "") {
                                                                        return item
                                                                    }else if(item.ytbVidUrl.toLowerCase().includes(searchVid.toLowerCase())){
                                                                        return item
                                                                    }
                                                                })).map((itemv) => (
                                                                    <tr key={itemv._id}>
                                                                    <td>
                                                                        <div align = "center">
                                                                    <iframe
                                                                    width="280"
                                                                    height="170"
                                                                    src={`https://www.youtube.com/embed/${itemv.ytbVidUrl.replace('https://www.youtube.com/watch?v=','')}`}
                                                                    frameBorder="0"
                                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                                    allowFullScreen
                                                                    title="Embedded youtube"
                                                                    /></div>
                                                                    </td>
                                                                    </tr>
                                                                    ))}
                                                        </tbody>
                                                    </table>
                                                    <Pagination
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={reverseTab.length}
        pageSize={PageSize}
        onPageChange={page => setCurrentPage(page)}
      />
                       </div>
                    </div>
                    </div>
                </div>
            </div>
            <footer align = "center" style={{marginBottom: '-500px;'}}>
    <span style={{color: '#070C29'}}>
© Copyright 2016 - 2021 <a href = "https://sofmusic.herokuapp.com" 
className = "smlink" target="_blank">
    sofmusic.herokuapp.com</a> | Made with <img src="../assetsAdmin/images/heartbeat.gif" 
    style={{width: '20px'}}/> by Sofien Ressaissi
</span>
<style>
{`\
        .smlink {\
          color: #070C29;\
        }\
      `}
      {`\
        .smlink:hover {\
          color: #070C29;\
        }\
      `}
</style>
</footer>
        </div>
        
    </div>
    
    <script type="text/javascript" src="../assetsAdmin/js/jquery/jquery.min.js"></script>
    <script type="text/javascript" src="../assetsAdmin/js/jquery-ui/jquery-ui.min.js "></script>
    <script type="text/javascript" src="../assetsAdmin/js/popper.js/popper.min.js"></script>
    <script type="text/javascript" src="../assetsAdmin/js/bootstrap/js/bootstrap.min.js "></script>
    <script type="text/javascript" src="../assetsAdmin/pages/widget/excanvas.js "></script>
    <script src="../assetsAdmin/pages/waves/js/waves.min.js"></script>
    <script type="text/javascript" src="../assetsAdmin/js/jquery-slimscroll/jquery.slimscroll.js "></script>
    <script type="text/javascript" src="../assetsAdmin/js/modernizr/modernizr.js "></script>
    <script type="text/javascript" src="../assetsAdmin/js/SmoothScroll.js"></script>
    <script src="../assetsAdmin/js/jquery.mCustomScrollbar.concat.min.js "></script>
    <script type="text/javascript" src="../assetsAdmin/js/chart.js/Chart.js"></script>
    <script src="https://www.amcharts.com/lib/3/amcharts.js"></script>
    <script src="../assetsAdmin/pages/widget/amchart/gauge.js"></script>
    <script src="../assetsAdmin/pages/widget/amchart/serial.js"></script>
    <script src="../assetsAdmin/pages/widget/amchart/light.js"></script>
    <script src="../assetsAdmin/pages/widget/amchart/pie.min.js"></script>
    <script src="https://www.amcharts.com/lib/3/plugins/export/export.min.js"></script>
    <script src="../assetsAdmin/js/pcoded.min.js"></script>
    <script src="../assetsAdmin/js/vertical-layout.min.js "></script>
    <script type="text/javascript" src="../assetsAdmin/pages/dashboard/custom-dashboard.js"></script>
    <script type="text/javascript" src="../assetsAdmin/js/script.js "></script>
            </body>
        </html>
            </> : <>
            <html>
        <head>
          <title>Something went wrong!</title>
        </head>
        <body>
        <div align = "center">
          </div>
          
        </body>
        <div align = "center">
          <br/><br/><br/><br/><br/><br/><br/><br/><br/>
          <br/><br/>
          <span style={{color: '#ffffff', fontFamily: 'Mistral', fontWeight: 'bold', fontSize: '100px'}}>SoF</span><br/>
          <h2 style={{color: '#ffffff', fontFamily: 'Arial'}}>Oops! Something went wrong!</h2><br/>
        </div>
        <style>
        {document.body.style.backgroundColor = "#9E002B"}
        </style>
      </html>
            </>
        }
        
        </>
    );

}