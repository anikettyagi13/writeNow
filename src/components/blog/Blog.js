import React, { useEffect, useState } from "react";
import { withFirebaseHOC } from "../../firebase";
import BlogDumb from "./BlogDumb";
import {storageRef} from '../../firebase/firebase';
import { NavLink } from "react-router-dom";
import Resizer from 'react-image-file-resizer';

var postUid=''
const links={}
const linkIndex={}
 function Blog({firebase}) {
  const [writting, setWritting] = useState("");
  const [title,setTitle] = useState('');
  const [isWritting, setIsWritting] = useState(true);
  const [type, setType] = useState("para");
  const [editable, setEditable] = useState(null);
  const [editing, setEditing] = useState("");
  const [editSize,setEditSize] = useState('18');
  const [editingSize,setEditingSize] = useState('14');
  const [editingColor, setEditingColor] = useState("");
  const [editColor,setEditColor] = useState("505050");
  const [color,setColor] = useState("505050");
  const [blogData, setblogData] = useState([]);
  const [image,setImage] = useState([])
  const [images,setImages] = useState({})
  const [editableType, setEditableType] = useState("");
  const [writtenList, setWrittenList] = useState([]);
  const [font,setFont] = useState("sans-serif");
  const [uploaded,setUploaded] = useState(false)
  const [editingFont,setEditingFont] = useState("")
  const [picFileName,setPicFileName] = useState('')
  const [introImage,setIntroImage] = useState({})
  const [user,setUser] = useState('')
  document.title="BLOGGINGISTA"
  useEffect(()=>{
    const u =checkIfLoggedIn()
  },[])
  const checkIfLoggedIn=async()=>{
    let u = await firebase.isLoggedIn()
    if(u){
      setUser(u)
    }
  }
  const insert = (which) => {
    setType(which);
    if(which==="heading"){
      changeEditSize('34');
      changeFont('Ariel')
      setEditColor('000000')
      setColor('000000')
    }
    if(which!=="heading"){
      setEditSize('18')
      changeFont('sans-serif')
      setEditColor('505050')
      setColor('505050')
    }
    setIsWritting(true);
  };
  const changeIntroImage=(file)=>{
    let named = file.name
    setPicFileName(named)
    setIntroImage(file)
  }
  const Done = (index) => {
    if (index !== undefined) {
      let imagePresent=blogData[index].split(':@@#!@#@#!@#@!#@#@$@')[5]
      if(imagePresent){
        blogData.splice(index, 1, `${editableType}:@@#!@#@#!@#@!#@#@$@${editingFont}:@@#!@#@#!@#@!#@#@$@${editingColor}:@@#!@#@#!@#@!#@#@$@${editingSize}:@@#!@#@#!@#@!#@#@$@${editing}:@@#!@#@#!@#@!#@#@$@${imagePresent}`)
        
        setblogData(blogData);
        setEditing("");
        setEditable(null);
        setEditableType("");
      }else{
        blogData.splice(index, 1, `${editableType}:@@#!@#@#!@#@!#@#@$@${editingFont}:@@#!@#@#!@#@!#@#@$@${editingColor}:@@#!@#@#!@#@!#@#@$@${editingSize}:@@#!@#@#!@#@!#@#@$@${editing}`);
        setblogData(blogData);
        setEditing("");
        setEditable(null);
        setEditableType("");
      }
      
    } else {
      try{
        let k=writting.replace(/\r\n|\n|\r/g, '\n')
      if(k===""){
        alert("Empty element could not be added")
      }else{
      var showWritting = "";
      if (type === "para") {
        showWritting = "para:@@#!@#@#!@#@!#@#@$@"+font+":@@#!@#@#!@#@!#@#@$@"+color+":@@#!@#@#!@#@!#@#@$@"+editSize+":@@#!@#@#!@#@!#@#@$@"+ k;
      } else if (type === "heading") {
        showWritting = "h1:@@#!@#@#!@#@!#@#@$@"+font+":@@#!@#@#!@#@!#@#@$@"+color+":@@#!@#@#!@#@!#@#@$@"+editSize+":@@#!@#@#!@#@!#@#@$@"+ k;
      }else if(type==="code"){
        showWritting = "code:@@#!@#@#!@#@!#@#@$@"+font+":@@#!@#@#!@#@!#@#@$@"+color+":@@#!@#@#!@#@!#@#@$@"+editSize+":@@#!@#@#!@#@!#@#@$@"+ k;
      }
      else if(type=== 'image'){
        if(image){
            let link = URL.createObjectURL(image)
            index = blogData.length
            images[index] = image
            setImages(images)
            setImage([])
            var name=image.name
            linkIndex[index]=name;
            showWritting = "image:@@#!@#@#!@#@!#@#@$@"+font+":@@#!@#@#!@#@!#@#@$@"+color+":@@#!@#@#!@#@!#@#@$@"+editSize+":@@#!@#@#!@#@!#@#@$@"+k+":@@#!@#@#!@#@!#@#@$@"+link  

       }
      }
        
      blogData.push(showWritting);
      setblogData(blogData);
      setIsWritting(true);
      setWritting("");
      setType("para");
      setEditSize('18')
      setColor('505050')
      setEditColor('505050')
      changeFont('sans-serif')
    

    }}catch(e){
     alert('Unable to add element in the blog. While adding image see if you are selecting the image') 
    }
  }
  
  };
  const del=(index)=>{
    blogData.splice(index,1);
    if(images[index]){
      delete images[index]
      let name = links[index]
      delete linkIndex[name]
      delete links[index]
    }
    setblogData(blogData)
    setEditing("");
    setEditable(null);
    setEditableType("");
  }
  const onEdit = (index) => {

    setEditable(index);
    setEditing(blogData[index].split(":@@#!@#@#!@#@!#@#@$@")[4]);
    setEditableType(blogData[index].split(":@@#!@#@#!@#@!#@#@$@")[0]);
    setEditingFont(blogData[index].split(":@@#!@#@#!@#@!#@#@$@")[1]);
    setEditingColor(blogData[index].split(":@@#!@#@#!@#@!#@#@$@")[2]);
    setEditingSize(blogData[index].split(":@@#!@#@#!@#@!#@#@$@")[3])
    
  };
  
  const boldClick=(event,edit)=>{
    if(edit){
      setEditing(editing+"(*o) BOLD TEXT (.*o)")
    }else
    setWritting(writting+"(*o) BOLD TEXT (.*o)")
  }
  const italicsClick=(event,edit)=>{
    if(edit){
    setEditing(editing+"(*i) ITALICS TEXT (.*i)")
    }else
    setWritting(writting+"(*i) ITALICS TEXT (.*i)")
  }
  const underlineClick=(event,edit)=>{
    if(edit){
    setEditing(editing+"(*u) UNDERLINE TEXT (.*u)")
    }else{
      setWritting(writting+"(*u) UNDERLINE TEXT (.*u)")
    }
  }
  const bulletClick=(event,edit)=>{
    if(edit){
    setEditing(editing+"(*.) BULLET POINT (.*)")
    }else{
      setWritting(writting+"(*.) BULLET POINT (.*)")

    }
  }
  const changeFont=(value)=>{
    setFont(value)
  }
  const changeEditColor=(value)=>{
    setEditColor(value);
    if(value.length===6){
      setColor(value);
    }
  }  
  const changeEditingColor=(value)=>{
    setEditingColor(value);
  }
  const changeEditingFont=(value)=>{
    setEditingFont(value)
  }
  const postBlog=async()=>{
    if(blogData.length===0||images.length===0||title.length===0||!introImage){
      alert("A blog must contain atleast a single image,a text block, a title and a intro Image !!!!")
    }else{
      setUploaded(true)
      function uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxx'.replace(/[xy]/g, function(c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      }
      postUid=uuidv4()
      await imageUpload(postUid);
    }
  }
  const resizeFile = (file) => new Promise(resolve => {
    Resizer.imageFileResizer(file, 500, 500, 'JPEG', 99, 0,
    uri => {
      resolve(uri);
    },
    'blob',
    200,
    200
    );
  }); 
  const imageUpload=async(postUid)=>{
    const promises = [];
    for (var index in images) {
      let file = images[index]
      const image = await resizeFile(file);
      const uploadTask = storageRef.child(`blog/${postUid}/${file.name}`).put(image);
    promises.push(uploadTask);

    uploadTask.on('state_changed', snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // setUploaded(`${index}:${progress}`)
        
    }, error => { console.log(error) }, () => {
        uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
          links[file.name]=downloadURL
        });
    });
    }
    const image = await resizeFile(introImage);
    const titleTask = storageRef.child(`blog/${postUid}/${introImage.name}titleImage`).put(image);
    promises.push(titleTask);

    titleTask.on('state_changed', snapshot => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // setUploaded(`${index}:${progress}`)
        
    }, error => { console.log(error) }, () => {
        titleTask.snapshot.ref.getDownloadURL().then(downloadURL => {
          links["title@1!@#@##$#$!@#@#!@##%$^%$#$!@#$%756863412#!@#"]=downloadURL
        });
    });

    Promise.all(promises).then(tasks => {
      // console.log('yo')
      setTimeout(async() => {  
        try{
          for (var index in images){
            let name=linkIndex[index]
            let url = links[name]
            let input =blogData[index].split(':@@#!@#@#!@#@!#@#@$@')
            blogData[index] = "image:@@#!@#@#!@#@!#@#@$@"+input[1]+":@@#!@#@#!@#@!#@#@$@"+input[2]+":@@#!@#@#!@#@!#@#@$@"+input[3]+":@@#!@#@#!@#@!#@#@$@"+input[4]+":@@#!@#@#!@#@!#@#@$@"+url 
          }
          let titleImage = links["title@1!@#@##$#$!@#@#!@##%$^%$#$!@#$%756863412#!@#"]
          firebase.postBlog(blogData,postUid,title,titleImage).then(()=>{
            window.location.replace(`/blog/${postUid}`)
          })
        }catch(e){
          console.log(e)
        }finally{
          setUploaded(false)
        }
      }, 4000);
    });
    // await firebase.postBlog(blogData,postUid)

  }
  const changeEditSize=(value)=>{
    setEditSize(`${value}`)
  }
  
  const changeEditingSize=(value)=>{
    setEditingSize(`${value}`)
  }

  return (
    <BlogDumb
      user={user}
      insert={insert}
      onEdit={onEdit}
      Done={Done}
      blogData={blogData}
      setEditing={setEditing}
      isWritting={isWritting}
      setWritting={setWritting}
      editing={editing}
      writting={writting}
      editable={editable}
      type={type}
      writtenList={writtenList}
      setWrittenList={setWrittenList}
      editableType={editableType}
      boldClick={boldClick}
      italicsClick={italicsClick}
      underlineClick={underlineClick}
      bulletClick={bulletClick}
      font={font}
      image={image}
      setImage={setImage}
      changeFont={changeFont}
      changeEditingFont={changeEditingFont}
      editingFont={editingFont}
      del = {del}
      editColor={editColor}
      editingSize={editingSize}
      changeEditColor={changeEditColor}
      color={color}
      changeEditingColor={changeEditingColor}
      editingColor={editingColor}
      editSize = {editSize}
      postBlog={postBlog}
      changeEditSize={changeEditSize}
      changeEditingSize={changeEditingSize}
      uploaded={uploaded}
      title={title}
      setTitle={setTitle}
      picFileName={picFileName}
      changeIntroImage={changeIntroImage}
    />
  );
}

export default withFirebaseHOC(Blog)