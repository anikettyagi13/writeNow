import React from 'react'

function Error(props){
    return(
        <div style={{height:'100%',width:'100%',textAlign:'center',display:'flex',alignItems:'center',alignContent:'center',justifyContent:'center',flexWrap:'wrap'}}>
            <div style={{fontSize:'40px',fontWeight:'bold',color:'#121212',width:'100%'}}>404</div>
            <p style={{color:'#808080',fontSize:'20px',width:'100%'}}>cannot find {props.errorName?props.errorName:'page'} you requested for</p>
        </div>
    )
}

export default Error