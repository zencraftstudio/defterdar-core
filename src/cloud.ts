const B2 = require('backblaze-b2');


const getPrefixFromUsername = () => {

}

const b2 = new B2({
    applicationKeyId: 'applicationKeyId', // or accountId: 'accountId'
    applicationKey: 'applicationKey', // or masterApplicationKey
    // optional:
    axios: {
        // overrides the axios instance default config, see https://github.com/axios/axios
    },
    retry: {
        retries: 3 // this is the default
        // for additional options, see https://github.com/softonic/axios-retry
    }
});
