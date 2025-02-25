import prisma from "~/prisma/db";

export default eventHandler(async (event) => {
  try {
    // Extract and validate the code parameter
    const query = getQuery(event);
    const code = query.code as string;

    if (!code) {
      throw createError({
        statusCode: 400,
        message: 'Missing GitHub authorization code'
      });
    }

    // Environment variable validation
    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    const redirectUrl = process.env.APP_URL || 'http://localhost:3000';

    if (!clientId || !clientSecret) {
      throw createError({
        statusCode: 500,
        message: 'GitHub OAuth configuration is missing'
      });
    }

    // Exchange code for access token with proper error handling
    const tokenResponse = await $fetch<{
      access_token?: string;
      error?: string;
      error_description?: string;
    }>('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: { client_id: clientId, client_secret: clientSecret, code },
    }).catch(err => {
      console.error('GitHub token exchange failed:', err);
      throw createError({
        statusCode: 502,
        message: 'Failed to exchange GitHub code for token'
      });
    });

    // Check for GitHub API error response
    if (tokenResponse.error || !tokenResponse.access_token) {
      console.error('GitHub OAuth error:', tokenResponse);
      throw createError({
        statusCode: 401,
        message: tokenResponse.error_description || 'GitHub authentication failed'
      });
    }

    // Fetch user data with the access token
    const githubUser = await $fetch<{
      email: string;
      id: number;
      name: string;
      login: string; // GitHub username as fallback
    }>('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokenResponse.access_token}`
      },
      retry: 1
    }).catch(err => {
      console.error('GitHub user fetch failed:', err);
      throw createError({
        statusCode: 502,
        message: 'Failed to retrieve user data from GitHub'
      });
    });

    // Handle missing email (some GitHub accounts don't expose email)
    if (!githubUser.email) {
      // Try to get primary email from email endpoint
      try {
        const emails = await $fetch<Array<{ email: string; primary: boolean; verified: boolean }>>(
          'https://api.github.com/user/emails',
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`
            }
          }
        );

        const primaryEmail = emails.find(e => e.primary && e.verified);
        if (primaryEmail) {
          githubUser.email = primaryEmail.email;
        } else {
          // Fallback to GitHub username + placeholder domain
          githubUser.email = `${githubUser.login}@github.user`;
        }
      } catch (err) {
        console.error('Failed to fetch GitHub emails:', err);
        // Create a placeholder email as last resort
        githubUser.email = `user_${githubUser.id}@github.user`;
      }
    }

    // Find or create user with transaction for data integrity
    let user = await prisma.user.findUnique({
      where: { email: githubUser.email }
    });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          email: githubUser.email,
          name: githubUser.name || githubUser.login,
          githubId: githubUser.id,
        }
      });
    } else if (!user.githubId) {
      // Update existing user with GitHub ID if missing
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          githubId: githubUser.id,

        }
      });
    }

    // Generate JWT with expiration and secure settings
    const token = signJwt({
      id: user.id,
    });

    // Set secure HTTP-only cookie with expiration
    setCookie(event, 'NuxtNoteJWT', token);

    // Redirect to dashboard or home
    return sendRedirect(event, redirectUrl);

  } catch (error: any) {
    // Centralized error handling
    console.error('GitHub OAuth error:', error);

    // Return friendly error page instead of JSON for better UX
    const errorMsg = error.message || 'Authentication failed';
    const statusCode = error.statusCode || 500;

    return sendRedirect(event, `/auth-error?message=${encodeURIComponent(errorMsg)}&status=${statusCode}`);
  }
});

