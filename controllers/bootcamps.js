const ErrorResponse = require("../utils/errorResponse");
const Bootcamp = require("../models/Bootcamp");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");

//@desc       Get all bootcamps
//@route      GET /api/vi/bootcamps
//@access     Public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  //  Copy req.query
  const reqQuery = { ...req.query };

  //Fields to exclude
  const removeFields = ["select"];

  //  Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param]);

  console.log(reqQuery);

  //  Create query string
  let quertStr = JSON.stringify(reqQuery);

  // Create operators ($gt , $gte , etc)
  quertStr = quertStr.replace(
    /\b(gt|gte|lt|lte|in)\b/g,
    (match) => `$${match}`
  );

  // Finding resourse
  query = Bootcamp.find(JSON.parse(quertStr));

  //SELECT Fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }
  try {
    //  Executing query
    const bootcamps = await query;

    res
      .status(200)
      .json({ success: true, count: bootcamps.length, data: bootcamps });
  } catch (err) {
    next(err);
  }
});

//@desc       Get single bootcamp
//@route      GET /api/vi/bootcamps/:id
//@access     Public
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);

    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }

    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    // res.status(400).json({ success: false });
    next(err);
  }
});

//@desc       Create new bootcamp
//@route      POST /api/vi/bootcamps
//@access     Private
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (err) {
    next(err);
  }
});

//@desc       Update bootcamp
//@route      PUT /api/vi/bootcamps/:id
//@access     Private
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bootcamp) {
      return res.status(400).json({ success: false });
    }
    return next(
      new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
    );
  } catch (error) {
    next(err);
  }
});

//@desc       Delete bootcamp
//@route      DELETE /api/vi/bootcamps/:id
//@access     Private
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);

    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(err);
  }
});
//@desc       Get bootcamp within a radius
//@route      Get /api/v1/bootcamps/radius/:zipcode/:distance
//@access     Private
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  //Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  //Calc radius using radians
  //Divide distance by redius of Earth
  //Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963;
  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  }).sort("-location");

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  });
});
