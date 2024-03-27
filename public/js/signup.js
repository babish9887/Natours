import axios from 'axios';
import { showAlert } from './alerts';

const signupform = document.querySelector('.form--signup');
if (signupform) {
    signupform.addEventListener('submit', e => {
        e.preventDefault();
        const name = document.getElementById('email').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirm_password = document.getElementById('confirm-password').value;
        if(password!==confirm_password)
            return showAlert('error',"Password doesn't match" );
        console.log({name, email, password})
        // signup({ name, email, password });
    });
}
export const signup = async ({ email, password }) => {
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
