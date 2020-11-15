import * as firebase from "firebase";
import "firebase/auth";
import "firebase/firestore";
// import "firebase/app"
import firebaseConfig from "./config";
// import { extra } from "./firebaseConfig";
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const storageRef =firebase.storage().ref()
export const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider()


//TODO: convert to transactions wherever required.
//TODO: read firebase docs for read once & other data practices
const Firebase = {
  login:async(email,password,)=>{
     const k = await firebase.auth().signInWithEmailAndPassword(email, password);
     if(k.emailVerified){
      const href =window.location.href
      let splited =href.split('/');
      if( splited[3]!=='login'&&splited[3]!=='signup'){
        if(splited[3]==="blog"){
          return window.location.href = `/blog/${splited[4]}`
      }else if(splited[3]==="profile"){
          return window.location.href = `/profile/${splited[4]}`
      }else{
          return window.location.href = `/${splited[3]}`
      }
      }else{
        return  window.location.href='/'
      }
     }
  },
  signUp:async(email,password,name)=>{
    await firebase.auth().createUserWithEmailAndPassword(email,password);
    const user = await firebase.auth().currentUser;
    user.updateProfile({
      displayName: name
    })
    await user.sendEmailVerification();
    const data ={uid:user.uid,name:name,email:email,likes:0,bookmark:0,blogs:0,profilePic:''};
    await firebase
    .firestore()
    .collection('users')
    .doc(user.uid)
    .collection('profile')
    .doc('info')
    .set(data);

    return await firebase.auth().signOut();
  },
  signInWithGoogle:()=>{
    auth.signInWithPopup(googleProvider).then(async(res) => {
    let user = await firebase
                      .firestore()
                      .collectionGroup('profile')
                      .where('uid','==',res.user.uid)
                      .limit(1)
                      .get()
    var data={}
    if(user){
      user.forEach(async(doc)=>{
        data = doc.data();
      })
    }
    
    if(!data.name){
      const data ={uid:res.user.uid,name:res.user.displayName,email:res.user.email,likes:0,bookmark:0,blogs:0,profilePic:res.user.photoURL};
      await firebase
      .firestore()
      .collection('users')
      .doc(res.user.uid)
      .collection('profile')
      .doc('info')
      .set(data);
    }
    const href =window.location.href
              let splited =href.split('/');
              if( splited[3]!=='login'&&splited[3]!=='signup'){
                if(splited[3]==="blog"){
                  return window.location.href = `/blog/${splited[4]}`
              }else if(splited[3]==="profile"){
                  return window.location.href = `/profile/${splited[4]}`
              }else{
                  return window.location.href = `/${splited[3]}`
              }
              }else{
                return  window.location.href='/'
              }
  }).catch((error) => {
    console.log(error.message)
  })
  },
  signout:async()=>{
    return await firebase.auth().signOut();
  },
  isLoggedIn:async()=>{
    return await firebase.auth().currentUser 
  },
  saveABlog:async(postUID,uid,blog,useruid)=>{
    blog.savedAt = Date.now()
    await firebase
        .firestore()
        .collection("users")
        .doc(useruid)
        .collection("profile")
        .doc("info")
        .update({bookmark:firebase.firestore.FieldValue.increment(1)})
    return await firebase
                .firestore()
                .collection("users")
                .doc(uid)
                .collection("saved")
                .doc(postUID)
                .set(blog)
  },
  ifUserFollows:async(uid,loggedUser)=>{
    return await firebase
                .firestore()
                .collection("users")
                .doc(uid)
                .collection("followers")
                .doc(loggedUser)
                .get()
  },
  likeProfile:async(uid,userPro)=>{
    await firebase
         .firestore()
         .collection('users')
         .doc(userPro)
         .collection('followers')
         .doc(uid)
         .set({uid:uid})
    return await firebase
                .firestore()
                .collection("users")
                .doc(userPro)
                .collection("profile")
                .doc("info")
                .update({likes:firebase.firestore.FieldValue.increment(1)})
  },
  dislikeProfile:async(uid,userPro)=>{
    await firebase
         .firestore()
         .collection('users')
         .doc(userPro)
         .collection('followers')
         .doc(uid)
         .delete()
    return await firebase
                .firestore()
                .collection("users")
                .doc(userPro)
                .collection("profile")
                .doc("info")
                .update({likes:firebase.firestore.FieldValue.increment(-1)})
  },
  unsaveABlog:async(postUID,uid,useruid)=>{
    await firebase
        .firestore()
        .collection("users")
        .doc(useruid)
        .collection("profile")
        .doc("info")
        .update({bookmark:firebase.firestore.FieldValue.increment(-1)})

    return await firebase
                .firestore()
                .collection("users")
                .doc(uid)
                .collection("saved")
                .doc(postUID)
                .delete()
  },
  savedABlog:async(postUid,uid)=>{
    return await firebase
                .firestore()
                .collection("users")
                .doc(uid)
                .collection("saved")
                .doc(postUid)
                .get()
  },
  getSavedBlogs:async(uid,savedAt)=>{
    let blogs=[];
    if(!savedAt){
      savedAt = Date.now()
    }
    let snapshot = await firebase
                .firestore()
                .collection("users")
                .doc(uid)
                .collection("saved")
                .where("savedAt","<",savedAt)
                .orderBy("savedAt","desc")
                .limit(8)
                .get()
    if(snapshot){
      snapshot.forEach(async(doc)=>{
      var data = doc.data();
      blogs.push(data);
    })
    }
  return blogs;
  },
  postBlog:async(blogData,postUid,title,titleImage)=>{
    const user = await firebase.auth().currentUser
    
    const data = {uid:user.uid
      ,blogData:blogData,
      name:user.displayName
      ,likes:0
      ,comments:0,
      postUid
      ,titleImage
      ,title:title.toLowerCase()
      ,createdAt:Date.now()}
    await firebase
    .firestore()
    .collection('blog')
    .doc(postUid)
    .set(data)
    
    await firebase
    .firestore()
    .collection('users')
    .doc(user.uid)
    .collection('profile')
    .doc('info')
    .update({blogs:firebase.firestore.FieldValue.increment(1)})
  },
  getBlogData:async(postUid)=>{
    return await firebase
                .firestore()
                .collection('blog')
                .doc(postUid)
                .get() 
  },
  getMoreBlogs:async(createdAt,limit=10)=>{
    var snapshot;
    var blogs=[];
    if(!createdAt){
      createdAt= Date.now()
    }
    if(createdAt){
      snapshot= await firebase
      .firestore()
      .collection('blog')
      .where("createdAt","<",createdAt)
      .orderBy("createdAt","desc")
      .limit(limit)
      .get();
    }else{
      snapshot= await firebase
      .firestore()
      .collection('blog')
      .orderBy('createdAt',"asc")
      .limit(8)
      .get();
    }
    if(snapshot){
      snapshot.forEach(async(doc)=>{
        var data = doc.data();
        // data.isLiked=await seeIfLiked(data);
        blogs.push(data);
      })
    }
   
    return blogs;
  },
  getNotifications:async(uid)=>{
    return await firebase 
                .firestore()
                .collection("users")
                .doc(uid)
                .collection("profile")
                .doc("info")
                .get()
  },
  setNotification:async(uid,data)=>{
    return await firebase
                .firestore()
                .collection("users")
                .doc(uid)
                .collection("profile")
                .doc("info")
                .update({notification:data})
  },
  getUserInfo:async(uid)=>{
    return await firebase
          .firestore()
          .collection('users')
          .doc(uid)
          .collection('profile')
          .doc('info')
          .get();
  },
  likedABlog:async(postUid,uid)=>{
    return await firebase
                .firestore()
                .collection('blog')
                .doc(postUid)
                .collection('liked')
                .doc(uid)
                .get()
  },
  likeABlog:async(postUid,uid)=>{
    await firebase
                .firestore()
                .collection('blog')
                .doc(postUid)
                .collection('liked')
                .doc(uid)
                .set({uid})
    return await firebase
                .firestore()
                .collection('blog')
                .doc(postUid)
                .update({likes:firebase.firestore.FieldValue.increment(1)})  
  },
  dislikeABlog:async(postUid,uid)=>{
    await firebase
                .firestore()
                .collection('blog')
                .doc(postUid)
                .collection('liked')
                .doc(uid)
                .delete()
    return await firebase
                .firestore()
                .collection('blog')
                .doc(postUid)
                .update({likes:firebase.firestore.FieldValue.increment(-1)})  
  },
  writeComments:async(postUid,comment,loggedUser,commentUid)=>{
    let createdAt = Date.now()
    await firebase
         .firestore()
         .collection('blog')
         .doc(postUid)
         .collection('comments')
         .doc(commentUid)
         .set({name:loggedUser.displayName,comment:comment,likes:0,userUid:loggedUser.uid,createdAt,commentUid})
    return await firebase
                .firestore()
                .collection('blog')
                .doc(postUid)
                .update({comments:firebase.firestore.FieldValue.increment(1)})
  },
  likeComment:async(postUid,comment,uid)=>{
    return await firebase
         .firestore()
         .collection('blog')
         .doc(postUid)
         .collection('comments')
         .doc(comment.commentUid)
         .update({likes:firebase.firestore.FieldValue.increment(1),uid: firebase.firestore.FieldValue.arrayUnion(uid)})
  },
  dislikeComment:async(postUid,comment,uid)=>{
    return await firebase
         .firestore()
         .collection('blog')
         .doc(postUid)
         .collection('comments')
         .doc(comment.commentUid)
         .update({likes:firebase.firestore.FieldValue.increment(-1),uid: firebase.firestore.FieldValue.arrayRemove(uid)})
  },
  getComments:async(postUid,createdAt,limit=8)=>{
    var snapshot;
    if(!createdAt){
      createdAt = Date.now()
    }
    var blogs=[];
      snapshot= await firebase
      .firestore()
      .collection('blog')
      .doc(postUid)
      .collection('comments')
      .where("createdAt","<",createdAt)
      .orderBy("createdAt","desc")
      .limit(limit)
      .get();
    if(snapshot){
      snapshot.forEach(async(doc)=>{
        var data = doc.data();
        blogs.push(data);
      })
    }
   
    return blogs;

  },
  getUserBlogs:async(uid,createdAt,limit=8)=>{
    var snapshot;
    if(!createdAt){
      createdAt = Date.now()
    }
    var blogs=[];
      snapshot= await firebase
      .firestore()
      .collection('blog')
      .where("uid","==",uid)
      .where("createdAt","<",createdAt)
      .orderBy("createdAt","desc")
      .limit(limit)
      .get();
    if(snapshot){
      snapshot.forEach(async(doc)=>{
        var data = doc.data();
        // data.isLiked=await seeIfLiked(data);
        blogs.push(data);
      })
    }
   
    return blogs;
  },
  updateUserData:async(uid,data)=>{
    return await firebase
                .firestore()
                .collection("users")
                .doc(uid)
                .collection("profile")
                .doc("info")
                .update(data)
  }
  
};

export default Firebase;
export {storageRef}






