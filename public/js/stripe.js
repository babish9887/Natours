import axios from 'axios';
import Stripe from 'stripe'
const stripe = Stripe('pk_test_51OuCwTSHzwqQQleJJp0rdqsZzcZ0OchODSLtJbUORskFsMhISJYugMwZG977FNMqDrN0PeIlVS3UbGa8luXzJ5aB00AjQhoWMq')


export const bookTour = async tourId =>{
    try{
    const session = await axios(
        `http://localhost:3000/api/v1/bookings/checkout-session/${tourId}`);


        window.location.href = session.data.session.url;
    } catch(err){
        console.log(err.message);
    }
    
}