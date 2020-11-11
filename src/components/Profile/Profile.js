import React, { useEffect, useState,useCallback } from 'react'
import { withFirebaseHOC } from '../../firebase'
import ProfileDumb from './ProfileDumb'
import Error from '../error/Error'

let donkeyKong =''
function Profile(props){
    const [userData,setUserData]= useState({})
    const [loading,setLoading] = useState(true)
    const [blogs,setBlogs] = useState([])
    const [imageSrc,setImageSrc] = useState(null)
    const [editImage,setEditImage] = useState(false)
    const [isSameProfile,setIsSameProfile]=useState(false)
    const [useruid,setUseruid] = useState(null)
    const [isLoading,setIsLoading]=useState(false)
    const [createdAt,setCreatedAt]=useState(null)
    const [likedProfile,setLikedProfile]=useState(false)
    const [hasMore,setHasMore] = useState(true)
    const [error,setError] = useState(false)
    document.title="BLOGGINGISTA"
    useEffect(()=>{
        let location = window.location.href.split('/')[4]
        if(props.loggedUser&&(!location||location===props.loggedUser.uid)){
            setLoading(false)
            setIsSameProfile(true)
            setUseruid(props.loggedUser.uid)
            setUserData(props.loggedUser);
            setBlogs(props.profileBlogs)
            setCreatedAt(props.profileBlogs[props.profileBlogs.length-1].createdAt)

        }else{
            getUserInfo(location)
        }
    },[1])
    const  getUserInfo=async(location)=>{
        try{
            if(isLoading!==true){
                setIsLoading(true)
                let uid = location
                let u = await props.firebase.isLoggedIn()
                setUseruid(u.uid)
                donkeyKong=u.uid
            if(!location){
                uid = u.uid
            }
            let user = await props.firebase.getUserInfo(uid)
            user = user.data()
            if(!user){
                setError(true)
                setIsLoading(false)
            }else{
                let likedProfile = await props.firebase.ifUserFollows(uid,u.uid)
                likedProfile=likedProfile.data()
                if(likedProfile){
                    setLikedProfile(true)
                }
                await getUserBlogs(user.uid)
                if(uid===u.uid){
                    setIsSameProfile(true)
                    props.setLoggedUser(user)
                }let k=user.uid
                setUserData(user);
                }
            }
            
    }catch(e){
        console.log(e)
    }finally{
        setLoading(false)
    }
    }
    const likeProfile=async()=>{
        let location = window.location.href.split('/')[4]
        await props.firebase.likeProfile(useruid,location)
        setLikedProfile(true)
        let u={...userData}
        u.likes+=1
        setUserData(u)
    }
    const dislikeProfile=async()=>{
        let location = window.location.href.split('/')[4]
        await props.firebase.dislikeProfile(useruid,location)
        setLikedProfile(false)
        let u={...userData}
        u.likes-=1
        setUserData(u)
    }
    const getUserBlogs=async(uid)=>{
        if(hasMore){
            let location = window.location.href.split('/')[4]
            let k=uid
            if(location){
                k=location
            }else if(!uid && !location){
                k=useruid
            }
            let blogsData = await props.firebase.getUserBlogs(k,createdAt);
            let newBlog = [...blogs];
            if(blogsData.length<8){
                setHasMore(false)
            }
            if(blogsData.length>0){
                setCreatedAt(blogsData[blogsData.length-1].createdAt)
            }
            newBlog.push(...blogsData);
            setBlogs(newBlog)
            setIsLoading(false)
            if(donkeyKong===location||!location){
                props.setProfileBlogs(newBlog)
            }
        }
    }
    function readFile(file) {
        return new Promise(resolve => {
          const reader = new FileReader()
          reader.addEventListener('load', () => resolve(reader.result), false)
          reader.readAsDataURL(file)
    })
    }
    const changeProfileImage=async(image)=>{
        let imageDataUrl = await readFile(image)
        setEditImage(true)
        setImageSrc(imageDataUrl)
    }
    
    return(
        <div style={{height:'100vh',widht:'100vw',overflowY:'hidden',overflowX:'hidden'}}>
        {loading?<div style={{display:'flex',alignContent:'center',alignItems:'center',height:'100vh'}}> <div className="loader"></div></div>
        :
        <div style={{height:'100vh',width:'100vw'}}>
            {error?
          <Error errorName="profile" />  
        :
        <ProfileDumb 
        userData = {userData}
        blogs = {blogs}
        changeProfileImage={changeProfileImage}
        editImage={editImage}
        imageSrc={imageSrc}
        firebase={props.firebase}
        isSameProfile={isSameProfile}
        setEditImage={setEditImage}
        useruid={useruid}
        isLoading={isLoading}
        error={error}
        getUserBlogs={getUserBlogs}
        hasMore={hasMore}
        likedProfile={likedProfile}
        likeProfile={likeProfile}
        dislikeProfile={dislikeProfile}
        />}
        
</div>  
}  
        </div>
        
    )
}

export default withFirebaseHOC(Profile)