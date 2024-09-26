// This classs is defined for overriding the error by Error class 
// and modified to our uses 
// Error class will be inherited and overridded 
 

class ApiError extends Error {
    constructor(
        statusCode ,
        message="Something went wrong",
        errors =[],// 
        stack=""
    ) {
        super(message)
        this.statusCode = statusCode
        this.message = message
        this.errors = errors
        this.data = null // data will be null in fail case 
        this.success = false 
        
        if(stack) {
            this.stack = stack
        }
        else{
            Error.captureStackTrace(this, this.constructor)
        }
        
    }
}

export {ApiError}
