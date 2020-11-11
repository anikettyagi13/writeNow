import React,{useEffect, useState}from 'react'
import { NavLink } from 'react-router-dom';
import { withFirebaseHOC } from '../../firebase';
import Login from '../Login/Login'



function Setting({firebase}){
    const [loginShow,setLoginShow] = useState(false)
    const [user,setUser] = useState(null)
    useEffect(()=>{
        isLoggedIn()
    })
    const isLoggedIn=async()=>{
        const user = await firebase.isLoggedIn()
        if(user){
            setUser(user)
            setLoginShow(false)
        }else{
            setLoginShow(true)
        }
    }
    const logout=async()=>{
        await firebase.signout();
        window.location.href='/'
    }
    
    let SavedClick=''
    return(
        <div>
              {loginShow?
              <div style={{width:'100vh'}}><div style={{top:'50px',width:'100%',height:'55px',background: '#222222',boxShadow: '0 0 24px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',position:'fixed',display:'flex',justifyContent:'flex-end',alignItems:'center'}} ><div style={{marginRight:'30px'}} className="border_wrap1"><button style={{float:'right',padding:'10px 20px'}} className="edit_click_button" onClick={()=>{setLoginShow(false)}}>Close</button></div> </div><Login /></div>
            :
        <div style={{height:'100vh',width:'100vw'}}>
            <NavLink to="/saved" style={{display:'none'}} ref={(input)=>SavedClick=input} ></NavLink>
            <div className="setting_options" style={{color:'#098dba'}} onClick={()=>{SavedClick.click()}}>
                Saved
            </div>
            <div className="setting_options" style={{color:'#098dba'}} onClick={()=>{logout()}}>
                Logout
            </div>
        </div>
        }
        </div>
    )
}
export default withFirebaseHOC(Setting) 