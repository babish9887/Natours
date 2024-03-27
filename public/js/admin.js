import axios from 'axios';

const deleteTourAdminBtn=document.getElementById('deletetourbyAdmin');
if(deleteTourAdminBtn){
    deleteTourAdminBtn.addEventListener('click', e=>{
    e.preventDefault();
    e.target.value='Deleting...'
    const tourId=document.getElementById('tourid').value
    DeleteTourByAdmin({tourId})
    // console.log(tourId)
    })
}


const DeleteTourByAdmin=async ({tourId})=>{
    try {
        const res = await axios({
            method: 'POST',
            url: `http://localhost:3000/api/v1/tours/${tourId}`,
        });
        if (res.data.status === 'success') {
            deleteTourAdminBtn.value='Deleted'
            showAlert('success', 'Tour Deleted Successfully');
        }
    } catch (e) {
        deleteTourAdminBtn.value='Delete Failed!'

        showAlert('error', e.response.data.message);
    }
}

export const showAlert = (type, msg) => {
    hideAlert();
    const markup = `<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
    window.setTimeout(hideAlert, 5000);
}


