
## Introduction

#### My first MEAN Stack project

I start this project on 2014.8

- Refactor project start on 2014.11.27 and put it on GitHub

Single Page Application(SPA) for my team projects management sites.

- Use Grunt to manage my file structure.

- Use Karma for unit test

- Use AngularJs with Bootstrap, UI-routes and UIBootstrap in AngularUI to create my application.

- Use Connect to build my project and proxy the request. Here is [my restful server project](https://github.com/leozdgao/PSPMS_Service)


#### Grunt

To test source of app, you can use this commond:

    $grunt test

To start server, you can just use this commond:

    $grunt server

I put my app source code in the folder named 'app', but the reference path of my files
is in the folder named 'public'. Use this command to build file structure, including
copy templates and public files and concat js or css file.

    $grunt build
    

## License

MIT