import multer from "multer";

//multer is used to access the disk storage,file uploaded by user and it will be saved to local server 
//then cloudinary takes the files from  local-server and stores it 

// for better understanding refer docs 

const storage = multer.diskStorage({
    
    destination: function (req, file, cb) {
      cb(null, "./public") 
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname) 
    }
})
  
export const upload = multer({ storage:storage }) 

