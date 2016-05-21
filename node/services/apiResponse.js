module.exports = function() {

    function fail(res, data, code) {
        res.status(code || 400).send({
            success: false,
            response: data ? data : undefined
        });
    }

    function success(res, data, code) {
        res.status(code || 200).send({
            success: true,
            response: data ? data : undefined
        });
    }

    return {
        fail: fail,
        success: success
    }
};