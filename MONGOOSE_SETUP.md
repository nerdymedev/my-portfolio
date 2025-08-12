# Mongoose Integration Setup

This portfolio website has been successfully migrated from localStorage to MongoDB using Mongoose for persistent data storage.

## What Changed

### Database Migration
- **Projects**: Migrated from `localStorage` to MongoDB with full CRUD operations
- **Resume**: Enhanced with metadata storage in MongoDB while keeping files in Cloudinary
- **Authentication**: Still uses localStorage (can be upgraded to database sessions later)

### New API Endpoints

#### Projects API
- `GET /api/projects` - Fetch all projects with optional filtering, searching, and sorting
- `POST /api/projects` - Create a new project
- `GET /api/projects/[id]` - Get a specific project
- `PUT /api/projects/[id]` - Update a specific project
- `DELETE /api/projects/[id]` - Delete a specific project

#### Enhanced Resume API
- `GET /api/resume` - Get active resume with metadata (URL, filename, size, upload date)
- `POST /api/resume` - Upload resume to Cloudinary and save metadata to MongoDB
- `DELETE /api/resume` - Delete resume from both Cloudinary and MongoDB

## Setup Instructions

### 1. Install Dependencies
```bash
npm install mongoose @types/mongoose
```

### 2. Database Configuration

#### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. Update `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/portfolio-website
```

#### Option B: MongoDB Atlas (Recommended)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string
4. Update `.env.local`:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

### 3. Environment Variables
Ensure your `.env.local` file contains:
```env
# MongoDB Configuration
MONGODB_URI=your_mongodb_connection_string

# Cloudinary Configuration (for file uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Database Schema

### Project Schema
```javascript
{
  title: String (required),
  description: String (required),
  technologies: [String] (required),
  githubUrl: String (optional),
  liveUrl: String (optional),
  imageUrls: [String] (default: []),
  category: String (required),
  date: Date (required),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

### Resume Schema
```javascript
{
  filename: String (required),
  originalName: String (required),
  cloudinaryUrl: String (required),
  cloudinaryPublicId: String (required),
  fileSize: Number (required),
  uploadDate: Date (default: now),
  isActive: Boolean (default: true),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## Key Features

### Data Persistence
- Projects and resume metadata are now stored in MongoDB
- Data persists across browser sessions and devices
- No more data loss when clearing browser storage

### API-First Architecture
- All data operations go through REST API endpoints
- Consistent data handling across all pages
- Easy to extend with additional features

### Error Handling
- Graceful fallbacks to default data if API fails
- Proper error logging and user feedback
- Validation on both client and server sides

### Performance
- Efficient database queries with Mongoose
- Connection pooling and caching
- Optimized for production deployment

## Migration Notes

### Backward Compatibility
- Pages still show default projects if API fails
- Existing Cloudinary integration unchanged
- Authentication system remains the same

### Data Migration
If you have existing projects in localStorage:
1. Export them from browser developer tools
2. Use the dashboard to manually re-add them
3. Or create a migration script to bulk import

## Next Steps

### Recommended Enhancements
1. **Authentication**: Migrate to database-based sessions
2. **User Management**: Add user accounts and project ownership
3. **Analytics**: Track project views and interactions
4. **Search**: Implement full-text search with MongoDB Atlas Search
5. **Caching**: Add Redis for improved performance
6. **Backup**: Set up automated database backups

### Production Deployment
1. Use MongoDB Atlas for production database
2. Set up proper environment variables
3. Enable database monitoring and alerts
4. Configure connection pooling for high traffic

## Troubleshooting

### Common Issues

1. **Connection Failed**
   - Check MongoDB URI format
   - Verify network access (Atlas IP whitelist)
   - Ensure database user has proper permissions

2. **API Errors**
   - Check browser console for detailed errors
   - Verify environment variables are set
   - Test database connection independently

3. **Data Not Showing**
   - Check if database is empty (expected for new setup)
   - Verify API endpoints are working
   - Check for JavaScript errors in console

### Development Tips
- Use MongoDB Compass for database visualization
- Enable debug logging in development
- Test API endpoints with tools like Postman
- Monitor database performance with Atlas metrics