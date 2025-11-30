# Firebase Setup Instructions

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard:
   - Enter project name (e.g., "medical-profile-website")
   - Enable Google Analytics (optional)
   - Click "Create project"

## Step 2: Enable Authentication

1. In Firebase Console, go to **Authentication**
2. Click **Get Started**
3. Enable **Email/Password** authentication
4. Click **Save**

## Step 3: Create Firestore Database

1. In Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
4. Select a location (choose closest to your users)
5. Click **Enable**

## Step 4: Set Up Storage (OPTIONAL - Skip This!)

**You can SKIP this step!** Storage is optional. The app currently stores images as base64 strings in Firestore, which works perfectly fine.

**Only set up Storage if you want to:**
- Store large files separately
- Reduce Firestore document size
- Use Firebase Storage features

**To skip Storage:**
- Just continue to Step 5. The app will work fine without it.

**If you want to set up Storage anyway:**
1. In Firebase Console, go to **Storage**
2. Click **Get started**
3. Start in test mode
4. Choose a location
5. Click **Done**

**Note:** Firebase Storage has a free tier (5GB storage, 1GB/day downloads), but you don't need it for this app.

## Step 5: Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to **Your apps**
3. Click the **Web** icon (`</>`)
4. Register your app (name it "Medical Profile Website")
5. Copy the Firebase configuration values

## Step 6: Add Environment Variables

1. Create a `.env.local` file in the root of your project
2. Add the following variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Note:** Even if you skip Storage setup, Firebase still provides a `storageBucket` value in the config. Just copy it from Firebase Console - you don't need to actually enable Storage. The app will work fine without Storage enabled.

Replace the values with your actual Firebase config values from Step 5.

## Step 7: Install Dependencies

Run:
```bash
npm install
```

This will install Firebase SDK.

## Step 8: Set Up Firestore Security Rules

1. In Firebase Console, go to **Firestore Database** > **Rules**
2. Replace with these rules (for development):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Medical data - users can only access their own
    match /conditions/{conditionId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    match /medications/{medicationId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    match /scans/{scanId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    match /labResults/{labResultId} {
      allow read, write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    match /profiles/{userId} {
      allow read, write: if request.auth != null && 
        request.auth.uid == userId;
    }
    
    // Share links - anyone can read if they have the token
    match /shareLinks/{shareLinkId} {
      allow read: if true; // Public read for share links
      allow write: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
    
    // Community messages - anyone authenticated can read/write
    match /communityMessages/{messageId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow delete: if request.auth != null && 
        resource.data.userId == request.auth.uid;
    }
  }
}
```

3. Click **Publish**

## Step 9: Set Up Storage Rules (OPTIONAL - Skip If You Skipped Step 4)

**Skip this if you skipped Storage setup!**

If you set up Storage, configure the rules:

1. In Firebase Console, go to **Storage** > **Rules**
2. Replace with:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /scans/{userId}/{allPaths=**} {
      allow read: if true; // Public read for shared scans
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /labResults/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /profiles/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **Publish**

## Step 10: Test the Setup

1. Start your development server: `npm run dev`
2. Try registering a new user
3. Check Firebase Console to see if data appears in Firestore

## Troubleshooting

- **"Firebase not initialized"**: Make sure `.env.local` file exists with correct values
- **Permission denied**: Check Firestore security rules
- **Auth errors**: Make sure Email/Password auth is enabled in Firebase Console

