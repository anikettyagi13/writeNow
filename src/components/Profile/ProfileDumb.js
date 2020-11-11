import React, { useState } from 'react'
import {NavLink} from 'react-router-dom'
import ImageCropper from './ImageCropper'
import Login from '../Login/Login'
let notificationClick=''
function ProfileDumb(props){
    const [image,setImage]=useState(null)
    const [changeBio,setChangeBio] = useState(false)
    const [bioData,setBioData] = useState(props.userData.bio?props.userData.bio:'')
    const saveClick= async()=>{
        let data={
            bio:bioData
        }
        props.userData.bio=bioData;
        setChangeBio(false)
        await props.firebase.updateUserData(props.useruid,data)
    }
    const bioDataValueChange=(value)=>{
        if(value.length<=30){
            setBioData(value)
        }
    }
    const showBlogData = (data)=>{
        let character=''
        let i=0
        let charLeft=150;
        while (character.length<150&&data[i]){
            let u =''
            if(charLeft>data[i].split(':@@#!@#@#!@#@!#@#@$@')[4].length){
                u = data[i].split(':@@#!@#@#!@#@!#@#@$@')[4].substring(0,charLeft)+'/n';
            }else{
                u = data[i].split(':@@#!@#@#!@#@!#@#@$@')[4].substring(0,charLeft);
            }
            character+=character+u
            charLeft-=u.length
            i++;
        }
        character=character+"..."
        let k=character.split('/n')
        return k.map((data,index)=>{
            return(
                <span key={index}>
                    {data}
                    <br></br>
                </span>
            )
        })
    }
    let inputElement=[];
    let inputk=''
    let inputnav=''
    return(
        <div style={{height:'100vh',width:'100vw',overflowY:'scroll',overflowX:'hidden',backgroundColor:'#ddd'}}>
            {props.useruid?<div style={{height:'100vh',width:'100vw',overflowY:'scroll',overflowX:'hidden'}}> 
            {props.editImage?<ImageCropper imageSrc={props.imageSrc} uid={props.userData.uid} firebase={props.firebase} setImage={setImage} setEditImage={props.setEditImage} />
            :
            <div style={{overflowY:'auto',overflowX:'hidden'}}>
            <div style={{display:'flex',justifyContent:'center'}}>

            <div className="userInfo">
                <div className="profilePic">
                {image?<img src={image}></img>:
                <img src={props.userData.profilePic} />                
                }
                {props.isSameProfile?
                <div><NavLink to="/notification" style={{display:'none'}} ref={(input)=>{notificationClick=input}} />
                <button style={{backgroundColor:'#ddd',height:'50px',width:'50px',outline:'none',float:'right',right:'0px',marginRight:'10px',marginTop:'40px',position:'absolute',border:'0px',borderRadius:'25px'}} onClick={()=>{notificationClick.click()}}><span className="material-icons" style={{color:'red'}}>notifications_none</span></button>
                </div>
                :null
                }
                <NavLink to="/write-blog"  ref={input => inputnav = input} style={{display:'flex',justifyContent:'center',margin:'auto',display:'none'}}></NavLink>
                <input type="file" ref={input => inputk = input} onChange={(event)=>{props.changeProfileImage(event.target.files[0])}} accept=".jpg, .jpeg, .png" size="60" style={{display:'flex',justifyContent:'center',margin:'auto',display:'none'}}></input>
                
                {props.isSameProfile?<span className="material-icons" style={{marginTop:'80px',marginLeft:'-25px',color:'blue'}} onClick={()=>inputk.click()} >add_circle</span>:null}
                </div>
                   <p style={{textAlign:'center', textDecoration:'underline',marginTop:'6px',fontSize:'18px',fontWeight:'bold',marginBottom:'0px'}}>{props.userData.name}</p>
                <div className="userData">
                    <p>{props.userData.likes}<br></br><span style={{textDecoration:'underline',marginTop:'-2px'}}>Likes</span></p>
                    <p>{props.userData.bookmark}<br></br><span style={{textDecoration:'underline',marginTop:'-2px'}}>Bookmark</span></p>
                    <p>{props.userData.blogs}<br></br><span style={{textDecoration:'underline',marginTop:'-2px'}}>Blogs</span></p>
                </div>
                <div style={{textAlign:'center',margin:'auto',color:'#808080',fontWeight:'bold',height:'20px',fontSize:'18px',width:'60%',position:'relative',marginBottom:'10px'}}>
            {changeBio?<div style={{marginBottom:'20px'}}><input onChange={(event)=>{bioDataValueChange(event.target.value)}} value={bioData}></input><span>{bioData.length}/30</span></div>:
                   <p>{props.userData.bio}</p>
                }
                </div>
                <div className="profileButton">
                {props.isSameProfile?
                <>{!changeBio?
                    <button onClick={()=>{setChangeBio(true)}}>Edit Bio</button>:
                    <button onClick={()=>{saveClick()}}>Save</button>
                }
                </>:
                <div style={{width:'50%'}}>
                {props.likedProfile?
                <button style={{width:'100%'}} onClick={()=>{props.dislikeProfile()}}>DISLIKE PROFILE</button>
                :    
                <button onClick={()=>{props.likeProfile()}} style={{width:'100%'}}>LIKE PROFILE</button>
                }
                </div>
                }
                </div>
            </div>
            </div>
            <div>
            <div className="home" style={{height:'100%',width:'100vw'}}>
            {props.blogs.map((blog,index)=>{
                return(
                    <div className="home_blog_show" key={index}>
                        <div style={{height:'300px',backgroundColor:'black',width:'300px'}} className="image_home_blog"></div>
                        <img src={blog.titleImage} className="image_home_blog" style={{position:'absolute',top:'0px'}}></img>
                        <span style={{margin:'10px',lineHeight:'1.6',marginTop:'-300px',fontSize:'18px',display:'block',color:'#fff',backgroundColor:'#505050',height:'290px',fontWeight:'bold'}}>{showBlogData(blog.blogData)}</span>
                        <div  style={{top:'240px',left:'180px',position:'absolute',display:'flex',justifyContent:'center',margin:'auto',textAlign:'center'}} className="border_wrap">
                        <NavLink to={`/blog/${blog.postUid}`} ref={input => inputElement[index] = input} style={{display:'none'}}></NavLink>
                        <button className="edit_click_button" onClick={()=>inputElement[index].click()}>Show Blog</button>
                        </div>
                        <div  style={{top:'240px',left:'180px',position:'absolute',display:'flex',justifyContent:'center',margin:'auto',textAlign:'center',backgroundColor:'black'}} className=" show_sometime"></div>
                        <span style={{position: 'absolute',bottom: '10px',display:'flex',margin:'auto',color:'#808080',margin:'10px',justifyContent:'center',color:'#fff',fontWeight:'bold'}}>{blog.title.toUpperCase().substring(0,20)}...</span>
                    </div>
                )
            })}
            </div>
            </div>
            {props.hasMore?null:<div><p style={{margin:'auto',textAlign:'center',color:'#ff0033',fontSize:'18px'}}>NO BLOG FOUND</p></div>}
            <div style={{width:'100%'}}>
            <div className="profileButton" style={{marginBottom:'60px'}}>
                {props.isLoading?
            <button disabled={true} style={props.isLoading?{pointerEvents:'none'}:null}>Loading...</button>
            :
            <button onClick={()=>{props.getUserBlogs()}} >Load More</button>
            }
            </div>
            </div>
            {props.isLoading?
            <div className="loader"></div>
            :null            
            }     
            </div>
            
            }  
            </div>
            :<Login />}
        </div>
    )
}

export default ProfileDumb