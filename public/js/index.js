import '@babel/polyfill';

import {updateData} from './updateSettings';
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');

const bookBtn = document.getElementById('book-tour');
import { bookTour } from './stripe';



if (bookBtn){
bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
});
}

if(userDataForm){
    userDataForm.addEventListener('submit', e=>{
        e.preventDefault();
        const form = new FormData()
        form.append('name',document.getElementById('name').value);
        form.append('email',document.getElementById('email').value);

        form.append('photo', document.getElementById('photo').files[0]);
        console.log("The Form is", form)
        // const name=document.getElementById('name').value
        // const email=document.getElementById('email').value
        updateData(form, 'data')

    })
}


if(userPasswordForm){
    userPasswordForm.addEventListener('submit', async e=>{
        e.preventDefault();
        document.querySelector('.btn--save-password').textContent= 'Updating...';
        const passwordCurrent=document.getElementById('password-current').value
        const password=document.getElementById('password').value
        const passwordConfirm=document.getElementById('password-confirm').value

        await updateData({passwordCurrent, password, passwordConfirm}, 'password')

        document.querySelector('.btn--save-password').textContent= 'Save password';

        document.getElementById('password-current').value= '';
        document.getElementById('password').value= '';
        document.getElementById('password-confirm').value= '';

    })
}




console.log('index.js')