const mapAxiosErrors = (error: any) => {
    if (error.response) {
        // Request made and server responded
        return error.response.data;
    } else if (error.request) {
        // The request was made but no response was received
        return { error: "Somthing went wrong" };
    } else {
        // Something happened in setting up the request that triggered an Error
        return { error: "Somthing went wrong" };
    }
};

export default mapAxiosErrors;
