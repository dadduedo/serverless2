const s3Upload  = require('../services/helper/s3Upload');
const cloudFrontInvalidation = require('../services/helper/cloudFrontInvalidation');
const mysql = require('serverless-mysql')(process.env.MYSQL_DSN);

module.exports = async (event) => {
    const results = await mysql.query('SELECT zip_code, town, province, region, city FROM area ORDER BY province');
    await mysql.end();
    mysql.quit();
    const provincesByRegion = {};
    let jsontosend = {};
    const arrayRegions = [];
    const jsonProvinces = {};
    let currentProvince = "";
    var invalidationArray = [];
    for (const result of results) {   
            
        // Verify change of province
        if (currentProvince !== result.province) {
            if (currentProvince == ""){
                currentProvince = result.province;
                jsontosend = {};
            }
            else{
                await s3Upload(JSON.stringify(jsontosend), currentProvince + ".json");
                invalidationArray.push(currentProvince + ".json")
                currentProvince = result.province;
                jsontosend = {};
            }
            
        }
        // Creating the json for each province
        jsontosend[result.zip_code] = `${result.zip_code} - ${result.town}`;

        // Creating regions
        if (!provincesByRegion[result.region]) {
            provincesByRegion[result.region] = {};
        }
        // Preparing json to loop on the second for
        provincesByRegion[result.region][result.province] = result.city;

        // Province creations
        jsonProvinces[result.province] = result.city;
       
    }
    // If which is used to create the last province because the first loop cannot cover it
    if (Object.keys(jsontosend).length > 0) {
        await s3Upload(JSON.stringify(jsontosend), currentProvince + ".json");
    }
    // Loop that fills the two regions json, loop only on the regions to laugh the loops
    for (const regionName in provincesByRegion) {
        const region = {
            name: regionName,
            provinces: provincesByRegion[regionName]
        };
        arrayRegions.push(region);
    }
    invalidationArray.push('regions.json')
    invalidationArray.push('provinces.json')
    await s3Upload(JSON.stringify(arrayRegions), 'regions.json');
    await s3Upload(JSON.stringify(jsonProvinces), 'provinces.json');
    if (process.env.STAGE !== 'dev') {
            await cloudFrontInvalidation(invalidationArray);  
    }
    return "Created files for provinces and regions";
};