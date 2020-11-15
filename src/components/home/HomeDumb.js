import React from 'react'
import {NavLink} from 'react-router-dom'
import InfiniteScroll from "react-infinite-scroller";

function HomeDumb(props){
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
    let scrollParentRef=''
    return(
        <div style={{backgroundColor:'#ddd',height:'100vh',width:'100vw',overflowY:'auto',overflowX:'hidden'}}>
            <div className="home" style={{overflowY:'visible',backgroundColor:'#ddd'}}>
            {props.blogs.map((blog,index)=>{
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
            {props.moreData?null:<div><p style={{margin:'auto',textAlign:'center',color:'#ff0033',fontSize:'18px'}}>NO MORE BLOG FOUND</p>
            <p style={{margin:'auto',textAlign:'center',color:'#82b1ad',fontSize:'20px'}}>Write A Blog? <NavLink to="write-blog">CLICK HERE</NavLink></p>
            </div>}
            <div className="profileButton" style={{marginBottom:'60px'}}>
                {props.isLoading?
            <button disabled={true} style={props.isLoading?{pointerEvents:'none'}:null}>Loading...</button>
            :
            <button onClick={()=>{props.getMoreBlogs()}} >Load More</button>
            }
            </div>
            {props.isLoading?
            <div className="loader"></div>
            :null            
            }
        </div>
    )
}

export default HomeDumb