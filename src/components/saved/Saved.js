import React, { useEffect, useState } from 'react'
import { withFirebaseHOC } from '../../firebase'
import Login from '../Login/Login'
import {NavLink} from 'react-router-dom'

function Saved(props){
    const [blogs,setBlogs]=useState([])
    const [loginShow,setLoginShow] = useState(false)
    const [user,setUser] = useState("")
    const [moreData,setMoreData] = useState(true)
    const [isLoading,setIsLoading] = useState(false)
    const [savedAt,setSavedAt] = useState(null)
    useEffect(()=>{
        if(props.savedBlogs.length===0){
            getData()
        }else{
            async function yo(){
                let userk = await props.firebase.isLoggedIn()
                if(userk){
                    setLoginShow(false)
                    setUser(userk.uid)
                    setBlogs(props.savedBlogs)
                    setSavedAt(props.savedBlogs[props.savedBlogs.length-1].savedAt)
                }else{
                    setLoginShow(true)
                }    
            }
            yo()
        }
    },[])
    const getData=async()=>{
        let userk = await props.firebase.isLoggedIn()
        if(userk){
            setLoginShow(false)
            setUser(userk.uid)
            await getSavedBlogs(userk.uid)
        }else{
            setLoginShow(true)
        }
    }
    const getSavedBlogs=async(uid)=>{
        try{
            if(!isLoading&&moreData){
                setIsLoading(true)
                if(!uid){
                    uid = user
                }
                var blogsDoc = await props.firebase.getSavedBlogs(uid,savedAt);
                if(blogsDoc.length===0){
                    setMoreData(false)
                    setIsLoading(false)
                    return
                }
                if(blogsDoc.length<8){
                    setMoreData(false)
                    let newBlogs = [...blogs]
                    newBlogs.push(...blogsDoc)
                    setBlogs(newBlogs)
                    setIsLoading(false)
                    props.setSavedBlogs(newBlogs);
                    setSavedAt(blogsDoc[blogsDoc.length-1].savedAt)
                }else{
                    let newBlogs = [...blogs]
                    newBlogs.push(...blogsDoc)
                    setBlogs(newBlogs)
                    setIsLoading(false)
                    props.setSavedBlogs(newBlogs);
                    setSavedAt(blogsDoc[blogsDoc.length-1].savedAt)
                }
            }
        }catch(e){
            
            console.log(e)
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
    return(
        <div>
            {loginShow?
              <div style={{width:'100vh'}}><div style={{top:'50px',width:'100%',height:'55px',background: '#222222',boxShadow: '0 0 24px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',position:'fixed',display:'flex',justifyContent:'flex-end',alignItems:'center'}} ><div style={{marginRight:'30px'}} className="border_wrap1"><button style={{float:'right',padding:'10px 20px'}} className="edit_click_button" onClick={()=>{setLoginShow(false)}}>Close</button></div> </div><Login /></div>
            :
            <div style={{backgroundColor:'#ddd',height:'100vh',width:'100vw',overflowY:'auto'}}>
            <div className="home" style={{overflowY:'visible',backgroundColor:'#ddd'}}>
                {blogs.map((blog,index)=>{
                return(
                    <div className="home_blog_show" key={index}>
                        <div style={{height:'300px',backgroundColor:'black',width:'300px'}} className="image_home_blog"></div>
                        <img src={blog.titleImage} className="image_home_blog" style={{position:'absolute',top:'0px'}}></img>
                        <span style={{margin:'10px',lineHeight:'1.6',marginTop:'-300px',fontSize:'18px',display:'block',color:'#fff',fontWeight:'bold',backgroundColor:'#505050',height:'290px'}}>{showBlogData(blog.blogData)}</span>
                        <div  style={{top:'240px',left:'180px',position:'absolute',display:'flex',justifyContent:'center',margin:'auto',textAlign:'center'}} className="border_wrap">
                        <NavLink to={`/blog/${blog.postUid}`} ref={input => inputElement[index] = input} style={{display:'none'}}></NavLink>
                        <button className="edit_click_button" onClick={()=>inputElement[index].click()}>Show Blog</button>
                        </div>
                        <div  style={{top:'240px',left:'180px',position:'absolute',display:'flex',justifyContent:'center',margin:'auto',textAlign:'center',backgroundColor:'black'}} className=" show_sometime"></div>
                        <span style={{position: 'absolute',bottom: '10px',display:'flex',margin:'auto',color:'#fff',fontWeight:'bold',margin:'10px',justifyContent:'center'}}>{blog.title.toUpperCase().substring(0,20)}...</span>
                    </div>
                )
            })}
            </div>
            {moreData?null:<div><p style={{margin:'auto',textAlign:'center',color:'#ff0033',fontSize:'18px'}}>NO MORE SAVED BLOG FOUND</p>
            <br />
            <p style={{margin:'auto',textAlign:'center',color:'#82b1ad',fontSize:'20px'}}>Read A Blog? <NavLink to="/">CLICK HERE</NavLink></p>
            </div>}
            <div className="profileButton" style={{marginBottom:'60px'}}>
                {isLoading?
            <button disabled={true} style={isLoading?{pointerEvents:'none'}:null}>Loading...</button>
            :
            <button onClick={()=>{getSavedBlogs()}} >Load More</button>
            }
            </div>
            {isLoading?
            <div className="loader"></div>
            :null            
            }
            </div>
            }
        </div>
    )
}

export default withFirebaseHOC(Saved) 