// pages/api/auth/[provider].js
import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import axios from 'axios'

export default NextAuth({
  providers: [
    Providers.OAuth2({
      id: 'unity-wallet-api',
      name: 'Unity Wallet API',
      scope: 'email',
      clientId: 'your-client-id',
      clientSecret: 'your-client-secret',
      authorizationUrl: 'https://render-url.com/o/oauth2/auth',
      tokenUrl: 'https://render-url.com/o/oauth2/token',
      profileUrl: 'https://www.render-url.com/oauth2/v1/userinfo',
      async profile(profile: any, tokens: any) {
        const { data } = await axios.get(profileUrl, {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        })

        return {
          id: data.id,
          name: data.name,
          email: data.email,
        }
      },
    }),
  ],

  // Optional SQL or MongoDB database to persist users
  database: process.env.DATABASE_URL,

  // Optional JWT encryption
  secret: process.env.JWT_SECRET,

  // Optional callback functions
  callbacks: {
    async signIn(user, account, profile) {
      // You can perform additional validation here or
      // redirect the user to a specific URL based on their account type.
      return true
    },
    async redirect(url, baseUrl) {
      // You can customize the redirect URL here or
      // redirect the user to a specific URL based on their account type.
      return url.startsWith(baseUrl) ? url : baseUrl
    },
  },
})
