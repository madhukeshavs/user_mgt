export const generateResponse = (status, message, data) => {
    return {
        status: status || 200,
        message: message || "Request was successful",
        data: data || []
    };
}