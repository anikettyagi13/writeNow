// import React from 'react'

// export default function Features(props){
//     return (
    
//     )
// }

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