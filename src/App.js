import './App.css';
import React, { Suspense, lazy, useState, useEffect } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Axios from "axios";
import { useLoading, BallTriangle } from '@agney/react-loading';
import AdminContext from './context/AdminContext';

const HomeView = lazy(() => import("./pages/homepage"));
const LoginView = lazy(() => import("./pages/loginPage"));
const AddReleaseView = lazy(() => import("./pages/addRelease"));
const AllReleasesView = lazy(() => import("./pages/allReleases"));
const AddVideoView = lazy(() => import("./pages/addVideo"));
const AllVideosView = lazy(() => import("./pages/allVideos"));
const AllMessages = lazy(() => import("./pages/messages"));
const AllFeedbacks = lazy(() => import("./pages/feedbacks"));

function App() {
  const { containerProps, indicatorEl } = useLoading({
    loading: true,
    indicator: <BallTriangle width="50" color="#9E002B"/>,
  });
  const [adminData, setAdminData] = useState({
    token: undefined,
    admin: undefined
  });
  useEffect(() => {
    const checkLoggedIn = async () => {
    let token = localStorage.getItem("auth-token");
    if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
    }
    const tokenRes = await Axios.post(
        "https://sof-music-auth-backend.herokuapp.com/admin/tokenIsValid", 
        null, {headers: {"x-auth-token": token}}
    );
    if (tokenRes.data) {
        const adminRes = await Axios.get("https://sof-music-auth-backend.herokuapp.com/admin/",
            {headers: {"x-auth-token": token},
        });
        setAdminData({
            token,
            admin: adminRes.data
        })
    }
    }
    checkLoggedIn();
}, []);

useEffect(() => {
  const data = localStorage.getItem('adminData');
  if (data === null) {
    localStorage.setItem('adminData', '{}');
  } else {
    setAdminData(JSON.parse(data));
  }
}, []);
useEffect(() => {
  window.localStorage.setItem('adminData', JSON.stringify(adminData));
}, [adminData]);

  return (
    <>
      <BrowserRouter>
        <AdminContext.Provider value={{adminData, setAdminData}}>
          <React.Fragment>
          <Suspense fallback={
            <div align = "center">
              <section {...containerProps}>{indicatorEl}</section></div>}>
                <Switch>
                  <Route exact path="/admin" component={HomeView} />
                  <Route exact path="/admin/login" component={LoginView} />
                  <Route exact path="/admin/new-release/add" component={AddReleaseView} />
                  <Route exact path="/admin/releases" component={AllReleasesView} />
                  <Route exact path="/admin/new-video/add" component={AddVideoView} />
                  <Route exact path="/admin/videos" component={AllVideosView} />
                  <Route exact path="/admin/messages" component={AllMessages} />
                  <Route exact path="/admin/feedbacks" component={AllFeedbacks} />
                  {
                    adminData.admin !== "{}" ? 
                    <>
                      <Redirect from="/" to="/admin" />
                    </> : <>
                      <Redirect from="/" to="/admin/login" />
                    </>
                  }
                </Switch>
          </Suspense>
          </React.Fragment>
        </AdminContext.Provider>
      </BrowserRouter>
    </>
  );
}

export default App;
