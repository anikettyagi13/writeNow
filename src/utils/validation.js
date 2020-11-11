export const validEmail =(email)=>{
    var emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    var emailType = new RegExp(emailPattern);

    if(email.match(emailType)){
        return true;
    }
    else{
        return false;
    }
}

export const validPassword =(password)=>{
    // var emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    // var emailType = new RegExp(emailPattern);
    
    if(password.length>=8){
        return true;
    }
    else{
        return false;
    }
}
export const validName =(name)=>{
    // var emailPattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    // var emailType = new RegExp(emailPattern);
    
    if(name.length>=4){
        return true;
    }
    else{
        return false;
    }
}