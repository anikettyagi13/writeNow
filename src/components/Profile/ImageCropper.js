import React,{useCallback,useState} from 'react'
import Cropper from 'react-easy-crop'
import { getCroppedImg, getRotatedImage } from './canvasUtils'
import { styles } from './styles'
import {storageRef} from '../../firebase/firebase';
import Resizer from 'react-image-file-resizer';


let profilePicUrl=''
export default function ImageCropper(props){
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)    
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [croppedImage, setCroppedImage] = useState(null)
    const [uploadImage,setUploadImage] = useState(false)
    

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
    const imageUpload=async(croppedImage)=>{
        const promises = [];
        setUploadImage(true)
        let blob = await fetch(croppedImage).then(r => r.blob());
        let image = await resizeFile(blob)
        const uploadTask = storageRef.child(`user/${props.uid}/profilePic`).put(image);
        promises.push(uploadTask);
    
        uploadTask.on('state_changed', snapshot => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // setUploaded(`${index}:${progress}`)
            
        }, error => { console.log(error) }, () => {
            uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
              profilePicUrl=downloadURL;
            });
        });
        Promise.all(promises).then(tasks => {
          // console.log('yo')
          setTimeout(async() => {  
            try{
                var data={
                    'profilePic':profilePicUrl
                }
              props.firebase.updateUserData(props.uid,data).then(()=>{
              })
            }catch(e){
              console.log(e)
            }finally{
              setUploadImage(false)
              props.setImage(croppedImage)
              props.setEditImage(false)
            }
          }, 1000);
        });
    
      }


    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
      }, [])
      const showCroppedImage = useCallback(async () => {
        try {
          const croppedImage = await getCroppedImg(
            props.imageSrc,
            croppedAreaPixels
          )
          imageUpload(croppedImage)
          setCroppedImage(croppedImage)
        } catch (e) {
          console.error(e)
        } 
      }, [props.imageSrc, croppedAreaPixels])
return(
    <div style={{height:'100vh',width:'vw'}}>
        {/* position: 'relative',
    width: '100%',
    height: 200,
    background: '#333', */}
<div style={{top:'50px',width:'100%',height:'55px',background: '#222222',boxShadow: '0 0 24px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',position:'fixed',display:'flex',justifyContent:'flex-end',alignItems:'center'}} ><div style={{marginRight:'30px'}} className="border_wrap1"><button style={{float:'right',padding:'10px 20px'}} className="edit_click_button" onClick={()=>{props.setEditImage(false)}}>Close</button></div> </div>

<div style={{position:'relative',width:'100%',height:'90%',background:'#333',display:'flex',alignItems:'center',marginTop:'56px'}}>
        <Cropper
                image={props.imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                style={{position:'relative'}}
                />
        </div>
        {uploadImage?<div className="upload_showup"><div className="modal-content">
       {/* <span className="close">&times;</span> */}
      <p style={{fontSize:'18px',color:'#3498db'}}>UPLOADING...</p>
      <p style={{fontSize:'18px',color:'#3498db'}}>DO NOT RELOAD</p>
      <div className="loader"></div>
      </div>
      </div>
      :null}
      <div style={{bottom:'0px',width:'100%',height:'55px',background: '#222222',boxShadow: '0 0 24px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',position:'fixed',display:'flex',justifyContent:'flex-end',alignItems:'center'}} ><div style={{marginRight:'30px'}} className="border_wrap1"><button style={{float:'right',padding:'10px 20px'}} className="edit_click_button" onClick={showCroppedImage}>Update</button></div> </div>

    </div>
    
)
}
