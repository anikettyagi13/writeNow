import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { withFirebaseHOC } from '../../firebase'
import HomeDumb from './HomeDumb'

function Home(props){
    const [createdAt,setCreatedAt] = useState()
    const [blogs,setBlogs] = useState([])
    const [moreData,setMoreData]= useState(true)
    const [isLoading,setIsLoading]=useState(false)

    useEffect(()=>{
        document.title="BLOGGINGISTA"
        if(props.homeBlogs.length===0){
            getMoreBlogs()
        }else{
            setBlogs(props.homeBlogs);
            setIsLoading(false)
            setCreatedAt(props.homeBlogs[props.homeBlogs.length-1].createdAt)
        }
    },[])
    const getMoreBlogs=async()=>{
            setIsLoading(true)
            var postDoc = await props.firebase.getMoreBlogs(createdAt);
            var newBlog = [...blogs];
            if(postDoc.length===0){
                setMoreData(false)
                setIsLoading(false)
            }else if(postDoc.length<=10){
                console.log(postDoc)
                newBlog.push(...postDoc);
                props.setHomeBlogs(newBlog)
                setBlogs(newBlog);
                setIsLoading(false)
                setCreatedAt(newBlog[newBlog.length-1].createdAt)
            }
            
    }
    const showBlog=(index)=>{
        return(
            <NavLink to={`/blog/${blogs[index].postUid}`}></NavLink>
        )
    }
    return(
        <HomeDumb
        blogs={blogs}   
        showBlog={showBlog}   
        getMoreBlogs={getMoreBlogs}
        moreData={moreData}
        setIsLoading={setIsLoading}
        isLoading={isLoading}
        />
    )
}

export default withFirebaseHOC(Home)