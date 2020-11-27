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
                // console.log("################################# if")
                u = data[i].split(':@@#!@#@#!@#@!#@#@$@')[4]+'/n';
            }else{
                u = data[i].split(':@@#!@#@#!@#@!#@#@$@')[4].substring(0,charLeft);
            }
            character=character+u
            charLeft-=u.length
            i++;
        }
        character=character+"..."
        console.log(character)

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
        <div style={{height:'100vh',width:'100vw',overflowY:'auto',overflowX:'hidden'}}>
            <div className="home" style={{overflowY:'visible'}}>
            {props.blogs.map((blog,index)=>{
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