import { Client, ID, Databases, Storage, Query } from 'appwrite';
import conf from '../conf/conf';

export class Service {
  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async createPost({
    title,
    content,
    slug,
    featuredImage,
    status,
    userId,

    category,
  }) {
    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        ID.unique(),
        {
          title,
          content,
          featuredImage,
          status,
          userId,
          slug,
          category,
        },
      );
    } catch (error) {
      console.log('Error creating post:', error);
      throw error;
    }
  }

  async updatePost(
    blogId,
    { slug, title, content, featuredImage, status, category },
  ) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        blogId,
        {
          title,
          content,
          featuredImage,
          status,
          slug,
          category,
        },
      );
    } catch (error) {
      console.log('Error updating post:', error);
    }
  }

  async deletePost(blogId) {
    try {
      await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        blogId,
      );
      return true;
    } catch (error) {
      console.log('Error deleting post:', error);
      return false;
    }
  }

  async getPostBySlug(slug) {
    try {
      const response = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        [Query.equal('slug', slug)],
      );
      if (response.documents.length > 0) {
        return response.documents[0];
      } else {
        throw new Error('Blog not found');
      }
    } catch (error) {
      console.error('Error fetching post by slug:', error);
      throw error;
    }
  }

  async getPost(blogId) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        blogId,
      );
    } catch (error) {
      console.log('Error getting post:', error);
    }
  }

  async getUser(userId, queries = [Query.equal('$id', userId)]) {
    try {
      const response = await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollection2Id,
        queries,
      );
      return response.documents[0];
    } catch (error) {
      console.log('Error getting user:', error);
    }
  }

  async getPosts(queries = []) {
    try {
      // Merge default query with additional queries
      const defaultQuery = Query.equal('status', 'active');
      const combinedQueries = [defaultQuery, ...queries];

      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId,
        combinedQueries,
      );
    } catch (error) {
      console.error('Error getting posts:', error);
      return null; // Return null in case of error for better error handling
    }
  }

  async UploadFile(file) {
    try {
      return await this.bucket.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file,
      );
    } catch (error) {
      console.log('Error uploading file:', error);
      return false;
    }
  }

  async deleteFile(fileId) {
    try {
      await this.bucket.deleteFile(conf.appwriteBucketId, fileId);
      return true;
    } catch (error) {
      console.log('Error deleting file:', error);
      return false;
    }
  }

  async getfilePreview(fileId) {
    return this.bucket.getFileView(conf.appwriteBucketId, fileId);
  }

  async addFavouriteBlog(userId, blogId) {
    try {
      const userDoc = await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollection2Id,
        userId,
      );
      const favouriteBlogs = userDoc.favouriteBlogs || [];

      if (!favouriteBlogs.includes(blogId)) {
        favouriteBlogs.push(blogId);

        await this.databases.updateDocument(
          conf.appwriteDatabaseId,
          conf.appwriteCollection2Id,
          userId,
          {
            favouriteBlogs,
          },
        );

        console.log('Favorite blogs updated:', favouriteBlogs);
      } else {
        console.log('Blog is already in favorites.');
      }
    } catch (error) {
      console.error('Error updating favorite blogs:', error.message);
    }
  }

  async removeFavouriteBlogs(userId, blogId) {
    try {
      const userDoc = await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollection2Id,
        userId,
      );
      const favouriteBlogs = userDoc.favouriteBlogs || [];

      // Remove the blog ID if it exists in the array
      const updatedFavourites = favouriteBlogs.filter((id) => id !== blogId);

      await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollection2Id,
        userId,
        {
          favouriteBlogs: updatedFavourites,
        },
      );

      console.log('Favorite blogs updated:', updatedFavourites);
    } catch (error) {
      console.error('Error updating favorite blogs:', error.message);
    }
  }

  async getFavouriteBlogs(userId) {
    try {
      // Fetch the user's document to get the list of favorite blogs
      const userDoc = await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollection2Id,
        userId,
      );

      const favouriteBlogs = userDoc.favouriteBlogs || [];

      if (favouriteBlogs.length === 0) {
        return []; // Return an empty array if no favorite blogs
      }

      // Fetch blog details for each favorite blog
      const blogDetails = await Promise.all(
        favouriteBlogs.map(async (blogId) => {
          try {
            const blogDoc = await this.databases.getDocument(
              conf.appwriteDatabaseId,
              conf.appwriteCollectionId, // Replace with the correct blog collection ID
              blogId,
            );
            const featuredImageUrl = await service.getfilePreview(
              blogDoc.featuredImage,
            );
            // Fetch user details for the blog's author
            const author = await service.getUser(blogDoc.userId);
            const profilePhotoUrl = await service.getfilePreview(
              author.profilePhoto,
            );

            return {
              ...blogDoc,
              featuredImageUrl,
              author: author.name,
              authorImage: profilePhotoUrl,
            };
          } catch (err) {
            console.error(`Error fetching blog with ID ${blogId}:`, err);
            return null; // Skip if there's an error for a particular blog
          }
        }),
      );

      // Filter out any null values (failed fetches)
      return blogDetails.filter((blog) => blog !== null);
    } catch (error) {
      console.error('Error getting favorite blogs:', error);
      return [];
    }
  }
}
const service = new Service();
export default service;
