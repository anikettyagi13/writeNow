import React, { useEffect, useState } from 'react'
import { withFirebaseHOC } from '../../firebase';
import {clearCheck} from '../../utils/utils'
import {NavLink} from 'react-router-dom'
import Login from '../Login/Login';
import Error from '../error/Error'

function ShowBlog({firebase}){
    let path = window.location.href;
    const postUID = path.split('/')[4];
    const [blogData,setBlogData] = useState([])
    const [fullBlog,setFullBlog] = useState({})
    const [likes,setLikes] = useState(0)
    const [noComments,setNoComments] = useState(0)
    const [Loading,setLoading] = useState(true)
    const [userData,setUserData] = useState(null)
    const [comments,setComments] = useState([])
    const [createdAt,setCreatedAt] = useState(null)
    const [liked,setliked] = useState(false)
    const [notifications,setNotification]=useState([])
    const [moreData,setMoreData]=useState(true)
    const [loggedUser,setLoggedUser] = useState(null)
    const [loginShow,setLoginShow]=useState(false)
    const [commentInput,setCommentInput] = useState("")
    const [loadMore,setLoadMore] = useState(false)
    const [savedBlog,setSavedBlog] = useState(false)
    const [error,setError] = useState(false)
    let inputnav=''
    let userName=''
    useEffect(()=>{
        async function getData(){
            var doc = await firebase.getBlogData(postUID)
            var data = doc.data();
            if(!data){
              setError(true)
              setLoading(false)
            }else{
              setFullBlog(data);
              let user = await firebase.getUserInfo(data.uid);
              let k = user.data()
              setNotification(k.notification?k.notification:[])
              // await getComments();
              setUserData(k);
              const loggedInUser=await firebase.isLoggedIn()
              if(loggedInUser){
                setLoggedUser(loggedInUser)
                let like=await firebase.likedABlog(data.postUid,loggedInUser.uid)
                let saved = await firebase.savedABlog(data.postUid,loggedInUser.uid)
                saved=saved.data()
                if(saved){
                  setSavedBlog(true)
                }
                like = like.data()
                if(like){
                  setliked(true)
                }
              }
              setLikes(data.likes)
              setNoComments(data.comments)
              var blog=data.blogData.map((value, index) => {
                  var splited = value.split(":@@#!@#@#!@#@!#@#@$@");
                  splited[4] = clearCheck(splited[4])
                  if (splited[0] === "para") {
                    return (
                      <div key={index} className="blog_show">
                        <div  dangerouslySetInnerHTML={{__html:`${splited[4]}`}} style={{fontFamily:splited[1],color:`#${splited[2]}`,fontSize:`${splited[3]}px`}} />
                        <br></br>
                      </div>
                    );
                  } else if (splited[0] === "h1") {
                    return <div key={index} className="blog_show"><h1  dangerouslySetInnerHTML={{__html:`${splited[4]}`}} style={{fontFamily:splited[1],color:`#${splited[2]}`,fontSize:`${splited[3]}px`}}/><br></br></div>;
                  }
                  else if (splited[0] === "code") {
                    // splited[4]=splited[4].replace(/\<\b\r\/\>/g, '\n')
            
                      return  <div key={index} className="blog_show" style={{maxHeight:'600px',marginTop:'25px'}}>
                      <div style={{maxHeight:'600px',marginTop:'12px',overflowX:'auto',overflowY:'auto',backgroundColor:'#f3f3f3'}}>
                      <p style={{whiteSpace:'pre-line',marginLeft:'10px',fontSize:'18px',padding:'13px',borderRadius:'10px'}}>{splited[4]}</p>           
                      </div>
                      <br></br>
                    </div>
                    }
                  else if(splited[0]==='image'){
                    return <div key={index} className="blog_show" style={{margin:'auto',marginTop:'20px',marginBottom:'20px',borderRadius:'10px'}}><img src={splited[5]} style={{margin:'auto',width:'100%',maxHeight:'500px',minHeight:'200px',backgroundColor:'#ddd',marginTop:'10px',marginBottom:'10px'}} /><span style={{width:'100%',display:'block',lineHeight:'1.6',marginTop:'-10px',color:`#${splited[2]}`,fontSize:`${splited[3]}px`,fontFamily:`${splited[1]}`}} dangerouslySetInnerHTML={{__html:`${splited[4]}`}} /><br></br> </div>
                  }
                })
                document.title=data.title?data.title+" - writeNow":"writeNow"
              setBlogData(blog)
              setLoading(false);
  
          }
          }
          getData();

    },[])
    const writeComments=async()=>{
      if(loggedUser){
      function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }
      let commentUid=uuidv4()
        await firebase.writeComments(postUID,commentInput,loggedUser,commentUid)
        let com = [...comments]
        com.unshift({name:loggedUser.displayName,comment:commentInput,likes:0,userUid:loggedUser.uid,commentUid})
        let data=[...notifications]
        if(data.length>7000){
          data.pop()
          data.pop()
          data.pop()
          data.pop()
          data.pop()
          data.pop()
          data.pop()
          data.pop()
          data.pop()
          data.pop()
        }
        data.unshift({name:loggedUser.displayName,notification:'Commented on your Blog',uid:fullBlog.postUid,type:'blog',title:fullBlog.title,image:fullBlog.titleImage})
        await firebase.setNotification(userData.uid,data)
        setNoComments(noComments+1)
        setComments(com)
      }else{
        setLoginShow(true)
      }
    }
    const getComments=async()=>{
      const commentDoc =await firebase.getComments(postUID,createdAt)
      var newBlog = [...comments];
      if(commentDoc.length===0){
        setMoreData(false)

        return
      }
      if(commentDoc.length<8){
          setMoreData(false)
      }
        for(let i=0;i<commentDoc.length;i++){
          if(commentDoc[i].uid){
            for(var j=0;j<commentDoc[i].uid.length;j++){
              if(commentDoc[i].uid[j]===loggedUser.uid){
                commentDoc[i].isLiked=true
              }
            }
          }
        }

        setCreatedAt(commentDoc[commentDoc.length-1].createdAt)
        newBlog.push(...commentDoc);
        setComments(newBlog)
      }
  
    const likeABlog=async()=>{
      if(loggedUser){
        setLikes(likes+1)
        setliked(true)
        await firebase.likeABlog(postUID,loggedUser.uid)
        let data =[...notifications]
        if(data.length>7000){
          data.pop()
          data.pop()
          data.pop()
          data.pop()
          data.pop()
          data.pop()
          data.pop()
          data.pop()
          data.pop()
          data.pop()
        }
        data.unshift({name:loggedUser.displayName,notification:'Liked your Blog',uid:fullBlog.postUid,type:'blog',title:fullBlog.title,image:fullBlog.titleImage})
        await firebase.setNotification(userData.uid,data)
        setNotification(data)
      }else{
        setLoginShow(true)
      }
    }
    const dislikeABlog=async()=>{
      if(liked){
        setLikes(likes-1)
        setliked(false)
        await firebase.dislikeABlog(postUID,loggedUser.uid)
        let data =[...notifications]
        if(data.length>7000){
          data.pop()
          data.pop()
          data.pop()
          data.pop()
          data.pop()
          data.pop()
          data.pop()
          data.pop()
          data.pop()
          data.pop()
        }
        data.unshift({name:loggedUser.displayName,notification:'Disliked your Blog',uid:fullBlog.postUid,type:'blog',title:fullBlog.title,image:fullBlog.titleImage})
        await firebase.setNotification(userData.uid,data)
        setNotification(data)

      }
    }
    const likeComment=async(index)=>{
      if(loggedUser){
        let comment = [...comments]
        comment[index].likes+=1
        comment[index].isLiked=true
        setComments(comment)
        await firebase.likeComment(postUID,comments[index],loggedUser.uid)
        let data =[...notifications]
        if(data.length>7000){
          data.pop()
          data.pop()
          data.pop()
          data.pop()
          data.pop()
          data.pop()
          data.pop()
          data.pop()
          data.pop()
          data.pop()
        }
        data.unshift({name:loggedUser.displayName,notification:'Liked your Comment',uid:fullBlog.postUid,type:'comment',title:comment[index].comment,image:fullBlog.titleImage})
        await firebase.setNotification(comment[index].userUid,data)
        setNotification(data)

      }else{
        setLoginShow(true)
      }
    }
    const dislikeComment=async(index)=>{
      if(loggedUser){
        let comment = [...comments]
        comment[index].likes-=1
        comment[index].isLiked=false
        setComments(comment)
        await firebase.dislikeComment(postUID,comments[index],loggedUser.uid)
        let data =[...notifications]
        if(data.length>7000){
          data.pop()
          data.pop()
          data.pop()
          data.pop()
          data.pop()
          data.pop()
          data.pop()
          data.pop()
          data.pop()
          data.pop()
        }
        data.unshift({name:loggedUser.displayName,notification:'Disliked your Comment',uid:fullBlog.postUid,type:'comment',title:comment[index].comment,image:fullBlog.titleImage})
        await firebase.setNotification(comment[index].userUid,data)
        setNotification(data)

      }
    }
    const loadMoreComments=async()=>{
      if(!loadMore&&moreData){
        setLoadMore(true)
        await getComments()
        setLoadMore(false)
      }
    }
    const saveABlog=async()=>{
      try{
        if(loggedUser){
          setSavedBlog(true)
          let k=await firebase.saveABlog(postUID,loggedUser.uid,fullBlog,fullBlog.uid)
          let data =[...notifications]
          if(data.length>7000){
            data.pop()
            data.pop()
            data.pop()
            data.pop()
            data.pop()
            data.pop()
            data.pop()
            data.pop()
            data.pop()
            data.pop()
          }
        data.unshift({name:loggedUser.displayName,notification:'Saved your Blog',uid:fullBlog.postUid,type:'blog',title:fullBlog.title,image:fullBlog.titleImage})
        await firebase.setNotification(userData.uid,data)
        setNotification(data)

        }else{
          setLoginShow(true)
        }
      }catch(e){
        console.log(e)
      }
    }
    const unsaveABlog=async()=>{
      if(loggedUser){
        setSavedBlog(false)
        await firebase.unsaveABlog(postUID,loggedUser.uid,fullBlog.uid)
        let data =[...notifications]
        if(data.length>7000){
          data.pop()
          data.pop()
          data.pop()
          data.pop()
          data.pop()
          data.pop()
          data.pop()
          data.pop()
          data.pop()
          data.pop()
        }
        data.unshift({name:loggedUser.displayName,notification:'Unsaved your Blog',uid:fullBlog.postUid,type:'blog',title:fullBlog.title,image:fullBlog.titleImage})
        await firebase.setNotification(userData.uid,data)
        setNotification(data)

      }else{
        setLoginShow(true)
      }
    }
    return (
        <div style={{height:'100vh',width:'100vw'}}>
            {Loading?
            <div style={{display:'flex',justifyContent:'space-between'}}>
            <div className="block_for_likes">
            <div>
                <span style={{height:'10px',marginBottom:'3px'}}></span>
                <button style={{margin:'auto',backgroundColor:'#ddd',border:'0px solid #ddd',outline:'none'}}><span className="material-icons">favorite_border</span></button>
                <span style={{height:'10px',marginBottom:'3px'}}></span>
                <button style={{margin:'auto',backgroundColor:'#ddd',border:'0px solid #ddd',outline:'none'}}><span className="material-icons">notes</span></button>
                <button style={{margin:'auto',backgroundColor:'#ddd',border:'0px solid #ddd',outline:'none'}}><span className="material-icons">bookmark_border</span></button>
            </div>
            </div>
            <div className="show_blog" >
            <div className="loading_heading"></div>
              <div className="loading_text"></div>
              <div className="loading_text"></div>
              <div className="loading_text"></div>
            <div className="loading_text"></div>
              <div className="loading_text"></div>
              <br></br>
              <br></br>
              <br></br>
              <div className="loading_heading"></div>
            <div className="loading_text"></div>
            <div className="loading_text"></div>
            <div className="loading_text"></div>
            </div>
            <div className="block_for_info">
              <div className="block_for_info_inside">
               <div className="loading_circle" style={{marginTop:'20px'}}></div>
               <div className="loading_text" style={{marginTop:'20px'}}> </div>
               <div className="loading_text" style={{marginTop:'20px'}}></div>
               <div className="loading_text" style={{marginTop:'20px'}}></div>
               <div className="loading_text" style={{marginTop:'20px'}}></div>
              </div>
            </div>
            </div>
            :
            <div>
              {loginShow?
              <div style={{width:'100vh'}}><div style={{top:'50px',width:'100%',height:'55px',background: '#222222',boxShadow: '0 0 24px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',position:'fixed',display:'flex',justifyContent:'flex-end',alignItems:'center'}} ><div style={{marginRight:'30px'}} className="border_wrap1"><button style={{float:'right',padding:'10px 20px'}} className="edit_click_button" onClick={()=>{setLoginShow(false)}}>Close</button></div> </div><Login /></div>
            :<div style={{}}>
              {error?
              <Error errorName="blog"></Error>
              :
              <div style={{display:'flex',justifyContent:'space-between'}}>
              <div className="block_for_likes">
                  <div>
                  <span style={{height:'10px',fontSize:'18px',marginBottom:'3px'}}>{likes}</span>
                  {liked?
                  <button style={{margin:'auto',backgroundColor:'#ddd',border:'0px solid #ddd',outline:'none'}} onClick={()=>{dislikeABlog()}}><span className="material-icons" style={{color:'red'}}>favorite</span></button>
                  :
                  <button style={{margin:'auto',backgroundColor:'#ddd',border:'0px solid #ddd',outline:'none'}} onClick={()=>{likeABlog()}}><span className="material-icons">favorite_border</span></button>
                  }
                  <span style={{height:'10px',fontSize:'18px',marginBottom:'3px'}}>{noComments}</span>
                  <button style={{margin:'auto',backgroundColor:'#ddd',border:'0px solid #ddd',outline:'none'}}><span className="material-icons">notes</span></button>
                  {savedBlog?
                  <button style={{margin:'auto',backgroundColor:'#ddd',border:'0px solid #ddd',outline:'none',color:'red'}} onClick={()=>{unsaveABlog()}}><span className="material-icons">bookmark</span></button>
                  :
                  <button style={{margin:'auto',backgroundColor:'#ddd',border:'0px solid #ddd',outline:'none'}} onClick={()=>{saveABlog()}}><span className="material-icons">bookmark_border</span></button>
                  }
                  </div>
              </div>
              <div className="show_blog" style={{overflowY:'scroll',overflowX:'hidden'}}>
              <div className="smallScreenInfo">
              <div  style={{minHeight:'350px',margin:'auto'}}>
              <div className="profilePic" style={{width:'100px',height:'100px',backgroundColor:'#ddd',borderRadius:'50px',display:'flex',justifyContent:'center',margin:'auto',marginTop:'15px'}}>
                    {userData.profilePic?
                  <img src={userData.profilePic} ></img>
                  :null}
                </div>
                <p style={{textAlign:'center', textDecoration:'underline',marginLeft:'10px',marginTop:'10px',fontSize:'18px',fontWeight:'bold',marginBottom:'0px'}}>{userData.name}</p>
                <div className="userData" style={{marginTop:'15px'}}>
                      <p>{userData.likes}<br></br><span style={{textDecoration:'underline',marginTop:'-2px'}}>Likes</span></p>
                      <p>{userData.bookmark}<br></br><span style={{textDecoration:'underline',marginTop:'-2px'}}>Bookmark</span></p>
                      <p>{userData.blogs}<br></br><span style={{textDecoration:'underline',marginTop:'-2px'}}>Blogs</span></p>
                </div>
                
                <div style={{textAlign:'center',margin:'auto',color:'#808080',fontWeight:'bold',display:'flex',fontSize:'18px',maxWidth:'60%',position:'relative'}}>
                    <p style={{textAlign:'center',margin:'auto'}}>{userData.bio}</p>
                </div>
                <div className="profileButton">
                  <NavLink to={`/profile/${userData.uid}`}  ref={input => inputnav = input} style={{display:'flex',justifyContent:'center',margin:'auto',display:'none'}}></NavLink>
                  <button onClick={()=>{inputnav.click()}}>See Profile</button>
                </div>
                </div>
                <div style={{display:'flex',justifyContent:'space-around',width:'100%'}}>
                  {liked?
                  <div >
                  <span style={{height:'10px',fontSize:'18px'}}>{likes}</span>
                  <br></br>
                  <button style={{backgroundColor:'#fafafa',border:'0px solid #ddd',outline:'none',marginLeft:'-13px'}} onClick={()=>{dislikeABlog()}}><span className="material-icons" style={{color:'red'}}>favorite</span></button>
                  </div>
                  :
                  <div>
                  <span style={{height:'10px',fontSize:'18px',marginBottom:'3px'}}>{likes}</span>
                  <br></br>
                  <button style={{backgroundColor:'#fafafa',border:'0px solid #ddd',outline:'none',marginLeft:'-13px'}} onClick={()=>{likeABlog()}}><span className="material-icons">favorite_border</span></button>
                  </div>
                  }
                  <div>
                  <span style={{height:'10px',fontSize:'18px',marginBottom:'3px'}}>{noComments}</span>
                  <br></br>
                  <button style={{margin:'auto',backgroundColor:'#fafafa',border:'0px solid #ddd',outline:'none',marginLeft:'-13px'}}><span className="material-icons">notes</span></button>
                  </div>
                  {savedBlog?
                  <button style={{backgroundColor:'#fafafa',border:'0px solid #ddd',outline:'none',color:'red',marginLeft:'-13px'}} onClick={()=>{unsaveABlog()}}><span className="material-icons">bookmark</span></button>
                  :
                  <button style={{backgroundColor:'#fafafa',border:'0px solid #ddd',outline:'none',marginLeft:'-13px'}} onClick={()=>{saveABlog()}}><span className="material-icons">bookmark_border</span></button>
                  }
                  </div>
                </div>
                <div style={{height:'70px'}}></div>
                  {blogData}
                
                  <div style={{height:'70px',backgroundColor:'#fafafa',borderTop:'0px'}}></div>
                  <div className="smallScreenInfo">
                  <div style={{display:'flex',justifyContent:'space-around',width:'100%'}}>
                  {liked?
                  <div >
                  <span style={{height:'10px',fontSize:'18px'}}>{likes}</span>
                  <br></br>
                  <button style={{backgroundColor:'#fafafa',border:'0px solid #ddd',outline:'none',marginLeft:'-13px'}} onClick={()=>{dislikeABlog()}}><span className="material-icons" style={{color:'red'}}>favorite</span></button>
                  </div>
                  :
                  <div>
                  <span style={{height:'10px',fontSize:'18px',marginBottom:'3px'}}>{likes}</span>
                  <br></br>
                  <button style={{backgroundColor:'#fafafa',border:'0px solid #ddd',outline:'none',marginLeft:'-13px'}} onClick={()=>{likeABlog()}}><span className="material-icons">favorite_border</span></button>
                  </div>
                  }
                  <div>
                  <span style={{height:'10px',fontSize:'18px',marginBottom:'3px'}}>{noComments}</span>
                  <br></br>
                  <button style={{margin:'auto',backgroundColor:'#fafafa',border:'0px solid #ddd',outline:'none',marginLeft:'-13px'}}><span className="material-icons">notes</span></button>
                  </div>
                  {savedBlog?
                  <button style={{backgroundColor:'#fafafa',border:'0px solid #ddd',outline:'none',color:'red',marginLeft:'-13px'}} onClick={()=>{unsaveABlog()}}><span className="material-icons">bookmark</span></button>
                  :
                  <button style={{backgroundColor:'#fafafa',border:'0px solid #ddd',outline:'none',marginLeft:'-13px'}} onClick={()=>{saveABlog()}}><span className="material-icons">bookmark_border</span></button>
                  }
                  </div>
                  </div>
                  <div style={{height:'70px',backgroundColor:'#fafafa',borderTop:'0px'}}></div>
  
                  <div style={{height:'6px',backgroundColor:'#fafafa',borderTop:'0px',boxShadow: '0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',borderBottom:'1px solid black'}}></div>
                  <hr></hr>
              <div style={{height:'70px'}}></div>
                
              
                  {comments.map((comment,index)=>{
                    return(
                      <div key={index} className="comment_block_show">
                        <NavLink to={`/profile/${comment.userUid}`} style={{display:'none'}} ref={(input)=>userName=input}>some</NavLink>
                        <span style={{textDecoration:'underline'}} onClick={()=>{userName.click()}}>{comment.name}</span>
                      <div  className="comment_show">
                        {comment.comment}
                      </div>
                      <span style={{color:'black',marginLeft:'10px',marginTop:'12px'}}>{comment.likes}</span>
                      <br></br>
                      {comment.isLiked?<button onClick={()=>{dislikeComment(index)}} style={{border:'0px solid black',backgroundColor:'#f3f3f3',outline:'none',color:'red'}}><span className="material-icons" style={{fontSize:'18px'}}>favorite</span></button>
                      :<button onClick={()=>{likeComment(index)}} style={{border:'0px solid black',backgroundColor:'#f3f3f3',outline:'none'}}><span className="material-icons" style={{fontSize:'18px'}}>favorite_border</span></button>}
                      </div>
                    )
                  })}
                  {moreData?null:<div><p style={{margin:'auto',textAlign:'center',color:'#ff0033',fontSize:'18px'}}>NO More Comments FOUND</p>
                  </div>}
                  <div className="profileButton" style={{marginBottom:'20px',color:'#098dba'}}>
                    {loadMore?
                    <button style={{backgroundColor:'#d04848'}}>loading...</button>
                    :
                    <button onClick={()=>{loadMoreComments()}} style={{backgroundColor:'#098dba'}} disabled={!moreData}>Load Comments</button>
                    }
                  </div>
                  <div className="comment_block" >
                  <textarea rows={3} cols={10} className="write_comments" placeholder="Write Comment" value={commentInput} onChange={(event)=>{setCommentInput(event.target.value)}}></textarea>
                  <div className="profileButton">
                  <button onClick={()=>{writeComments()}}>Comment</button>
                  </div>
              </div>
              <div style={{height:'70px'}}></div>
              </div>
                  
              <div className="block_for_info">
                <div className="block_for_info_inside">
                  <div className="profilePic" style={{width:'100px',height:'100px',backgroundColor:'#ddd',borderRadius:'50px',display:'flex',justifyContent:'center',margin:'auto',marginTop:'15px'}}>
                    {userData.profilePic?
                  <img src={userData.profilePic} ></img>
                  :null}
                </div>
                <p style={{textAlign:'center', textDecoration:'underline',marginTop:'6px',fontSize:'18px',fontWeight:'bold',marginBottom:'0px'}}>{userData.name}</p>
                <div className="userData">
                      <p>{userData.likes}<br></br><span style={{textDecoration:'underline',marginTop:'-2px'}}>Likes</span></p>
                      <p>{userData.bookmark}<br></br><span style={{textDecoration:'underline',marginTop:'-2px'}}>Bookmark</span></p>
                      <p>{userData.blogs}<br></br><span style={{textDecoration:'underline',marginTop:'-2px'}}>Blogs</span></p>
                </div>
                
                <div style={{textAlign:'center',margin:'auto',color:'#808080',fontWeight:'bold',display:'flex',fontSize:'18px',maxWidth:'60%',position:'relative'}}>
                    <p>{userData.bio}</p>
                </div>
                <div className="profileButton">
                  <NavLink to={`/profile/${userData.uid}`}  ref={input => inputnav = input} style={{display:'flex',justifyContent:'center',margin:'auto',display:'none'}}></NavLink>
                  <button onClick={()=>{inputnav.click()}}>See Profile</button>
                </div>
  
                </div>
              <div>
                  
              </div>
              </div>
              
              </div>
              }

            </div>
            
            }
            
            </div>
            }
        </div>
    )
}



export default withFirebaseHOC(ShowBlog)