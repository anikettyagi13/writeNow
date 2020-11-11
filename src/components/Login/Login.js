import React, { useState } from 'react'
import { withFirebaseHOC } from '../../firebase';
import {validEmail,validPassword} from '../../utils/validation'

function Login({firebase}){
    const [loginClicked,setLoginClicked] = useState(false)
    const [emailError,setEmailError] = useState(false)
    const [passwordError,setPasswordError] = useState(false)
    const [errorMessage,setErrorMessage] = useState('')
    const [email,setEmail] = useState("");
    const [password,setPassword]= useState("");
    let href = window.location.href.split('/')[3]
    if(href==="blog"||href==="profile"){
        if(window.location.href.split("/")[4]){
            href = href+"/"+ window.location.href.split('/')[4]
        }
    }
    let something = ''
    if(href!=="login"&&href!=="signup"){
        something ="/"+ href
    }
    const googleSignIn=async(event)=>{
        try{setLoginClicked(true)
        event.preventDefault();
        const user = await firebase.signInWithGoogle();
        if(user){
            const href =window.location.href
            let splited =href.split('/');
            if( splited[3]!=='login'&&splited[3!=='signup']){
                if(splited[3]==="blog"){
                    window.location.href = `blog/${splited[4]}`
                }else if(splited[3]==="profile"){
                    window.location.href = `profile/${splited[4]}`
                }else{
                    window.location.href = `/${splited[3]}`
                }
            }else{
                window.location.replace('/')
            }
        }
        }catch(e){
            setErrorMessage(e.message)
        }finally{
            setLoginClicked(false)
        }
    }
    const loginClick=async(event)=>{
        try{
            setLoginClicked(true)
            event.preventDefault();
            var isValidEmail=validEmail(email);
            var isValidPassword=validPassword(password);
            if(isValidEmail&&isValidPassword){
                await firebase.login(email,password);
                let user =await firebase.isLoggedIn()
                if(user&&user.emailVerified){
                    const href =window.location.href
                    let splited =href.split('/');
                    if( splited[3]!=='login'&&splited[3!=='signup']){
                        if(splited[3]==="blog"){
                            window.location.href = `blog/${splited[4]}`
                        }else if(splited[3]==="profile"){
                            window.location.href = `profile/${splited[4]}`
                        }else{
                            window.location.href = `/${splited[3]}`
                        }
                    }else{
                        window.location.replace('/')
                    }
                }else if(!user.emailVerified){
                    setErrorMessage('Please verify your Email id')
                }
            }
        }catch(e){
            setErrorMessage(e.message)
        }finally{
            setEmailError(!isValidEmail)
            setPasswordError(!isValidPassword)
            setLoginClicked(false)

        }
    }
    return(
        <div className="form_div">
            <div className="form">
                <label className="form_label">EMAIL</label>
                    <input  placeholder="Email" onChange={(event)=>{setEmail(event.target.value)}} value={email}
                    className={emailError?'input_error':'form_input'}
                    ></input>
                    {emailError? <span style={{width:'100%',zIndex:'20',display:'block',color:'red'}}>INCORRECT EMAIL</span>:<span style={{display:'block',width:'100%',height:'10px'}}></span>}
                <label className="form_label">PASSWORD</label>
                    <input  placeholder="password" type="password" onChange={(event)=>{setPassword(event.target.value)}} value={password}
                    className={passwordError?'input_error':'form_input'}
                    ></input>
                    {passwordError? <span style={{width:'100%',zIndex:'20',display:'block',color:'red',height:'10px'}}>PASSWORD MUST BE &gt;= 8</span>:<span style={{display:'block', width:'100%',height:'10px'}}></span>}

                <br></br>
                <div className="form_button_div">
                <button onClick={loginClick} className="form_button" disabled={loginClicked?true:false}>LOGIN</button>
                <div style={{display:'flex',justifyContent:'flex-end'}}>
                    <a href={`${something}/signup`} style={{textAlign:'start'}}>REGISTER NOW</a>
                </div>
                </div>
                    <div style={{width:'100%',color:'rgb(182, 179, 179)',textAlign:'center'}}>
                      ------------------------- or--------------------------
                    </div>
                <div className="google">
                <button onClick={googleSignIn}>SIGN IN WITH GOOGLE</button>
                </div>
            <p style={{width:'80%',zIndex:'20',display:'block',color:'red'}}>{errorMessage}</p>

            </div>
        </div>
    )
}

export default withFirebaseHOC(Login)