const asyncHandler = (asyncFn) => {
    return (req, res, next) => {
        asyncFn(req, res, next).catch((err) => {
            next(err);
        });
    };
};

const normalHandler = (normalFn) => {
    return (req, res, next) => {
        try {
            normalFn(req, res, next);
        } catch (err) {
            next(err);
        }
    };
};

module.exports = {
    asyncHandler,
    normalHandler
}