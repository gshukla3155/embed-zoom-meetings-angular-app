# Embed Zoom Meetings in Angular application

# Introduction

The  **Zoom App Marketplace**  is an open platform that allows third-party developers to build applications and integrations upon Zoom&#39;s video-first unified communications platform. Leverage APIs, Webhooks and SDKs to build custom applications and super-power your business with a powerful collaboration suite.

# Zoom Client SDKs

Zoom Client SDKs allow new and existing applications to integrate Zoom&#39;s full-featured unified communications platform.

[https://marketplace.zoom.us/docs/sdk/native-sdks/web/reference](https://marketplace.zoom.us/docs/sdk/native-sdks/web/reference)

# Perquisites

## Developer Account

To begin development with Zoom SDKs, each developer requires a Zoom Account along with a Zoom Token and Zoom Access Token (ZAK).

### Zoom Token

A Zoom Token is the authenticated token derived from the Zoom API.

### Zoom Access Token

A Zoom Access Token is a unique identification and authentication token required for your app to host a meeting on behalf of another user.

## Zoom JWT App

This app is used to get API keys &amp; API Secrets that can used to create signature, initiate meetings, join meetings etc.

## Angular app

You must require angular application where you want to integrate or embed zoom meetings.

## Web API

You must also require Web API where you can call Zoom Apis (mentioned below) and send the result back to client.

# Create Zoom JWT App

Open Zoom developer account [https://zoom.us/signin](https://zoom.us/signin). After successful sign in, go to **Develop** dropdown (third option from top right) and **select Build App option** and then Create **JWT** app as below:

![](https://user-images.githubusercontent.com/70849493/92331816-eff82880-f096-11ea-9403-533046059201.PNG)

![](https://user-images.githubusercontent.com/70849493/92331833-0900d980-f097-11ea-8d34-69dec193f5f9.PNG)

[https://marketplace.zoom.us/develop/create](https://marketplace.zoom.us/develop/create)

![](https://user-images.githubusercontent.com/70849493/92331855-203fc700-f097-11ea-9e8d-702a9b8b39e1.PNG)

![](https://user-images.githubusercontent.com/70849493/92331859-2b92f280-f097-11ea-822d-4a17b04c27ea.PNG)

# Integrate Zoom Web SDK

The Web SDK enables the development of video applications powered by Zoom&#39;s core framework inside an HTML5 web client through a highly optimized Web Assembly module.

As an extension of the Zoom browser client, this SDK is intended for implementations where the end user has a low-bandwidth environment, is behind a network firewall, or has restrictions on their machine which would prevent them from installing the Zoom Desktop or Mobile Clients.

[https://marketplace.zoom.us/docs/sdk/native-sdks/web](https://marketplace.zoom.us/docs/sdk/native-sdks/web)

## Install NPM package

Install zoom web sdk package as below

```
npm install @zoomus/websdk
```

[https://www.npmjs.com/package/@zoomus/websdk](https://www.npmjs.com/package/@zoomus/websdk)

## Import Assets

Import the assets for zoom web sdk in the angular.json file as:

![](https://user-images.githubusercontent.com/70849493/92331868-39e10e80-f097-11ea-98ab-7863ee88ad13.PNG)

## Import Styles

Import the styles for zoom web sdk in the angular.json file as:

![](https://user-images.githubusercontent.com/70849493/92331878-4c5b4800-f097-11ea-8689-fe880c9d15eb.PNG)

## Import Module

Import the zoom web sdk module at the root level component (app.component.ts) as:

![](https://user-images.githubusercontent.com/70849493/92331884-5a10cd80-f097-11ea-9a39-262451168ed5.PNG)

## Generate Signature

Each request to Start or Join a Meeting / Webinar must be verified by an encrypted signature authorizing the user to enter.

The signature is used in the _**ZoomMtg.join()**_ method.

### Signature Parameters

- **apiKey** : API key of your acount
- **apiSecret** : API secret of your account
- **meetingNumber** : Meeting Number being joined
- **role** : 1 for meeting host, 0 for participants &amp; joining webinars

Signature generation process is already given (with sample code) in zoom documentation refer below:

[https://marketplace.zoom.us/docs/sdk/native-sdks/web/essential/signature](https://marketplace.zoom.us/docs/sdk/native-sdks/web/essential/signature)

**C# Signature code**

![](https://user-images.githubusercontent.com/70849493/92331889-639a3580-f097-11ea-98e8-bc148a264a3c.PNG)

## Start &amp; Join Meeting

Before launching and joining a meeting, use **ZoomMtg.preLoadWasm()** to [load Web Assembly files](https://zoom.github.io/sample-app-web/ZoomMtg.html#preLoadWasm) and **ZoomMtg.prepareJssdk()** to load [JavaScript requirements](https://zoom.github.io/sample-app-web/ZoomMtg.html#prepareJssdk) onto the page.

[https://marketplace.zoom.us/docs/sdk/native-sdks/web/essential/start-join-meeting](https://marketplace.zoom.us/docs/sdk/native-sdks/web/essential/start-join-meeting)

### ZoomMtg.init()

Meetings and Webinars are created in the Web SDK using the ZoomMtg.init() method.

### ZoomMtg.join()

Once created, use the ZoomMtg.join() method to join the Meeting or Webinar. The join method receives an encrypted  **signature** , your  **API Key** , a  **Meeting number** , and any  **user settings**.

![](https://user-images.githubusercontent.com/70849493/92331903-77de3280-f097-11ea-8848-6a4df24f6b80.PNG)

### IE Support

Two-way audio &amp; video is currently not supported on Internet Explorer. Loading  **js\_media.js**  directly on IE will throw an error.

To avoid this, detect an IE browser and load  **js\_media.js**  so that isSupportAV requires both the config and a Non-IE environment.

Code is given here:

[https://marketplace.zoom.us/docs/sdk/native-sdks/web/advanced/join-meeting-ie](https://marketplace.zoom.us/docs/sdk/native-sdks/web/advanced/join-meeting-ie)

## Zoom APIs

Zoom APIs allow developers to request information from the Zoom including but not limited to User details, Meeting reports, Dashboard data, etc. as well as perform actions on the Zoom platform on a user&#39;s behalf, such as, creating a new user or deleting meeting recordings.

[https://marketplace.zoom.us/docs/api-reference/zoom-api](https://marketplace.zoom.us/docs/api-reference/zoom-api)

[https://marketplace.zoom.us/docs/api-reference/using-zoom-apis](https://marketplace.zoom.us/docs/api-reference/using-zoom-apis)

### Authentication

Every HTTP request made to Zoom API must be authenticated by Zoom. In order to hit any Zoom API, it is required to pass Bearer Access Token (JWT). To generate JWT token follow below steps:

**JSON Web Token (JWT)** offer a method to generate tokens that provide secure data transmission using a neat and compact JSON object. JWTs contain signed payload that helps establish server to server authentication.

**A single JWT consists of three components: Header, Payload & Signature**

```
npm install jsonwebtoken

const jwt = require(&#39;jsonwebtoken&#39;);

const payload = {
    iss: this.apiKey,
    exp: ((new Date()).getTime() + 500)
};

const zoomAccessToken = jwt.sign(payload, this.apiSecret);
```

You can also create JWT token from server side application C#.

[https://marketplace.zoom.us/docs/guides/auth/jwt](https://marketplace.zoom.us/docs/guides/auth/jwt)

### Base Address

The base address of Zoom API is: [https://api.zoom.us/v2/](https://api.zoom.us/v2/)

### Create Meeting

In order to create a new meeting, first you should know the User Id of the Zoom user account

To fetch the Zoom User Id using below API as:

**Zoom GetUsers API**

[https://api.zoom.us/v2/users/](https://api.zoom.us/v2/users/)

**Headers:**

- Authorization : Bearer {[zoomAccessToken](#_Authentication)}
- Content-Type: application/json

**Method** : GET

**Response** :

![](https://user-images.githubusercontent.com/70849493/92331924-9b08e200-f097-11ea-8c67-a87b856d7156.PNG)

**Zoom CreateMeeting API**

To create new meeting use below API as:

[https://api.zoom.us/v2/users/{userId}/meetings](https://api.zoom.us/v2/users/%7BuserId%7D/meetings)

**Headers:**

- Authorization : Bearer {[zoomAccessToken](#_Authentication)}
- Content-Type: application/json

**Method** : POST

**Request:**

![](https://user-images.githubusercontent.com/70849493/92331936-aa882b00-f097-11ea-88dc-d6ad6f7b76c1.PNG)

**Response**

![](https://user-images.githubusercontent.com/70849493/92331947-bb38a100-f097-11ea-8ce6-ffd3b35d521e.PNG)

# Sample Project

Created sample angular application to integrate the Zoom Web SDK and also one WEB API application to interact with Zoom APIs.

# Screen Shots

![](https://user-images.githubusercontent.com/70849493/92331953-c7246300-f097-11ea-84be-b421c4f99464.PNG)

![](https://user-images.githubusercontent.com/70849493/92331959-d2778e80-f097-11ea-871a-b1f726b565d6.PNG)

# References
[https://marketplace.zoom.us/docs/sdk/native-sdks/web](https://marketplace.zoom.us/docs/sdk/native-sdks/web)

[https://marketplace.zoom.us/docs/api-reference/introduction](https://marketplace.zoom.us/docs/api-reference/introduction)
