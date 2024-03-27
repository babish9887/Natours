import axios from "axios"
import {showAlert} from './alerts'
export const updateData=async (data, type)=>{
    try{
        const url=type === 'password'? 'http://localhost:3000/api/v1/users/updateMypassword': 
        'http://localhost:3000/api/v1/users/updateMe'; 
        const res=await axios({
            method: 'PATCH',
            url,
            data
        });

        if(res.data.status == 'Success')
            showAlert('success', `${type.toUpperCase()} updated Successfully! Please refresh to see Changes!`)
    } catch(e){
        showAlert('error', err.response.data.message)
    }
}