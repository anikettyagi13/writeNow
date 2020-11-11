import React from "react";
import { clearCheck} from "../../utils/utils";
import Login from '../Login/Login'

export default function BlogDumb(props) {  
  let height = Screen.height - 55; 
  let inputElement=''
  return (
    <div style={{width:`100wh`,height:`${height}px`,overflowX:'hidden'}}>
      {props.user?
    <div style={{width:`100wh`,height:`${height}px`}}>
      <input type="text" placeholder="TITLE OF BLOG" value={props.title} onChange={(event)=>{props.setTitle(event.target.value)}} style={{margin:'auto',marginTop:'20px',marginBottom:'20px',borderRadius:'5px',padding:'5px',width:'60%',display:'flex',justifyContent:'center'}}/>
      <input type="file" ref={input => inputElement = input} onChange={(event)=>{props.changeIntroImage(event.target.files[0])}} accept=".jpg, .jpeg, .png" size="60" style={{display:'flex',justifyContent:'center',margin:'auto',display:'none'}}></input>
      <div className="border_wrap" style={{margin:'auto',display:'flex',justifyContent:'center'}}>
      <button className="edit_click_button"  onClick={()=>inputElement.click()}>choose file</button>
      </div>
      <span style={{textAlign:'center',margin:'auto',display:'flex',justifyContent:'center',color:'#808080'}} >{props.picFileName}</span>
      <span style={{textAlign:'center',margin:'auto',display:'flex',justifyContent:'center',marginBottom:'30px',color:'#808080'}}>This pic will be shown as a intro not a part of the blog.</span>
      {props.blogData.map((value, index) => {
        var blogPost = value.split(":@@#!@#@#!@#@!#@#@$@");
        return (
          <div key={index}>
            {index===props.editable?
            <div>
              <div className="writting">
              <div className="writting1">
              {blogPost[0]==='image'?<div className="blog_show"><img src={blogPost[5]} style={{margin:'auto',maxWidth:'70%',maxHeight:'500px'}} alt="hello"/></div>:null}
              <div className="edit_options">
              <button onClick={()=>props.del(index)}className="edit_button"><i className="material-icons">delete_forever</i>  </button>              
              <button onClick={(event)=>props.bulletClick(event,true)}className="edit_button"><i className="material-icons">format_list_bulleted</i></button>
              <button onClick={(event)=>props.boldClick(event,true)}className="edit_button"><i className="material-icons">format_bold</i>  </button>
              <button onClick={(event)=>props.italicsClick(event,true)}className="edit_button"><i className="material-icons">format_italic</i>  </button>
              <button onClick={(event)=>props.underlineClick(event,true)}className="edit_button"><i className="material-icons">format_underlined</i>  </button>              
              <div className="sizeEdit" >
              <span style={{color:"white",fontSize:'10px'}}>FONT SIZE  </span>
              <input placeholder="000000" value={props.editingSize} style={{backgroundColor:'#121212',color:'white',border:'1px solid white',borderRadius:'4px'}} onChange={(event)=>{props.changeEditingSize(event.target.value)}}/>
              </div>
            </div>
              <textarea  className="writting_area" cols={40} value={props.editing} style={{fontFamily:props.editingFont,color:`#${props.editingColor}`,fontSize:`${props.editingSize}px`}} onChange={(event)=>{props.setEditing(event.target.value)}} />
              <div className='edit_options'>
              <select name="font" value={props.editingFont} className="edit_options" style={{float:"right",border:'0px',color:'white'}} onChange={(event)=>{props.changeEditingFont(event.target.value)}}>
              <option value="Ariel" className="edit_button" style={{fontFamily:'Ariel'}}>Ariel</option>
              <option value="sans-serif" style={{fontFamily:'sans-serif'}} className="edit_button">Sans-serif</option>
              <option value="Impact" style={{fontFamily: 'Impact'}} className="edit_button">Impact</option>
              <option value="courier" style={{fontFamily:'courier'}} className="edit_button">courier</option>
              <option value="Georgia" style={{fontFamily:'Georgia'}} className="edit_button">Georgia</option>
              <option value="cursive" style={{fontFamily:'cursive'}} className="edit_button">cursive</option>
              <option value="Geneva" style={{fontFamily:'Geneva'}} className="edit_button">Geneva</option>
            </select>
            <div className="colorEdit" >
            <span style={{color:"white"}}>#</span>
            <input placeholder="000000" value={props.editingColor} style={{backgroundColor:'#121212',color:'white',border:'1px solid white',borderRadius:'4px'}} onChange={(event)=>{props.changeEditingColor(event.target.value)}}/>
            </div>
            </div>
            </div>
          </div>
          <div style={{width:"70%",margin:'auto',marginTop:'15px'}}>
          <div className="border_wrap">
          <button className="edit_click_button" onClick={()=>{props.Done(index)}}>Done Editing</button>
          </div></div></div>
          :
              <div className="blog_show">
                {blogPost[0] === "para" ?<p key={index}  style={{fontFamily:blogPost[1],color:`#${blogPost[2]}`,fontSize:`${blogPost[3]}px`,whiteSpace:'pre-line'}}>{blogPost[4]}</p> : null}
                {blogPost[0] === "h1" ? <h1   style={{fontFamily:blogPost[1],color:`#${blogPost[2]}`,fontSize:`${blogPost[3]}px`,whiteSpace:'pre-line'}}>{blogPost[4]}</h1> : null}
                {blogPost[0]==="image"?<div key={index} className="blog_show" style={{margin:'auto',marginBottom:'15px'}}><img src={blogPost[5]} style={{margin:'auto',maxWidth:'70%',maxHeight:'500px'}} /><span style={{width:'100%',display:'block',lineHeight:'1.6',marginTop:'-10px',color:`#${blogPost[2]}`,fontSize:`${blogPost[3]}px`,whiteSpace:'pre-line'}}>{blogPost[4]}</span><br></br> </div>:null}
                {blogPost[0] === "code" ? <p   style={{fontFamily:blogPost[1],color:`#${blogPost[2]}`,fontSize:`${blogPost[3]}px`,whiteSpace:'pre-line'}}>{blogPost[4]}</p> : null}
                <div className="border_wrap">
                <button
                className="edit_click_button"
                  onClick={() => {
                    props.onEdit(index);
                  }}
                >
                  Edit
                </button>
                </div>
                <hr></hr>
              </div>}
          </div>
        );
      })}
      {props.isWritting ? (
        <div>
          <div className="writting">
          <div className="writting1">
          {props.type==='image'?<input style={{margin:'auto'}} onChange={(event)=>{props.setImage(event.target.files[0])}} type="file" id="profile_pic" name="profile_pic"
          accept=".jpg, .jpeg, .png"></input>:null}
          <div className="edit_options">
              <button onClick={props.bulletClick}className="edit_button"><i className="material-icons">format_list_bulleted</i></button>
              <button onClick={props.boldClick}className="edit_button"><i className="material-icons">format_bold</i>  </button>
              <button onClick={props.italicsClick}className="edit_button"><i className="material-icons">format_italic</i>  </button>
              <button onClick={props.underlineClick}className="edit_button"><i className="material-icons">format_underlined</i>  </button>              
              <div className="sizeEdit">
              <span style={{color:"white",fontSize:'10px'}}>FONT SIZE  </span>
              <input placeholder="000000" value={props.editSize} style={{backgroundColor:'#121212',color:'white',border:'1px solid white',marginTop:'4px',borderRadius:'4px'}} onChange={(event)=>{props.changeEditSize(event.target.value)}}/>
              </div>
          </div>  
              <textarea
                placeholder="Write something"
                rows="10"
                cols="40"
                className="writting_area"
                id="textarea"
                onChange={(event) => props.setWritting(event.target.value)}
                style={{fontFamily:props.font,color:`#${props.color}`,fontSize:`${props.editSize}px`}}
                value={props.writting}
              ></textarea>
            <div className='edit_options'>
            <select name="type" value={props.type} onChange={(event)=>{props.insert(event.target.value)}} className="edit_options" style={{backgroundColor:'#191919',color:'white',border:'0px'}}>
              <option value="para" className="edit_button">paragraph</option>
              <option value="heading" className="edit_button">heading</option>
              <option value="code" className="edit_button">code</option>
              <option value="image" className="edit_button">image</option>
            </select>
            <select name="font" value={props.font} className="edit_options" style={{float:"right",backgroundColor:'#191919',color:'white',border:'0px',background: 'transparent url("") no-repeat 60px center'}} onChange={(event)=>{props.changeFont(event.target.value)}}>
              <option value="Ariel" className="edit_button" style={{fontFamily:'Ariel'}}>Ariel</option>
              <option value="sans-serif" style={{fontFamily:'sans-serif'}} className="edit_button">Sans-serif</option>
              <option value="Impact" style={{fontFamily: 'Impact'}} className="edit_button">Impact</option>
              <option value="courier" style={{fontFamily:'courier'}} className="edit_button">courier</option>
              <option value="Georgia" style={{fontFamily:'Georgia'}} className="edit_button">Georgia</option>
              <option value="cursive" style={{fontFamily:'cursive'}} className="edit_button">cursive</option>
              <option value="Geneva" style={{fontFamily:'Geneva'}} className="edit_button">Geneva</option>

            </select>
            <div className="colorEdit" >
            <span style={{color:"white"}}>#</span>
            <input placeholder="000000" style={{backgroundColor:'#121212',color:'white',border:'1px solid white',borderRadius:'4px'}}  value={props.editColor} onChange={(event)=>{props.changeEditColor(event.target.value)}}/>
            </div>
            </div>
            </div></div>
                    
            <div style={{width:"70%",margin:'auto',marginTop:'15px'}}>
          <div className="border_wrap">
        <button
        className="edit_click_button"
                onClick={() => {
                  props.Done();
                }}
              >
                Done
              </button>
        </div>
        </div>
        </div>
      ) : null}
      <hr />
      <hr />
      <p style={{textAlign:'center',fontSize:'24px',color:'rgb(1, 179, 233)'}}>PREVIEW</p>
      <hr />
      <hr />

      {props.blogData.map((value, index) => {
        var splited = value.split(":@@#!@#@#!@#@!#@#@$@");
        splited[4] = clearCheck(splited[4])
        if (splited[0] === "para") {
          return (
            <div key={index} className="blog_show">
              <div  dangerouslySetInnerHTML={{__html:`${splited[4]}`}} style={{whiteSpace:'pre-line'}} style={{fontFamily:splited[1],color:`#${splited[2]}`,fontSize:`${splited[3]}px`}} />
              <br></br>
            </div>
          );
        } else if (splited[0] === "h1") {
          return <div key={index} className="blog_show" style={{whiteSpace:'pre-line'}}><h1  dangerouslySetInnerHTML={{__html:`${splited[4]}`}} style={{fontFamily:splited[1],color:`#${splited[2]}`,fontSize:`${splited[3]}px`}}/><br></br></div>;
        }else if (splited[0] === "code") {
        // splited[4]=splited[4].replace(/\<\b\r\/\>/g, '\n')

          return <div key={index} className="blog_show" style={{maxHeight:'600px',marginTop:'12px'}}>
            <div style={{maxHeight:'600px',marginTop:'12px',overflowX:'auto',overflowY:'auto',backgroundColor:'#fafafa'}}>
            <p style={{whiteSpace:'pre-line',marginLeft:'10px',fontSize:'18px',padding:'13px',borderRadius:'10px'}}>{splited[4]}</p>           
            </div>
            <br></br>
          </div>
        }

        else if(splited[0]==='image'){
          return <div key={index} className="blog_show"  style={{margin:'auto',marginBottom:'15px'}}><img src={splited[5]} style={{margin:'auto',maxWidth:'70%',maxHeight:'500px'}} /><br></br><span style={{width:'100%',display:'block',lineHeight:'1.6',marginTop:'-10px',color:`#${splited[2]}`,fontSize:`${splited[3]}px`}} style={{whiteSpace:'pre-line'}} dangerouslySetInnerHTML={{__html:`${splited[4]}`}} /><br></br> </div>
        }
      })}
      
      {props.uploaded?<div className="upload_showup"><div className="modal-content">
       {/* <span className="close">&times;</span> */}
      <p style={{fontSize:'18px',color:'#3498db'}}>UPLOADING...</p>
      <p style={{fontSize:'18px',color:'#3498db'}}>Grab a cup of coffee because this takes a minute. </p>
      <p style={{fontSize:'18px',color:'#3498db'}}>DO NOT RELOAD</p>
      <div className="loader"></div>
      </div>
      </div>
      :null}
      <div style={{height:'70px'}}></div>
      <div style={{bottom:'0px',width:'100%',height:'55px',background: '#222222',boxShadow: '0 0 24px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22)',position:'fixed',display:'flex',justifyContent:'flex-end',alignItems:'center'}} ><div style={{marginRight:'30px'}} className="border_wrap1"><button style={{float:'right',padding:'10px 20px'}} className="edit_click_button" onClick={props.postBlog}>POST</button></div> </div>
    </div>
    :<Login />}
    </div>
  );
}
