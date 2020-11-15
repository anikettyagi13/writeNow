import React,{useState,useEffect} from 'react'
import {withFirebaseHOC} from '../../firebase/index'
import {validPassword,validEmail,validName} from '../../utils/validation'
// import {Redirect} from 'react-router-dom'
 function Signup({firebase}){
     const [signupClicked,setSignupClicked] = useState('SIGNUP')
    const [emailError,setEmailError] = useState(false)
    const [passwordError,setPasswordError] = useState(false)
    const [nameError,setNameError] = useState(false)
    const [errorMessage,setErrorMessage] = useState('')
    const [email,setEmail] = useState("");
    const [password,setPassword]= useState("");
    const [confirmPassword,setConfirmPassword] = useState("")
    const [confirmPasswordError,setConfirmPasswordError] = useState(false)
    const [name,setName]= useState("");
    let href = window.location.href.split('/')[3]
    let something = ''
    if(href==="blog"||href==="profile"){
        if(window.location.href.split("/")[4]){
            href = href+"/"+ window.location.href.split('/')[4]
        }
    }
    if(href!=="login"&&href!=='signup'){
        something ="/"+ href
    }
    const googleSignIn=async(event)=>{
        try{setSignupClicked('Loading')
        event.preventDefault();
        const user = await firebase.signInWithGoogle();
        if(user){
            const href =window.location.href
            let splited =href.split('/');
            if( splited[3]!=='login'&&splited[3]!=='signup'){
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
            setSignupClicked('SIGNUP')
        }
    }
    const SignupClick=async(event)=>{
        try{
            setSignupClicked('LOADING')
            event.preventDefault();
            var isValidEmail=validEmail(email);
            var isValidPassword=validPassword(password);
            var isValidName = validName(name)
            if(password!==confirmPassword){
                setConfirmPasswordError(true)
            }
            if(isValidEmail&&isValidPassword&&isValidName&&password===confirmPassword){
                const user=await firebase.signUp(email,password,name);
                window.location.replace(`${something}/login`)
            }
        }catch(e){
            setErrorMessage(e.message)
        }finally{
            if(password===confirmPassword){
                setConfirmPasswordError(false)
            }
            setEmailError(!isValidEmail);
            setPasswordError(!isValidPassword);
            setNameError(!isValidName);
            setSignupClicked('SIGNUP')
        }
    }
    return(
        <div className="form_div">
            <div className="form signup_form">
                <label className="form_label signup_form_label">Name</label>
                    <input placeholder="Name" onChange={(event)=>{setName(event.target.value)}} value={name}
                        className={nameError?'input_error signup_form_input ':'form_input signup_form_input '}
                    ></input>
                    {nameError? <span style={{width:'100%',zIndex:'20',display:'block',color:'red',fontSize:'10px',fontWeight:'bold',height:'10px'}}>NAME MUST BE &gt;=4</span>:<span style={{display:'block',width:'100%',height:'10px'}}></span>}
                <label className="form_label signup_form_label">Email</label>
                    <input placeholder="Email" onChange={(event)=>{setEmail(event.target.value)}} value={email}
                    className={emailError?'input_error signup_form_input ':'form_input signup_form_input '}
                    ></input>
                    {emailError? <span style={{width:'100%',zIndex:'20',display:'block',color:'red',fontSize:'10px',fontWeight:'bold',height:'10px'}}>INCORRECT EMAIL</span>:<span style={{display:'block',width:'100%',height:'10px'}}></span>}

                <label className="form_label signup_form_label">Password</label>
                    <input placeholder="password" type="password" onChange={(event)=>{setPassword(event.target.value)}} value={password}
                    className={passwordError?'input_error signup_form_input ':'form_input signup_form_input '}
                    ></input>
                    {passwordError? <span style={{width:'100%',zIndex:'20',display:'block',color:'red',fontSize:'10px',fontWeight:'bold',height:'10px'}}>PASSWORD MUST BE &gt;= 8</span>:<span style={{display:'block', width:'100%',height:'10px'}}></span>}
                    <label className="form_label signup_form_label">Confirm Password</label>
                    <input placeholder="password" type="password" onChange={(event)=>{setConfirmPassword(event.target.value)}} value={confirmPassword}
                    className={confirmPasswordError?'input_error signup_form_input ':'form_input signup_form_input '}
                    ></input>
                    {confirmPasswordError? <span style={{width:'100%',zIndex:'20',display:'block',color:'red',fontSize:'10px',fontWeight:'bold',height:'10px'}}>Password did not match</span>:<span style={{display:'block', width:'100%',height:'10px'}}></span>}
                    <div className="form_button_div">
                    <button onClick={SignupClick} className="form_button">{signupClicked}</button>
                    <div style={{display:'flex',justifyContent:'flex-end'}}>
                    <a href={`${something}/login`} style={{textAlign:'start'}}>LOGIN?</a>
                    </div>
                    </div>
                    <div style={{width:'100%',color:'rgb(182, 179, 179)',textAlign:'center'}}>
                      ------------------------- or--------------------------
                    </div>
                <div className="google">
                <button onClick={googleSignIn}>SIGN IN WITH GOOGLE</button>
                </div>
            {errorMessage?<p style={{width:'80%',zIndex:'20',display:'block',color:'red',fontSize:'10px',fontWeight:'bold',height:'10px'}}>{errorMessage}</p>:<p style={{width:'80%',display:'block',height:'10px'}}></p>}
            </div>
        </div>
    )
}

export default withFirebaseHOC(Signup)