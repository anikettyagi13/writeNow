import React, { useEffect,useState } from 'react'
import { NavLink } from 'react-router-dom'
import { withFirebaseHOC } from '../../firebase'
import Login from '../Login/Login'


function Notification(props){
    const [notification,setNotification] = useState([])
    const [no,setNo]=useState([])
    const [loading,setLoading]=useState(false)
    const [loginShow,setLoginShow]=useState(false)
    useEffect(()=>{
        if(props.notification.length===0){
            getNotifications();
        }else{
            setNotification(props.notification)
        }
    },[1])
    const getNotifications=async()=>{
        if(props.user){
            let noti = await props.firebase.getNotifications(props.user.uid)
            noti = noti.data()
            setNo(noti.notification)
            let k = noti.notification.slice(0,notification.length+10)
            setNotification(k)
            setTimeout(() => {
                setLoading(false)
            }, 3000);
        }else{
            setLoginShow(true)
            setLoading(false)
        }
    }
    const showingNoti=(noti)=>{
        if(!noti){
            noti=[...no]
        }
        let k = noti.slice(0,notification.length+10)
        setNotification(k)
    }
    let notificationBlock=[]
    return(
        <div style={{height:'100%',width:'100%',display:'flex',justifyContent:'center',alignContent:'center',alignItems:'center',backgroundColor:'#ddd'}}>
             {loading?
             <div className="loading"></div>:
             <div style={{width:'100%',height:'100%'}}>
             {loginShow?
              <div style={{width:'100vh'}}><Login /></div>
              :
              <div style={{height:'100%',width:'100%',display:'flex',justifyContent:'center',alignContent:'center',alignItems:'center',backgroundColor:'#ddd'}}>
            <div className="notification" style={{overflowY:'auto'}}>
                {notification.length===0?
                <div style={{margin:'auto',width:'100%'}}>
                    <p style={{margin:'auto',textAlign:'center',color:'#ddd',fontSize:'18px',marginBottom:'20px'}}>NO MORE NOTIFICATION FOUND</p>
                </div>
                :
                <div>
                {notification.map((notification,index)=>{
                    return(
                        <div onClick={()=>{notificationBlock[index].click()}} key={index} className="noti_block">
                        
                        <div  className="name"> <span>{notification.name}</span></div>
                        <NavLink to={`/blog/${notification.uid}`} ref={(input)=>{notificationBlock[index]=input}} />
                        <div className="notification_in">
                            {notification.notification} 
                        </div>
                        <span className="title">{notification.title.substring(0,50)}</span>
                        {notification.type==="blog"?<span className="material-icons notification_icon"  >amp_stories</span>:<span className="material-icons notification_icon">notes</span>}
                        </div>
                    )
                })}
                </div>
                }
                {notification.length===no.length?<p style={{margin:'auto',textAlign:'center',color:'#ff0033',fontSize:'18px'}}>NO MORE NOTIFICATION FOUND</p>:null}
                <br></br>
                <div className="profileButton">
                    <button onClick={()=>{showingNoti()}}>Load More</button>
                </div>
                <div style={{height:'40px'}}></div>
            </div>
            </div>
        }
             </div>
             }
        </div>
    )
}

export default withFirebaseHOC(Notification)