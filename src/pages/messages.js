import React, { useContext, useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import Axios from "axios";
import { toast } from 'toast-notification-alert';
import Favicon from 'react-favicon';
import AdminContext from '../context/AdminContext';
import { FaDoorOpen, FaFileVideo, FaFolder, FaFolderPlus, FaPen, FaStar, FaVideo } from 'react-icons/fa';
import Swal from 'sweetalert2';
import emailjs from "emailjs-com";
import Pagination from '../pagination/pagination';

let PageSize = 6;

export default function Messages() {

    const { adminData, setAdminData } = useContext(AdminContext);
    const [currentPage, setCurrentPage] = useState(1);
    let [searchItem, setSearchItem] = useState('');
    const history = useHistory();
    let [allMsgs, setAllMsgs] = useState([]);
    let reverseTab = [];
      for (let i = allMsgs.length - 1; i >=0; i--) {
        reverseTab.push(allMsgs[i]);
      }
    let [nbUM] = useState(0);
    let [cursor, setCursor] = useState("pointer");
    let [bgColor, setBgColor] = useState("red");
    let [disDel, setDisDel] = useState(false);
    useEffect(async() => {
        const result_msgs = await Axios.get('https://sofmusic-backend.herokuapp.com/user/allMsgs');
        setAllMsgs(result_msgs.data);
      },[]);
      allMsgs.map((itemu,index)=>{
        itemu.status === false ? nbUM = nbUM + 1 : <></>
      });
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
      const currentTableData = useMemo(() => {
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
    const markAsRead = async (msgId) => {
        try {
            await Axios.put(
                `https://sofmusic-backend.herokuapp.com/user/markasread/${msgId}`
            );
            toast.show({title: 'Message Read',
            position: 'topright', type: 'info'});
            setTimeout(function(){
                window.location.reload();
             }, 1000);
        } catch (err) {
            toast.show({title: err.response.data.msg, position: 'topright', type: 'alert'});
        }
    }

    const markAsUnread = async (msgId) => {
        try {
            await Axios.put(
                `https://sofmusic-backend.herokuapp.com/user/markasunread/${msgId}`
            );
            toast.show({title: 'Message Not Read',
            position: 'topright', type: 'warn'});
            setTimeout(function(){
                window.location.reload();
             }, 1000);
        } catch (err) {
            toast.show({title: err.response.data.msg, position: 'topright', type: 'alert'});
        }
    }
    const deleteMessage = async (msgId) => {
        try {
                await Axios.delete(
                    `https://sofmusic-backend.herokuapp.com/user/delete-msg/${msgId}`
                );
                toast.show({title: 'Message Deleted!',
            position: 'topright', type: 'warn'});
            setCursor("default");
            setBgColor("rgba(255, 0, 0, 0.4)");
            setDisDel(true);
            setTimeout(function(){
                window.location.reload();
             }, 1000);
        } catch (err) {
            toast.show({title: err.response.data.msg, position: 'topright', type: 'alert'});
        }
    }
    const replyToUser = (e, id, fullName, email, content) => {
        e.preventDefault();
        Swal.fire({
            title: 'Reply to '+fullName,
            html: `
            <html>
            <head>
            </head>
            <body>
            <form>
            <label style="font-size: 13px;"><b>Email to:</b></label>
            <input type = "email" name="email" value='${email}' placeholder='${email}' class="swal2-input"
            id="email" style="width:200px;height: 30px;font-size: 13px;" disabled/><br/><br/>
            <label style="font-size: 13px;"><b>Message of ${fullName}:</b></label><br/>
            <textarea id="content" value='${content}' name="content" placeholder = 'Type your message'
            class="swal2-input" style="height: 120px; width: 300px;" disabled></textarea><br/><br/>
            <label style="font-size: 13px;"><b>Your Reply:</b></label><br/>
            <textarea id="myReply" name="myReply" placeholder = 'Type your reply'
            class="swal2-input" style="height: 120px; width: 300px;"></textarea>
            </form>
            </body>
            </html>
            `,
            /* didClose: () => {
                window.location.reload();
            }, */
            didOpen: () => {
                Swal.getPopup().querySelector(`#email`).value = email;
		        Swal.getPopup().querySelector('#content').value = content;
            },
            confirmButtonText: 'Reply',
            focusConfirm: false,
            preConfirm: () => {
                const myReply = Swal.getPopup().querySelector('#myReply').value;
                if (!myReply) {
                    toast.show({title: `Your reply field is empty!`, position: 'topright', type: 'alert'});
                }
                return {myReply: myReply}
            }
        }).then((result) => {
            try {
                e.preventDefault();
                var templateParams = {
                    email: email,
                    myReply: result.value.myReply,
                    content: content,
                    fullName: fullName
                };
        emailjs.send('gmail', 'template_zz6z1z4', templateParams, 'user_jnSanFBgbesiAS51FeArr')
            .then((result) => {
                console.log(result.text);
            }, (error) => {
                console.log(error.text);
            });
        toast.show({title: "Your reply has been sent successfully.", 
        position: 'topright', type: 'info'});
        Axios.put(
            `https://sofmusic-backend.herokuapp.com/admin/messagereplied/${id}`
        );
        setTimeout(function(){
            window.location.reload();
         }, 1000);
            } catch (err) {
                console.log(err);
            }
        })
    }
    return (
        <>
        {
            adminData.admin ?
            <>
            <html>
            <head>
                <title>SoF Music - All Messages</title>
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
                                          <li className="breadcrumb-item"><a>All Messages</a>
                                          </li>
                                      </ul>
                                  </div>
                                  
                              </div>
                          </div>
                      </div>
                    </div>
                    <style>
                    {`\
        .searchItem {\
          border-radius: 10px;\
          height: 30px;\
          width: 300px;\
          margin-right: 67px;\
        }\
      `}
                    </style>
                    <div className="card">
                        <div className="card-header">
                           <h5>All Messages</h5>
                        </div>
                        <div align = "right">
                            {
                                reverseTab.length > 0 ?
                                <input type="text"
                        placeholder="Search Message" className="searchItem"
                   onChange={(e)=>setSearchItem(e.target.value)}/> : 
                                 <></>
                            }
                            
                        </div>
                        <div className="card-block table-border-style">
                            <div className="table-responsive">
                            <table className="table table-hover">
                                                        {
                                                            reverseTab.length > 0 ?
                                                            <>
                                                            <thead>
                                                            <tr>
                                                                <th>From</th>
                                                                <th>Message</th>
                                                                <th>Replied</th>
                                                                <th>Action</th>
                                                            </tr>
                                                        </thead>
                                                            </> :
                                                            <>
                                                            <>You Have No Messages.</>
                                                            </>
                                                        }
                                                        <tbody>
                                                            {
                                                                currentTableData.filter((item=>{
                                                                    if (searchItem === "") {
                                                                        return item
                                                                    }else if(item.fullName.toLowerCase().includes(searchItem.toLowerCase())
                                                                            ||item.email.toLowerCase().includes(searchItem.toLowerCase())
                                                                            ||item.content.toLowerCase().includes(searchItem.toLowerCase())){
                                                                        return item
                                                                    }
                                                                })).map(itemm => {
                                                                    return(
                                                                    <tr key={itemm._id}>
                                                                    <td>
                                                                        {
                                                                            itemm.status === true ?
                                                                            <>
                                                                            {itemm.fullName}
                                                                    <br/>
                                                                    {itemm.email}
                                                                            </> : <>
                                                                            <b style={{color: 'black'}}>
                                                                            {itemm.fullName}
                                                                    <br/>
                                                                    {itemm.email}
                                                                            </b>
                                                                            </>
                                                                        }
                                                                        </td>
                                                                    <td>
                                                                    {
                                                                            itemm.status === true ?
                                                                            <span title={itemm.content}>
                                                                            {itemm.content}
                                                                            </span> : <span title={itemm.content}>
                                                                            <b style={{color: 'black'}}>{itemm.content}</b>
                                                                            </span>
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                    {
                                                                            itemm.status === true && itemm.replied === true ?
                                                                            <span>
                                                                            Yes
                                                                            </span> : itemm.status === false && itemm.replied === true ?
                                                                             <span>
                                                                            <b style={{color: 'black'}}>Yes</b>
                                                                            </span> : <></>
                                                                        }
                                                                    {
                                                                            itemm.status === true && itemm.replied === false ?
                                                                            <span>
                                                                            No
                                                                            </span> : itemm.status === false && itemm.replied === false ?
                                                                             <span>
                                                                            <b style={{color: 'black'}}>No</b>
                                                                            </span> : <></>
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            itemm.status === false && itemm.replied === false ?
                                                                            <span style={{color: '#007bff', cursor: 'pointer', fontWeight: 'bold'}} onClick={() => markAsRead(itemm._id)}>Mark as read</span> : <></>
                                                                        }
                                                                        {
                                                                            itemm.status === true && itemm.replied === false ?
                                                                            <span style={{color: '#540300', cursor: 'pointer', fontWeight: 'bold'}} onClick={() => markAsUnread(itemm._id)}>Mark as unread</span> : <></>
                                                                        } {
                                                                            itemm.status === true && itemm.replied === false ?
                                                                            <button type="button"
                                                                            style={{backgroundColor: '#007bff',
                                                                            color: 'white', fontWeight: 'bold', 
                                                                            borderRadius: '5px', border: 'none', cursor: 'pointer'}}
                                                                            onClick={(e) => replyToUser(e, itemm._id, itemm.fullName, itemm.email, itemm.content)}>
                                                                            Reply
                                                                            </button> : <></>
                                                                        } {
                                                                            itemm.status === true && itemm.replied === true ?
                                                                            <button type="button" disabled title="Already replied"
                                                                            style={{backgroundColor: 'rgba(0, 128, 0, 0.4)',
                                                                            color: 'white', fontWeight: 'bold', 
                                                                            borderRadius: '5px', border: 'none'}}
                                                                            onClick={(e) => replyToUser(e, itemm._id, itemm.fullName, itemm.email, itemm.content)}>
                                                                            Message Replied <FaPen/>
                                                                            </button> : <></>
                                                                        } {
                                                                            itemm.status === false ?
                                                                            <button type="button" disabled title="Message must be read to reply"
                                                                            style={{backgroundColor: 'rgba(0, 123, 255, 0.4)',
                                                                            color: 'white', fontWeight: 'bold', 
                                                                            borderRadius: '5px', border: 'none'}}
                                                                            onClick={(e) => replyToUser(e, itemm._id, itemm.fullName, itemm.email, itemm.subject, itemm.content)}>
                                                                            Reply
                                                                            </button> : <></>
                                                                        } {
                                                                                itemm.status === true ?
                                                                                <>
                                                                                <button type="button"
                                                                            style={{backgroundColor: bgColor,
                                                                            color: 'white', fontWeight: 'bold', 
                                                                            borderRadius: '5px', border: 'none', cursor: cursor}} disabled={disDel}
                                                                            onClick={() => deleteMessage(itemm._id)}>
                                                                            Delete
                                                                            </button>
                                                                                </> : <></>
                                                                            }
                                                                            {
                                                                                itemm.status === false ?
                                                                                <>
                                                                                <button type="button" title="Unread message can't be deleted"
                                                                            style={{backgroundColor: 'pink',
                                                                            color: 'white', fontWeight: 'bold', 
                                                                            borderRadius: '5px', border: 'none'}} disabled
                                                                            onClick={() => deleteMessage(itemm._id)}>
                                                                            Delete
                                                                            </button>
                                                                                </> : <></>
                                                                            }
                                                                    </td>
                                                                    </tr>
                                                                    )})}
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
?? Copyright 2016 - 2021 <a href = "https://sofmusic.herokuapp.com" 
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