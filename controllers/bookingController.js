const stripe = require('stripe')(process.env.SECRET_KEY);
const Tour = require('../models/tourModel');
const Booking = require('../models/bookingModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.getCheckoutSession = async (req, res, next) => {
    try {
        const tour = await Tour.findById(req.params.tourId);
        if (!tour) {
            return res.status(404).json({ message: 'Tour not found' });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            success_url: `${req.protocol}://${req.get('host')}/?tour=${req.params.tourId}&user=${req.user.id}&price=${tour.price}`,
            cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
            customer_email: req.user.email,
            client_reference_id: req.params.tourId,
            mode: 'payment', // Specify mode as 'payment' for one-time payments
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: `${tour.name} Tour`,
                            description: tour.summary,
                        },
                        unit_amount: tour.price * 100, // Convert price to cents
                    },
                    quantity: 1
                }
            ],
            billing_address_collection: 'required', // Collect customer address
        });
        res.status(200).json({
            status: 'success',
            session
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



exports.createBookingCheckout = async (req, res, next) => {
try{
  // This is only TEMPORARY, because it's UNSECURE: everyone can make bookings without paying
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) return next();
  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);


} catch(err){
    res.status(500).json({ error: err.message });

}
};

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
