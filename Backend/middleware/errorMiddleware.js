const notFound = (req, res, next) => {
    //if the entered url doesn't match with any of the routes then return error with entred url not found
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

//some other error
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({ message: err });
};

module.exports = { notFound, errorHandler };