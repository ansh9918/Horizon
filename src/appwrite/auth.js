import { Client, Account, ID, Databases } from 'appwrite';
import conf from '../conf/conf';

export class AuthService {
  client = new Client();
  account;
  databases;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.account = new Account(this.client);
    this.databases = new Databases(this.client);
  }

  async createAccount({ email, password, name, profilePhoto }) {
    const userAccount = await this.account.create(
      ID.unique(),
      email,
      password,
      name,
    );

    await this.databases.createDocument(
      conf.appwriteDatabaseId,
      conf.appwriteCollection2Id,
      userAccount.$id,
      {
        name: name,
        email: email,
        profilePhoto: profilePhoto,
        favouriteBlogs: [],
      },
    );
    if (userAccount) {
      return userAccount;
    }
  }

  async login({ email, password }) {
    try {
      await this.account.createEmailPasswordSession(email, password);
      const response = await this.getCurrentUser();

      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async logout() {
    try {
      this.account.deleteSession('current');
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      const user = await this.account.get();
      return user;
      // eslint-disable-next-line no-unused-vars
    } catch (error) {
      return null;
    }
  }
}

const authService = new AuthService();
export default authService;
