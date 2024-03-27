const bookBtn = document.getElementById('book-tour');
import axios from 'axios';
import { bookTour } from './stripe';
import { showAlert } from './alerts';




if(bookBtn){
bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
});
}

const reviewTourBtn=document.getElementById('review-tour')
if(reviewTourBtn){
    reviewTourBtn.addEventListener('click', e=>{
        const review=document.getElementById('reviewInput').value;
        const tourId=document.getElementById('tourid').value;
        const userId=document.getElementById('userid').value;

        e.target.textContent='Submitting...';
        reviewTour({review, tourId, userId});
    })
}

export const reviewTour=async ({review, tourId, userId})=>{
    try {
        const res = await axios({
            method: 'POST',
            url: `http://localhost:3000/api/v1/tours/${userId}/reviews`,
            data: {
                rating: 4,
                review: review,
                tour: tourId
            }
        });
        if (res.data.status === 'success') {
            reviewTourBtn.textContent='Submitted';
            showAlert('success', 'Reviewed Successfully');
        }
    } catch (e) {
        reviewTourBtn.textContent='Submit Failed';

        showAlert('error', e.response.data.message);
    }
}

const deleteTourBtn=document.getElementById('delete-tour')
if(deleteTourBtn){
    deleteTourBtn.addEventListener('click', e=>{
        e.target.textContent='Updating...';
        const review=document.getElementById('reviewInput').value;
        const reviewId=document.getElementById('reviewid').value;
        DeleteTour({review,reviewId});
    })
}

export const DeleteTour=async ({review,reviewId})=>{
    try {
        const res = await axios({
            method: 'PATCH',
            url: `http://localhost:3000/api/v1/reviews/${reviewId}`,
            data: {
                review: review,
            }
        });
        if (res.data.status === 'success') {
            deleteTourBtn.textContent='Updated';
            showAlert('success', 'Review Upadated Successfully');
        }
    } catch (e) {
        deleteTourBtn.textContent='Update Failed';

        showAlert('error', e.response.data.message);
    }
}

