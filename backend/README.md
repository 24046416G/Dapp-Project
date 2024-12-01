# COMP5565 Decentralized Apps Fundamentals and Development

## Group Project - Backend Installation Guide

Welcome to the backend installation guide for our decentralized application project. This guide will help you set up the necessary environment to run the backend service.

### Prerequisites

Before you begin, ensure you have the following:

- An account on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
- Node.js and npm installed on your machine

### Steps to Set Up the Backend

1. **Register an Account on MongoDB Atlas** - Create your account [here](https://www.mongodb.com/cloud/atlas/register).

   ![MongoDB Atlas Registration](/backend/guide/image.png)

2. **Enter Basic Information**

   ![Basic Information](/backend/guide/image-1.png)

3. **Choose the Free Plan** - Click on "Create Deployment":

   ![Free Plan Selection](/backend/guide/image-2.png)

4. **Create a Database User**

   ![Database User Creation](/backend/guide/image-3.png)

5. **Choose a Connection Method** - Select "Drivers" under "Connect to your application":

   ![Connection Method](/backend/guide/image-4.png)

6. **Copy the Connection String** - Go back to our project:

   ![Connection String](/backend/guide/image-5.png)

7. **Navigate to the Backend Folder**
   ```bash
   cd backend
   ```

8. **Create an Environment Variables File**
   - Create a file named `.env` and paste the connection string you copied in step 6:
   ```env
   MONGODB_URI=connection_string
   ```

9. **Install Necessary Packages**
   ```bash
   npm install
   ```

10. **Start the Backend**
    ```bash
    npm start
    ```

### Successful Startup Message

If you see the following message in your terminal, the backend has started successfully:
```
Successfully connected to MongoDB.
```

### Conclusion

You are now ready to use the backend service for your decentralized application. If you encounter any issues, please refer to the troubleshooting section or contact the project team for assistance.
