const APIFeatures = require('./../utils/apiFeatures');

exports.deleteOne =  Model => async (req, res, next) => {
    try {
      const doc = await Model.findByIdAndDelete(req.params.id);
  
      if (!doc) {
        // return next(new AppError('No tour found with that ID', 404));
        res.status(401).json({ status: 'fail', message: 'No Document of that ID' });
      }
  
      res.status(204).json({
        status: 'success',
        data: null
      });
    } catch (err) {
      res.status(400).json({
        status: 'Fail from error',
        message: err.message
      });
    }
  };


  exports.updateOne= Model => async (req, res) => {
    try{
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
  
    if (!doc) {
      res.status(400).json({
        status: 'Fail ',
        message: "No Doc found"
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        doc
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail from error',
      message: err.message
    });
  }
  };



  exports.createOne = Model => async (req, res, next) => {
    try{
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: doc
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail from error',
      message: err.message
    });
  }
  };



exports.getOne = (Model , pops)=> async (req, res) => {
  let query=Model.findById(req.params.id);
  if(pops) query = query.populate(pops);
  const doc = await query
  // doc.findOne({ _id: req.params.id })
  if (!doc) {
    return res.status(400).json({
      status: 'Fail',
      message:"No doc found"
    })
  }

  res.status(200).json({
    status: 'success',
    data: {
      doc
    }
  });
};


exports.getAll = Model =>  async (req, res) => {
  //to allow for nexted GET reviews on tour
  let filter={}
  if(req.params.tourId) filter = {tour: req.params.tourId};


  const features = new APIFeatures(Model.find(filter), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const doc = await features.query;

  // SEND RESPONSE
  res.status(200).json({
    status: 'success',
    results: doc.length,
    data: {
      doc
    }
  });
};
