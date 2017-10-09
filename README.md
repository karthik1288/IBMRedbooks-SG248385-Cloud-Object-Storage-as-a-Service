# Tutorial: Image Gallery

This tutorial introduces how a simple web application can be built on the IBM Cloud.  This application uses Cloud Object Storage as the back-end storage for a Node.js application that allows a user to upload and view photos or other images.

## Getting started

Before getting started with writing any code, you must ensure that you
have the following items set up:

-   IBM Bluemix

-   Cloud Foundry

-   Node.js

-   Git

The steps show how to set up each of these items.

### IBM Bluemix account

If you are new to IBM Bluemix and have not yet signed in to your Bluemix
account, do that now. 

1.  Go to your Bluemix Dedicated website and sign in with
	your IBMid.

2.  Navigate to your My IBM page. Locate IBM Bluemix Dedicated under Products and
	services, and click **Launch**. You should already be assigned 
	an organization and space for your development. If not, contact
	your administrator to be assigned an organization and space.

Now, set up a few more things locally and you are ready to
create the app.

### Installing Node.js

The app uses Node.js as the server-side JavaScript engine to run the
JavaScript code. You must install node locally so that you can use the
node package manager (NPM). It is also helpful to have Node.js installed
so that you can test your code locally. Go to the
[Node.js](https://nodejs.org/en/download/releases/) releases web page
and download the Long Term Support (LTS) Version of Node.js, which
matches the latest version supported by the SDK for Node.js buildpack on
IBM Bluemix. At the time of this writing the latest buildpack is Version
3.10, and it supports Node.js Version 6.9.4. You can find information
about the latest Bluemix SDK for Node.js buildpack on the [SDK for
Nodejs latest
updates](https://console.ng.bluemix.net/docs/runtimes/nodejs/updates.html#latest_updates)
page. Run the Node.js installer to set up Node.js and NPM on your
system.

### Installing Git

Git is the most widely used source code versioning system in the
industry. If you do development regularly, you probably are
already familiar with Git. If you do not have a GitHub account, create a
free public personal account at the [Github](https://github.com/join)
website; otherwise, feel free to use any other account you might have.

Go to the [Github Desktop](https://desktop.github.com/) page to download
GitHub Desktop, and then run the installer. When the installer finishes,
you are prompted to log in to GitHub with your account.

In the Log in window (see figure below), enter the name and email you
want displayed publicly (assuming you have a public account) for any
commits to your repository.

![github_desktop_setup](https://cloud.githubusercontent.com/assets/19173079/24821330/a1c718e4-1bb3-11e7-8362-e3c6aa37bc7d.png)


You do not have to create any repositories yet. You might notice a
repository named Tutorial that is included with GitHub Desktop to help
familiarize you with the flow. Feel free to experiment with it.

## Creating the Web Gallery app on IBM Bluemix

To create a Cloud Foundry app, log in to Bluemix Dedicated
and click **Create App** (see figure below).

![bluemix_create_app](https://cloud.githubusercontent.com/assets/19173079/24821420/0d9b0af8-1bb4-11e7-80e3-cd1d91d19460.jpg)

Then, under Cloud Foundry Apps, select **SDK for Node.js** (see figure
below).

![cf_app_nodejs](https://cloud.githubusercontent.com/assets/19173079/24821453/52a651ac-1bb4-11e7-923e-e59f0b89dfec.jpg)


The following figure shows the app creation page where you give a name
to the app. Call it something descriptive, such as COS-WebGallery. The
Host name is populated automatically to reflect the App name field. The
Host name with the Domain name becomes the address that you use to view
the app on Bluemix. The Host name can be updated later if necessary, so
accept the default and click **Create**. Bluemix creates a starter app,
deploys and starts it for us.

![clickcreatenodeapp](images/create-node-app-dedicated.png)

Now that the app is created and running, click **View App** from the app’s
Getting Started page to see it in a new browser window. It was created
with a basic Hello World starter app as a placeholder (see figure
below).

![initiahhelloworldapp](https://cloud.githubusercontent.com/assets/19173079/24821547/da5bc302-1bb4-11e7-84c7-d0143c40d5c3.jpg)

Notice back on the Getting Started page the prerequisites that you need
 for developing a Node.js app on Bluemix are listed. You already
created your Bluemix account, and installed Node.js. Download the [Cloud
Foundry (CF) command-line interface (CLI)
tool](https://github.com/cloudfoundry/cli). Then run the installer. You
can use the tool to log in to Bluemix and interact directly with your
account from your local environment. This tool puts many powerful
commands at your disposal that you do not use in this scenario. More
information is at the [Cloud Foundry CLI commands index
page](https://github.com/cloudfoundry/cli).

The next item listed as a prerequisite is the Git command line client.
We will use Github Desktop for most of this scenario, but you could also use the
Git command line client to complete the same tasks. We will only use it
to clone a starter template for the app. If you do not have Git
installed, download it from [Git](https://git-scm.com/downloads) and run
the installer, accepting the default options.

Follow these steps:

1.  Clone the repo. Download the template for your app on your local
    development environment using Git. Rather than cloning the sample
    app from Bluemix, clone the
    starter template for the IBM COS Web Gallery app. After cloning the
    repo you will find the starter app in the
    COS-WebGallery directory. Open a Git CMD window and change to a
    directory where you want to clone Github repo. Use the command shown
    in the following example.
    
    ```
    git clone https://github.com/karthik1288/ICOS-Dedicated-Demo-NodeJS
    ```

2.  Prepare the app for deployment. Update the application name property
    value in the manifest.yml file from COS-WebGallery, to the name you
    entered for your app on Bluemix. The COS-WebGallery manifest.yml
    looks like the following example. Also update the package.json file
    located in the app root directory for your app to reflect the name
    of your app, and your name as the author.

    ```
    applications:

    - name: COS-WebGallery

    random-route: true

    memory: 256M
    ```


3.  Deploy the app to Bluemix. To get the starter app with your changes
    to Bluemix, deploy it using the Cloud Foundry CLI:
 
	a.  Set the API Endpoint for your region by using the api command (as
    shown in the following example). if you do not know your regional
    API endpoint URL see the Getting Started page.

    ```
    cf api <API-endpoint>
    ```
   
    b.  Log in to Bluemix by using the login command. You can specify
    optional parameters if you want: your organization with option -o,
    and the space with option -s (as shown in the following example).

    ```
    cf login -u <my@account.com> -o <organization-name> -s <space-name>
    ```
    
    c.  Deploy the app to Bluemix with the push command, but don't start the app yet. We'll start it after we bind a Cloud Object Storage Dedicated service instance to the app.

    ```
    cf push --no-start
    ```
   	
Next, create an instance of the Cloud Object Storage Dedicated service and connect it to your app.

### Creating and connecting the service instance

Navigate to the **Catalog** to provision an instance of the service.

1.  Search for **Cloud Object Storage**.

2.  Under Application Services, click **Cloud Object Storage Dedicated**.

    ![searchCOS](images/searchcos.png)

3.  On the service creation page, select your app from the **Connect to** menu. 
    Update the **Service name** and **Credential name** or leave the generated names, 
    and then click **Create**.
    
    ![createserviceinstance](images/createserviceinstance.png)

    The service is created and bound to your app. The `VCAP_SERVICES` variable coded
    in the app pulls in the credentials from your instance and authenticates the service.

4.  Start the app with the service instance bound to it. Click the 
    **Start** button on the App overview page.

    ![createserviceinstance](images/startAppAfterBind.png)

    Cloud Foundry reports that the app was successfully 
    deployed and started. If you are logged in to the Bluemix web console, 
    you are notified there also of the status of your app. 
    
    You can verify that the app was deployed by visiting the app URL
reported by Cloud Foundry with a browser, or from the Bluemix web
console by clicking **View App** button.

## Developing a simple IBM Cloud Object Storage Web Gallery


Because this example uses an MVC architecture, adjusting the directory
structure to reflect architecture is necessary. The directory structure
has a `views` directory to contain the EJS view templates, a `routes`
directory to contain the express routes, and a `controllers` directory as
the place to put the controller logic. Place these items under a source
directory that is named `src` (see figure below).

![directorystructure](images/dir_structure.png)


**Tip**: The repo you cloned earlier contains a directory named
`COS-WebGallery`. Viewing the source code in your preferred editor
might be helpful as you follow the next steps. This will be the version
of the COS-WebGallery app that is committed and deployed to Bluemix
later.

### Designing a simple IBM Cloud Object Storage Web Gallery

These are the two main tasks that a user should be able to do with this
simple web app:

-   Upload images from a web browser to the IBM COS bucket.

-   View the images in the IBM COS bucket in a web browser.

The next steps focus on how to accomplish these two basic functions in a
simple fashion rather than building a fully developed production grade
app.

### Developing the app

Look at the main application file, which is `app.js`. This is the code
that we have told Node.js to process first when you start your app with
the `npm start` command (or `nodemon`). In the `package.json` file, inside the
scripts object, you see how "start" is defined (Example 5-10). This file
is what Bluemix uses to tell node to run `app.js` each time the app
starts. Also use it when testing the app locally.


```
...
"scripts": {
"start": "node app.js"
},
...
```

The following figure shows the beginnings for the application in `app.js`.
Lines 1 - 3 tell the node to load modules that are needed to get started.
Line 4 creates the express app by using the express module. 

![app_1](images/express_creation.png)

Line 55 gets the Cloud Foundry environment object. Lines 58 - 60 tell the express app
to listen on the port that is assigned to the port property. We print a
message with the server URL to the console.

![app_1](images/server_creation.png)

The next figure shows how to define a path and views. Line 7 tells the
express app to use the public directory to serve our static files, which
include any static images and style sheets we use. Lines 8 - 9 tells the
express app where to find the view templates for our views in the
`src/views` directory, and set our view engine to be EJS. Line 10 tells
express to use the `body-parser` middleware to expose incoming request
data to the app as JSON. In lines 12 - 16, the express app responds to
all incoming GET requests to our app URL by rendering the `index.ejs` view
template.

![app_2](images/app_set.png)

The following figure shows how to create an S3 client. We require modules `aws-sdk` and `aws-config` to create the S3 client. Lines 18-29 show how to read the required variables to create the S3 client from the `VCAP_SERVICES` JSON configuration file. We read the endpoint address, region, and AWS credentials from `VCAP_SERVICES` and set the bucket name statically later. You can change the bucket name from `web-images` in line 31. S3 parameters can statically set up once the service instance is created, as shown in the comments for lines 27-29.

![app_2](images/s3_client_creation.png)

The following figure shows the index view template when rendered
and sent to the browser.

![uploadimageview](https://cloud.githubusercontent.com/assets/19173079/24822932/f087e44e-1bbe-11e7-9349-93ff489eeb36.jpg)


In this example, our view templates share HTML code between the
`<head>...<head>` tags, so we placed it into a separate
include template (see figure below). This template (`head-inc.ejs`)
contains a scriptlet for the page title on line 1. The title variable is
being set in `app.js` on line 12, and passed in as data for our view
template on line 15. Otherwise, we are simply using some CDN addresses
to pull in Bootstrap CSS, Bootstrap JavaScript, and JQuery. We use a
static `styles.css` file from our `public/style` sheets directory.

![view_head-inc](images/headejs.png)


The body of the index view (see figure below), contains our bootstrap-styled 
navigation tabs, and our upload form in a basic bootstrap.
Consider these two notes:

-   We set our form method to POST and the form-data encoding type as
    multipart/form-data on line 24. For the form action, we send the
    data from our form to the app to the app route "/". Later we do
    additional work in our router logic to handle POST requests to
    that route.

-   We want to display feedback about the status of the attempted file
    upload to the user. This feedback is passed to our view in a
    variable named "status", and is displayed below the upload form on
    line 31.

![view_index-body](images/indexejs.png)

The following figure returns to `app.js`. Lines 47 - 48 set up express
routes to handle additional requests that will be made to our app. The
code for these routers will be in two files under the `./src/routes`
directory:

-   `imageUploadRoutes.js`: This file handles what happens when the user
    selects an image and clicks Upload.

-   `galleryRoutes.js`: This file handles requests when the user clicks
    the Gallery tab to request the `imageGallery` view.

![app_3](images/routes_app.png)


#### Image upload

See `imageUploadRoutes.js` in the figure below. We must create an instance
of a new express router and name it `imageUploadRouter` in lines 1 - 2.
Then, on line 5, we create a function that returns `imageUploadRouter`,
and assign it to a variable called "router". We export the function in
"router" on line 26 to make it accessible to `app.js`. On line 7, we
require a file named `galleryController.js`. Because some logic is
dedicated to controlling how we upload our images, we put that logic in
this function and save it in our `./src/controllers` directory.

Line 10 is where our `imageUploadRouter` is told to route requests for the
root app route ("/") when the HTTP POST method is used. Inside the post
function of our `imageUploadRouter`, we use middleware from the `multer` and
`multer-s3` modules which is exposed by the `galleryController` as upload.
The middleware takes the data and file from our Upload form POST,
processes it, and runs a callback function. In the callback function on
line 13 - 22, we check that we get an HTTP status code of 200, and that
we had at least one file in our request object to upload. Based on those
conditions, we set the feedback in our status variable and render the
`index` view template with the new status.

![imguploadrouter](images/img_upload_route.png)

Look at how we set up the `multer` upload in the following figure. We require modules `multer` and `multer-s3`.

![gallerycontroller](images/imageuploadController.png)


We define upload used by `imageUploadRouter` on line 11 by creating a new
`multer` instance with a storage property on line 12. This property tells
`multer` where to send the file from our multipart/form-data. Since IBM
COS uses an implementation of the S3 API, we set storage to be an
`multer-s3` object. This `multer-s3` object contains an s3 property that we
have assigned to our s3 object from line 13, and a bucket property that
we have assigned the `myBucket` variable from line 14, which is assigned a
value of `web-images`. The `multer-s3` object now has all the data
necessary to connect and upload files to our IBM COS bucket when it
receives data from the upload form. The name or key of the uploaded
object will be the original file name taken from the file object when it
is stored in our IBM COS `web-images` bucket. For local testing, a
helpful task is to print the file object to the console, on line 17.

We perform a test of the Upload form and the output from the
console log of the file in the following example.

```
{ fieldname: 'img-file',
originalname: 'Chrysanthemum.jpg',
encoding: '7bit',
mimetype: 'image/jpeg' }
```

The following figure shows that feedback from our callback saying it was
a successful upload.

![localtest1](https://cloud.githubusercontent.com/assets/19173079/24823021/cf3704cc-1bbf-11e7-8190-932e99cded91.jpg)

#### Image retrieval and display

The following figure refers to `app.js`. Line 48 creates `galleryRouter`,
and tells express to use it when the `/gallery` route is requested. Look
at the `galleryRoutes.js` file that is used to define `galleryRouter`.

![app_3](images/routes_app.png)

1.  Define which router to use for each path

    The next figure shows `galleryRoutes.js` where we define the express
    router assigned to `galleryRouter` on line 2. We follow the same pattern
    that we did with `imageUploadRouter` and require `galleryController` on
    lines 6 - 7, then set up our route on line 9. The main difference is we
    are routing HTTP GET requests rather than POST, and sending all the
    output in the response from `getGalleryImages`, which is exposed by the
    `galleryController` on line 10.
    
    ![galleryroutes](images/galleryRoutes.png)

    Referring to `galleryController.js` (see figure below), we define the
    `getGalleryImages` function we just saw on line 22. Using the same S3
    object that we set up for our image upload function, we call a function
    that named `listObjects` on line 25. This function returns data of the
    objects in our bucket. To display images, we need an image key for each
    JPEG image in our `web-images` bucket to display in our view template. The
    content on line 27 is an array map from the data object returned by
    `listObjects` containing metadata about each object in our bucket. We
    loop the content and search for any object key ending in `.jpg`, and
    create a parameter to pass assinged App route to the view `galleryView.ejs`.
    In the callback function we save each URL in an array, and pass it `res.render` as `imgList`.
    
    ![gallerycontroller_getimages](images/gallery_controller_retreive.png)

2.  Retrieve the .jpg image URLs from IBM Cloud Object Storage

    The following figure shows the `galleryView` EJS template body. We get the
    `imageUrls` array from the `res.render()` method and iterate over a pair of
    nested `&lt;div&gt;&lt;/div&gt;` tags where the image URL will make a GET
    request for the image when the `/gallery` route is requested. 
    
    ![galleryview](images/gallery_view_retreive.png)

    The following figure shows how the images are streamed to browser. The gallery route `/gallery` 
    will access `/imgs/:myimage` route in `app.js` shown in Line 36, to get the S3 objects 
    using function `getObject` with requested bucket name and keys as saw on Lines 38-40, and the output
     will be streamed to browser by creating a readStream shown in Line 43.

    ![galleryviewAppJs](images/gallery_view_appjs.png)

    Visit <app-url>/gallery and see the images streamed and as displayed, in the following figure.
    
    ![localtest2](https://cloud.githubusercontent.com/assets/19173079/24822869/5310d658-1bbe-11e7-80fc-7a725314f7f5.jpg)

You successfully created an image gallery app using IBM Cloud Object Storage on Bluemix Dedicated!
