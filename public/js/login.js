import axios from 'axios';
import { showAlert } from './alerts';

const loginForm = document.querySelector('.form--login');
console.log(loginForm);
if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login({ email, password });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const logOutBtn = document.getElementById('logoutLink');
    if (logOutBtn) {
        logOutBtn.addEventListener('click', logout);
    }
});

export const login = async ({ email, password }) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:3000/api/v1/users/login',
            data: {
                email: email,
                password: password,
            }
        });
        if (res.data.status === 'Success') {
            showAlert('success', 'Logged in Successfully');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (e) {
        showAlert('error', e.response.data.message);
    }
};

export const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://localhost:3000/api/v1/users/logout',
        });
        if (res.data.status === 'Success') {
            location.reload(true);
        }
    } catch (e) {
        showAlert('error', 'Error logging out! Try again!');
    }
};


const signupform = document.querySelector('.form--signup');
if (signupform) {
    signupform.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirm_password = document.getElementById('confirm-password').value;
        if(password!==confirm_password)
            return showAlert('error',"Password doesn't match" );
        signup({ name, email, password, confirmPassword: confirm_password });
    });
}
export const signup = async ({name, email, password , confirmPassword}) => {
    try {
        const res = await axios({
            method: 'POST',
            url: 'http://localhost:3000/api/v1/users/signup',
            data: {
                name: name,
                email: email,
                password: password,
                passwordConfirm: confirmPassword,
                role: "user"
            }
        });
        if (res.data.status === 'Success') {
            showAlert('success', 'Signed Up Successfully');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500);
        }
    } catch (e) {
        showAlert('error', e.response.data.message);
    }
};


const forgotPasswordForm = document.querySelector('.form--forgotpassword')
if(forgotPasswordForm){
    forgotPasswordForm.addEventListener('submit',e => {
        e.preventDefault()
        const email=document.getElementById('email').value;
        forgotPassword({email});
    })
}

export const forgotPassword = async ({email})=>{
    try{
        
        const res = await axios({
            method: "POST", 
            url: 'http://localhost:3000/api/v1/users/forgotPassword',
            data: {
                email: email,
            }
        });
        if(res.data.status==='Success'){
            showAlert('success', 'Token sent to email, Please Check you email!');
        }
    } catch(e){
        showAlert('error', e.response.data.message);

    }
}

const resetPasswordForm = document.querySelector('.form--resetpassword')
if(resetPasswordForm){
    resetPasswordForm.addEventListener('submit', e=>{
        e.preventDefault()
        const password = document.getElementById('password').value
        const passwordConfirm = document.getElementById('confirm-password').value
        const token = document.getElementById('hidden').value

        resetPassword({password, passwordConfirm, token})
    })
}


export const resetPassword = async({password, passwordConfirm, token})=>{
    try{

        const res = await axios({
            method: 'PATCH',
            url: `http://localhost:3000/api/v1/users/resetPassword/${token}`,
            data: {
                password,
                passwordConfirm
            }
        })
        if (res.data.status === 'Success') {
            showAlert('success', 'Password Reset Successfully');
            window.setTimeout(() => {
                location.assign('/login');
            }, 1500);
        }
    } catch(e){
        showAlert('error', e.response.data.message);

    }

}
