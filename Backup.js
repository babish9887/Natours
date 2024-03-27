const Tour=require('./../models/tourModel')
const APIFeatures=require('./../utils/apiFeatures');
const catchAsync=require('./../utils/catchAsync')

// const tours = JSON.parse(
//     fs.readFileSync(`${__dirname}/..//dev-data/data/tours-simple.json`)
//   );
exports.aliasTopTours=(req, res, next)=>{
  req.query.limit='5';
  req.query.sort='-ratingAverage,price';
  req.query.fields='name, price,ratingAverage,summary,difficulty';
  next();
}


exports.getAllTours = catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  });
  
  exports.getTour =  catchAsync(async (req, res) => {

      const tour=await Tour.findById(req.params.id);
      res.status(200).json({
        status: 'success',
        requestedAt: req.requestTime,
        data: {
          tour,
        },
      });
 
    // if (id > tours.length) {
    //   return res.status(404).json({
    //     status: 'fAIL',
    //     message: 'Invalid Id',
    //   });
    // }
  
    // const tour = tours.find((tour) => tour.id === id);
    // if (!tour) {
    //   res.status(404).json({ status: 'NOT found', message: 'Invalid Id' });
    // }
    // res.status(200).json({
    //   status: 'success',
    //   data: {
    //     tour,
    //   },
    // });
  });


  
  exports.createTour =catchAsync(async (req, res, next) => {
    const newTour= await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
        data: {
          tour: newTour,
        },
      });
    // try{
    // }catch(err){
    //   res.status(400).json({
    //     status: 'fail',
    //     message: 'Invalid data sent'
    //   })
    // }

    // console.log(req.body);
  
    // const newId = tours[tours.length - 1].id + 1;
    // const newTour = Object.assign({ id: newId }, req.body);
  
    // tours.push(newTour);
    // fs.writeFile(
    //   `${__dirname}/dev-data/data/tours-simple.json`,
    //   JSON.stringify(tours),
    //   (err) => {
    //     res.status(201).json({
    //       status: 'success',
    //       data: {
    //         tour: newTour,
    //       },
    //     });
    //   }
    // );
  });
  
  exports.updateTour =  catchAsync(async (req, res) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      })
      res.status(200).json({
        status: 'success',
        data: {
          tour,
        },
      });
 
  });
  
  exports.deleteTour =  catchAsync(async (req, res) => {
    const tour=await Tour.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      data: {
        tour,
      },
    });
  });

  exports.getTourStats =  catchAsync(async (req, res) => {
      const stats = await Tour.aggregate([
        {
          $group: {
            _id: {$toUpper: '$difficulty'},
            numTours:{$sum: 1},
            numRatings: {$sum: '$ratingsQuantity'},
            avgRating: { $avg: '$rating' },
            avgPrice: { $avg: '$price' },
            minPrice: { $min: '$price' },
            maxPrice: { $max: '$price' }
          }
        },{
          $sort: {avgPrice: 1}
        },{
          // $match: {_id: {$ne: 'EASY'}}
          $match: {}

        }
      ]);
  
      res.status(200).json({
        status: 'success',
        data: {
          stats
        }
      });
  
  });


  exports.getMonthlyPlan= catchAsync(async (req, res)=>{
      const year=req.params.year*1;
      const plan=await Tour.aggregate([
        {
          $unwind: '$startDates'
        },{
          $match: {
            startDates: {
              $gte: new Date(`${year}-01-01`),
              $lte:new Date(`${year}-12-31`), 
            }
          }
        },{
          $group: {
            _id: {$month: '$startDates'},
            numTourStarts: {$sum: 1},
            tours: {$push: '$name'}
          }
        },{
            $addFields:{ month: '$_id' }
        },{
          $project: {
            _id: 0
          }
        }, {
          $sort: { numTourStarts:1}
        },{
          $limit: 12
        }
      ])

      res.status(200).json({
        status: 'success',
        data: {
          plan
        }
      });

  });







//////////////////////////////////////////////////////////////////////////
// doctype html
// html 
//     head 
//         title Natours | #{tour}
//         link(rel='stylesheet' href='css/style.css' )
//         link(rel='shortcut icon' type='image/png' href='img/favicon.png')
//     body 
//         h1= tour
//         h2= user.toUpperCase()
//         // h1 The Park Camper

//         - const x=9;
//         h2= x*2

//         p This is just some text!