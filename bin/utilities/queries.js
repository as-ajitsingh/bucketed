const { prompt, Select } = require('enquirer');


let init = async function () {
    const projectDetails = await prompt([
        {
            type: 'input',
            name: 'projectName',
            message: 'What is your website project name?'
        },
        {
            type: 'input',
            name: 'distDir',
            message: 'your dist directory location'
        }
    ]);

    const vendorType = await new Select({
        name: 'vendorType',
        message: 'Pick your storage provider',
        choices: ['gcloud']
    }).run();

    const vendorOtherDetails= await prompt([
        {
            type: 'input',
            name: 'projectID',
            message: 'Your cloud provider project ID'
        },
        {
            type: 'input',
            name: 'keyLocation',
            message: 'Location of your cloud provider project key'
        },
        {
            type: 'input',
            name: 'bucketName',
            message: 'Name of your bucket'
        }
    ]);

    // const vendorTypeResponse = await vendorTypeSelect.run();

    return { ...projectDetails, vendorType, ...vendorOtherDetails };
}

module.exports = { init };