# MongoDB Setup Guide - Complete Instructions

## 🚨 IMPORTANT: Follow These Steps Exactly

### Step 1: MongoDB Atlas Configuration

#### 1.1 Access Your Cluster
1. Go to [https://cloud.mongodb.com/](https://cloud.mongodb.com/)
2. Sign in with your credentials
3. You should see cluster `cluster0.uqxzksy`

#### 1.2 Check Cluster Status
- Click **"Clusters"** in left sidebar
- Verify status shows **"Running"** 
- If paused, click cluster → **"Resume"**

#### 1.3 Configure Network Access (CRITICAL)
1. Click **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Choose **"Allow Access from Anywhere"** (0.0.0.0/0)
4. Click **"Confirm"**
5. Wait 2-3 minutes for changes to take effect

#### 1.4 Verify Database User
1. Click **"Database Access"** in left sidebar
2. Confirm user `shivamkumarvirtual_db_user` exists
3. If not, create it with password: `Mrz4sH3qblYJa7Rx`

### Step 2: Test Connection

After completing Atlas configuration, test the connection:

```bash
cd backend
npm start
```

**Expected Output:**
```
Server running on port 5000
Connected to MongoDB successfully
```

**If still failing, continue to Step 3.**

### Step 3: Alternative Solutions

#### Option A: Get Your Current IP Address
1. Visit [https://whatismyipaddress.com/](https://whatismyipaddress.com/)
2. Copy your IP address
3. In MongoDB Atlas → Network Access → Add IP Address
4. Paste your IP instead of "Allow from Anywhere"

#### Option B: Use Local MongoDB
If Atlas continues to fail:

1. **Install MongoDB Community Server:**
   - Download: [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Select Windows version
   - Complete installation with defaults

2. **Update Configuration:**
   Edit `backend/.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/industrial-solutions
   ```

3. **Start MongoDB Service:**
   - Open Services (Windows + R, type `services.msc`)
   - Find "MongoDB" service
   - Start the service

### Step 4: Seed Database (After Connection Works)

Once MongoDB is connected:

```bash
cd backend
npm run seed
```

This will populate your database with:
- Categories and subcategories
- Sample products
- Initial data structure

### Step 5: Verify Setup

1. **Backend Test:**
   ```bash
   cd backend
   npm start
   ```
   Should show "Connected to MongoDB successfully"

2. **API Test:**
   Open browser: `http://localhost:5000/api/health`
   Should return: `{"status":"Server is running"}`

3. **Categories Test:**
   Open browser: `http://localhost:5000/api/categories`
   Should return categories data

## 🔍 Troubleshooting

### Error: "querySrv ECONNREFUSED"
- **Cause**: Network access not configured in Atlas
- **Fix**: Complete Step 1.3 above

### Error: "Authentication failed"
- **Cause**: Incorrect username/password
- **Fix**: Verify database user credentials in Atlas

### Error: "connect ECONNREFUSED 127.0.0.1:27017"
- **Cause**: Local MongoDB not installed/running
- **Fix**: Install MongoDB Community Server

## 📞 Support

If you continue having issues:
1. Check MongoDB Atlas status page
2. Verify your internet connection
3. Try a different network if possible
4. Consider using local MongoDB as fallback

## ✅ Success Checklist

- [ ] MongoDB Atlas cluster is running
- [ ] Network access configured (0.0.0.0/0 or your IP)
- [ ] Database user exists with correct password
- [ ] Backend shows "Connected to MongoDB successfully"
- [ ] Database seeded with initial data
- [ ] All API endpoints return data

Once connected, your website will have a fully functional MongoDB database!
