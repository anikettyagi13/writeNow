import React,{Component,useEffect,useState} from 'react'

import {BrowserRouter as Router, Switch, Route, NavLink, Redirect} from 'react-router-dom';
import Blog  from '../blog/Blog';
import { withFirebaseHOC } from "../../firebase/index";
import * as firebase from 'firebase';
import Login from '../Login/Login';
import Signup from '../Signup/Signup';
import ShowBlog from '../showBlog/ShowBlog';
import Home from '../home/Home';
import Profile from '../Profile/Profile';
import Setting from '../setting/Setting'
import Saved from '../saved/Saved'
import Notification from '../notification/Notification'
import Error from '../error/Error'



const Navigation=()=>{
  const [user,setUser] = useState();
  const [savedBlogs,setSavedBlogs]=useState([])
  const [homeBlogs,setHomeBlogs]=useState([])
  const [profileBlogs,setProfileBlogs]=useState([])
  const [loggedUser,setLoggedUser]=useState(null)
  const [loading,setLoading] = useState(true)
  const [notification,setNotification]=useState([])
    useEffect(()=>{
        const loggedIn =  firebase.auth().onAuthStateChanged(onAuthStateChanged);
        return loggedIn;
    },[user])
    function onAuthStateChanged(user) {
      if(user&&user.emailVerified){
        setUser(user);
      }else if(!user){
        setUser(null)
      }
      setLoading(false);
  }

    return (
      <Router>
          {loading?<div style={{display:'flex',alignContent:'center',alignItems:'center',height:'100vh'}}> <div className="loader"></div></div> :
          <div style={{height:'100vh',overflowX:'hidden'}}>
              <div style={{width:'100vw',height:'100vh'}}>
              <nav className="navigation">
                <NavLink exact to={'/'} activeClassName="current-navigation" activeStyle={{color:'#121212'}} > Home </NavLink>
                {user&&user.emailVerified?
                <>
                <NavLink to={'/write-blog'} activeClassName="current-navigation" activeStyle={{color:'#121212'}}>write Blog</NavLink>
                <NavLink to={'/profile'} activeClassName="current-navigation" activeStyle={{color:'#121212'}} >Profile</NavLink>
                <NavLink to={'/setting'} activeClassName="current-navigation" activeStyle={{color:'#121212'}} >Setting</NavLink>
                </>
                :
                <>
                <NavLink to={'/login'} activeClassName="current-navigation" activeStyle={{color:'#121212'}}>login</NavLink>
                <NavLink to={'/signup'} activeClassName="current-navigation" activeStyle={{color:'#121212'}} >signup</NavLink>
                </>

                }
                
              </nav>
                <Switch>
                  <Route exact path='/' render={ props=> <Home homeBlogs={homeBlogs} setHomeBlogs={setHomeBlogs} /> }/>
                  <Route path='*/login' component={Login} />
                  <Route path='*/signup' component={Signup} />  
                  <Route path='/setting' render={ props=> <Setting user={user} /> } />
                  <Route path='/profile'  render={ props=> <Profile profileBlogs={profileBlogs} setProfileBlogs={setProfileBlogs} loggedUser={loggedUser} setLoggedUser={setLoggedUser} /> } />
                  <Route path='/profile/*'  render={ props=> <Profile user={user} /> } />
                  <Route path='/write-blog'  render={ props=> <Blog {...props} user={user} /> } />
                  <Route path='/notification'  render={ props=> <Notification user={user} notification={notification} setNotification={setNotification} /> } />
                  <Route path="/saved" render={props=><Saved savedBlogs={savedBlogs} setSavedBlogs={setSavedBlogs} />} />
                  <Route path='/blog/*' render={ props=> <ShowBlog users={user} /> } />
                  <Route path='/blog' render={ props=> <Error users={user} /> } />
                  <Route path='/login' component={Login} />
                  <Route path='/signup' component={Signup} />
                </Switch>
            </div>
        </div>
        }
        
      </Router>
  )
}
  
  class Contact extends Component {
    render() {
      return (
          <div>
            <h2>Contact</h2>
          </div>
      );
    }
  }
  
  


export default withFirebaseHOC(Navigation)
  