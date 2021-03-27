import axios from "axios";

const {exec} = require('child_process');

export const downloadMacBinaries = async () => {
    const mac_versions_response = await axios.get("https://formulae.brew.sh/api/formula/git.json")
    const mac_versions_list = mac_versions_response.data['bottle']['stable']['files']
    for (const [mac_version, version_data] of Object.entries(mac_versions_list)) {
        const wget = exec(`wget -O ext/${mac_version} ${version_data}`)
        wget.on('exit', function() {
            process.exit()
        })
    }

}

