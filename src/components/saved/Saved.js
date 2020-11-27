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
            <div style={{height:'100vh',width:'100vw',overflowY:'auto'}}>
            <div className="home" style={{overflowY:'visible'}}>
                {blogs.map((blog,index)=>{
                return(
                    <div className="home_blog_show" key={index}>
                        <div style={{position:'absolute',width:'100%'}} >
                        <span style={{position: 'absolute',top:'0px',display:'flex',margin:'auto',color:'#212121',fontWeight:'bold',margin:'10px',justifyContent:'center',textAlign:'center',fontSize:'16px'}}>{blog.title.toUpperCase().substring(0,20)}{blog.title.length>20?<spnan>...</spnan>:null}</span>
                        <div style={{position:'absolute',right:'10px',fontSize:'10px',textAlign:'center',display:'flex',justifyContent:'center'}}>
                        <span style={{position:'absolute',top:'10px',fontSize:'10px',right:'10px'}}>{blog.views}</span>
                        <span className="material-icons" style={{position:'absolute',top:'18px',right:'5px',fontSize:'16px'}}>visibility</span>
                        </div>
                        <div style={{height:'350px',backgroundColor:'#ddd',width:'100%'}} className="image_home_blog"></div>
                        <img src={blog.titleImage}  style={{position:'absolute',top:'0px',width:'100%'}} className="image_home_blog"></img>
                        <span style={{lineHeight:'1.6',fontSize:'15px',display:'block',color:'#212121',fontWeight:'bold',backgroundColor:'#fafafa',height:'120px',overflowY:'auto',position:'absolute',top:'340px',width:'100%'}} className="showSomeDataBlog">{showBlogData(blog.blogData)}</span>
                        <div  style={{top:'270px',left:'60%',position:'absolute',display:'flex',justifyContent:'center',margin:'auto',textAlign:'center'}} className="border_wrap show_sometime">
                        <NavLink to={`/blog/${blog.postUid}`} ref={input => inputElement[index] = input} style={{display:'none'}}></NavLink>
                        <button className="edit_click_button " onClick={()=>inputElement[index].click()}>Show Blog</button>
                        </div>
                        <div  style={{top:'270px',left:'60%',position:'absolute',display:'flex',justifyContent:'center',margin:'auto',textAlign:'center',backgroundColor:'#ddd',width:'100px',height:'70px'}} className="showNow"></div>
                        </div>
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