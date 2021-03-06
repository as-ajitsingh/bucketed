# Bucketed
![node](https://img.shields.io/node/v/bucketed.svg) ![npm](https://img.shields.io/npm/dt/bucketed.svg) ![GitHub issues](https://img.shields.io/github/issues/as-ajitsingh/bucketed.svg)

    This tool helps in deploying static website to cloud storage/bucket.
Bucketed allows a simple and elegant way of deploying your static websites to cloud storage/bucket providers. As many of the cloud providers give the facility of hosting a static website through cloud storages such as Google Cloud Storage, AWS S3 etc. You can also integrate Bucketed with your CD tool for autonomous deployment of your site generated through Angular, React etc.

## Table of Contents: 
* [Prerequisite](#prerequisite)
* [Installation](#installation)
* [Usage](#usage)
* [Maintainer](#maintainer)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)

### Prerequisite
Bucketed is an npm tool written in nodejs, so it is mandatory to have npm and nodejs in the system, where Bucketed will run. Please install following versions - 
 * Nodejs >= 8.6.0
 * NPM >= 5.0.0

### Installation
Bucketed will be installed as a global dependency to support cli interface. Install it using the following command - 
```
npm install -g bucketed
```

### Usage
To use bucketed, it important to create a config file in the root of the project with name .bucketed. This can be done via two ways - 

1. Creating config file interactively using bucketed init command. To do that follow these steps - 
```
bucketed init
```
After executing above command, answer the questions asked from console and it will create a config file with the name .bucketed at the location from where command has run. You can also specify the location of config file by passing __--config__ or __-c__ option. see below - 
```
bucketed init -c ./sample-project/my-bucketed-configuration
```

2. Manually creating config file. This config file is written in YAML and contains following information -  
```
version: 0.1.0

project:
  name: sample-website-project
  distDir: ./dist

vendor:
  type: gcloud
  projectID: sample-bucket-project
  keyLocation: \keys\xxxx-xxxx-12345.json
  bucketName: sample-bucket
  
```
* `Version` _(Optional)_ It is the version of Bucketed.
* `project`->`name` _(Optional)_ Name of your static website project
* `project`->`distDir` _(Required)_ Path to the directory where static web files are present. It is the path where your index.html is present.
* `vendor`->`type` _(Required)_ Your cloud bucket provider. As of now only Google Cloud Storage (gcloud) and Amazon Web Services (aws) are supported.
* `vendor`-> `projectID` _(Required if vendor is gcloud)_ Your google cloud project id. 
* `vendor`-> `keyLocation` _(Required)_ Your cloud service account key file (in json). Storage API should be enabled for this service account.
* `vendor`-> `bucketName` _(Required)_ Your cloud bucket name. Files in your _distDir_ will be uploaded to this bucket.

After setting up above file, run following command to initiate upload process- 
```
bucketed deploy
```
Note: If you running this command somewhere other than the directory where your .bucketed file is present, then use __--config__ or __-c__ option to specify the location of config file. See below - 
```
bucketed deploy -c ./sample-project/my-bucketed-configuration
```


### Maintainer
[Ajit Singh](https://github.com/as-ajitsingh) 

### Roadmap
This will include list of planned features for the tool. see [ROADMAP.md](/ROADMAP.md)

### Contributing
Please contribute by exploring the tool and reporting the bugs or providing suggestions for new features on [Github Issues](https://github.com/as-ajitsingh/bucketed/issues).

### License 
[MIT License](/LICENSE)