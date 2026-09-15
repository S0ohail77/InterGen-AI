import axios from "axios"


//REGISTER
export async function register ({username, email, password}){


   try{ 
    const response = await axios.post('http://localhost3000/api/auth/register',{
        username, email, password
    }, {
        withCredentials : true
    })

    return response.data

}catch (err) {

    console.log(err);
    
}
}


//LOGIN
export async function login({email, password}){

    try{
        const response = await axios.post('http://localhost:3000/api/auth/login', {
            email, password
        }, {
            withCredentials : true
        })

        return response.data

    }catch (err) { 
        console.log(err)
    }
}


//LOGOUT
export async function logout(){

  try{  
    
        const response = await axios.get('http://localhost:3000:api/auth/logout' ,{
      
        withCredentials : true
    })

    return response.data

}catch (err) {
    console.log(err)
}
}


//GET-ME
export async function getMe(){
    try{
        const response = await axios.get('http://localhost:3000/api/auth/get-me',{
            withCredentials : true
        })
    
        return response.data

    }catch(err) {

        console.log(err)
    }
}