export const createResponse = (statusCode = 500, data = null, message = 'Something Went Wrong!', meta = null, other) => {
    return {
        statusCode: statusCode,
        data: data,
        message: message,
        meta: meta
    }
}