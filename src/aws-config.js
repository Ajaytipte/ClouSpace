import { Amplify } from 'aws-amplify';

const awsConfig = {
    Auth: {
        Cognito: {
            region: 'ap-south-1',
            userPoolId: 'ap-south-1_8vQ8smdoZ',
            userPoolClientId: '7vbnfgktemk29lf55up1lo3a4c',
            loginWith: {
                oauth: {
                    domain: 'cloudspace.auth.ap-south-1.amazoncognito.com',
                    scopes: ['openid', 'email', 'profile'],
                    redirectSignIn: ['http://localhost:5173/'],
                    redirectSignOut: ['http://localhost:5173/login'],
                    responseType: 'code', // Authorization Code + PKCE flow
                },
                email: true,
            },
        }
    }
};

// Configure Amplify
Amplify.configure(awsConfig);

export default awsConfig;
