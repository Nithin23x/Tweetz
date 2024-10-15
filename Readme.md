## A Full Stack Twitter/X clone


### Frontend - React.js, Tanstack query, Tailwind CSS,
### Backend - Node.js,mongoose,express.js,MongoDB,JWT,Cloudinary,cookie-parser


[Demo Video on Youtube](https://www.youtube.com/watch?v=vxokhyoUTbY&t=146s)  

## Application Snapshots 
![Screenshot from 2024-10-15 14-53-21](https://github.com/user-attachments/assets/412f95b9-2ca2-46a8-bf6a-8eb26eb3e8f9)

![Screenshot from 2024-10-15 14-53-39](https://github.com/user-attachments/assets/7b53efa3-d50c-4a1b-8418-bbe669861bbd)

![Screenshot from 2024-10-15 14-54-04](https://github.com/user-attachments/assets/990c9568-e0b7-43dd-8e62-e510eb2394f0)

![Screenshot from 2024-10-15 14-54-21](https://github.com/user-attachments/assets/d32ddf4b-0f72-422b-8a1b-3c0c66cff49a)


Some Features:

-   ⚛️ Tech Stack: React.js, MongoDB, Node.js, Express, Tailwind
-   🔐 Authentication with JSONWEBTOKENS (JWT)
-   🔥 React Query for Data Fetching, Caching etc.
-   👥 Suggested Users to Follow
-   ✍️ Creating Posts
-   🗑️ Deleting Posts
-   💬 Commenting on Posts
-   ❤️ Liking Posts
-   🔒 Delete Posts (if you are the owner)
-   📝 Edit Profile Info
-   🖼️ Edit Cover Image and Profile Image
-   📷 Image Uploads using Cloudinary
-   🔔 Send Notifications
-   🌐 Deployment
-   ⏳ And much more!

### Setup .env file for Backend

```js
CORS_ORIGIN = *
MONGODB_URL=
PORT=

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=

REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=7d

CLOUDINARY_USERNAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Build the app

### Frontend Setup

#### Enter into the frontend directory
 ```shell
cd frontend
``` 
#### Install the dependencies
```shell
npm install
```

#### Run the frontend
```shell
npm run dev
```

### Backend Setup

#### Enter into the backend directory
```shell
cd backend
``` 
#### Install the backend dependencies
```shell
npm install
```

#### Configure the MongoDB url in .env files 
```shell
MONGODB_URL 
```

#### Setup the cloudinary Account and copy the details such as username and secret key 

```shell
CLOUDINARY_USERNAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

#### Start Backend Server 
```shell
npm run dev
```
