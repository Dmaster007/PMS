import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import axios from 'axios';
import User from './users/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { UsersService } from './users.service';
// import { HttpBackend, HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Auth0ApiService {
  private auth0Domain = 'dev-n1lb40exoxfu2fwu.us.auth0.com'; // Replace with your Auth0 domain
  private managementApiUrl = `https://dev-n1lb40exoxfu2fwu.us.auth0.com/api/v2`;
  private clientId = 'kksrYUZwOo41CFFlsB5vt51l1veB7EUw'; // Replace with your Auth0 client ID
  private clientSecret =
    'es91JEvwqEp3Fvl0SDHtrOLBEeGLyGZ_zmeMW-pcGS4Ri7Jq8JXrW3dsZjiAhsYj';
  
  users: any = [];
  user :any = {};
  user2:any ={};

  private userSubscription: Subscription = new Subscription();
  token: string = ''; // Initialize token property
  token2: string = ''; // Initialize token property
  constructor(private auth: AuthService, private http: HttpClient) {
    // Check if token exists in localStorage
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      this.token = storedToken;
    } else {
      this.initializeToken(); // Initialize token if not found
    }
    // this.userSubscription = this.auth.user$.subscribe((data) => {
    //   this.user = data;
    //    // Assuming data is your user object emitted by user$
    //   //  this.user = this.userSer.users.find((user)=> user.email === this.user.email);
    // });
  }
  // ngOnDestroy(): void {
  //   if (this.userSubscription) {
  //     this.userSubscription.unsubscribe(); // Unsubscribe to prevent memory leaks
  //   }
  // }
  private initializeToken(): void {
    const accessToken = this.logAuthenticatedUserAccessToken();
    if (accessToken) {
      this.token = accessToken;
    }
  }
  private logAuthenticatedUserAccessToken(): string {
    let token: string = '';

    this.auth.idTokenClaims$.subscribe((idToken) => {
      token = idToken?.__raw || '';
      // console.log('Access Token of the authenticated user:', token);
      localStorage.setItem('token', token);
    });

    return token;
  }

  async createUser(
    email: string,
    password: string,
    name: string
  ): Promise<any> {
    try {
      const token = await this.getAccessToken();

      const response = await axios.post(
        `${this.managementApiUrl}/users`,
        {
          email,
          password,
          name,
          connection: 'Username-Password-Authentication', // Replace with your Auth0 connection name
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // async deleteUser(userId: string): Promise<void> {
  //   try {
  //     const token = await this.getAccessToken();

  //     await axios.delete(`${this.managementApiUrl}/users/${userId}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     console.log(`User with ID ${userId} deleted successfully.`);
  //   } catch (error) {
  //     console.error('Error deleting user:', error);
  //     throw error;
  //   }
  // }
  async deleteUserByEmail(email: string): Promise<void> {
    try {
      const token = await this.getAccessToken();

      // First fetch the user ID based on email
      const userResponse = await axios.get(
        `${this.managementApiUrl}/users-by-email`,
        {
          params: {
            email,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const userId = userResponse.data[0]?.user_id; // Assuming users-by-email endpoint returns an array

      if (!userId) {
        throw new Error(`User with email ${email} not found.`);
      }

      // Delete the user using the fetched user ID
      await axios.delete(`${this.managementApiUrl}/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log(`User with email ${email} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
  async updateUser(userId: string, updatedUserData: any): Promise<any> {
    try {
      const token = await this.getAccessToken();

      const response = await axios.patch(
        `${this.managementApiUrl}/users/${userId}`,
        updatedUserData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  private async getAccessToken(): Promise<string> {
    if (this.token2) {
      return this.token2;
    }

    try {
      const response = await axios.post(
        `https://${this.auth0Domain}/oauth/token`,
        {
          client_id: this.clientId,
          client_secret: this.clientSecret,
          audience: `${this.managementApiUrl}/`,
          grant_type: 'client_credentials',
        }
      );

      this.token2 = response.data.access_token;
      return this.token2;
    } catch (error) {
      console.error('Error getting access token:', error);
      throw error;
    }
  }
}
