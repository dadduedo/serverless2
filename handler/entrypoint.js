const s3Upload  = require('../services/helper/s3Upload');
const cloudFrontInvalidation = require('../services/helper/cloudFrontInvalidation');
const mysql = require('serverless-mysql')(process.env.MYSQL_DSN);
const fs = require('fs');
const path = require('path');

module.exports = async (event) => {
    const results = await mysql.query('SELECT zip_code, town, province, region, city FROM area ORDER BY province');
    await mysql.end();
    mysql.quit();

    const provincesByRegion = {};
    let jsontosend = {};
    const arrayRegions = [];
    const jsonProvinces = {}
    let currentProvince = "";

    for (const result of results) {        
        // Verifica cambiamento di provincia
        if (currentProvince !== result.province) {
            await s3Upload(JSON.stringify(jsontosend), currentProvince);
            currentProvince = result.province;
            jsontosend = {};
        }
        // creazione del json per ogni provincia
        jsontosend[result.zip_code] = `${result.zip_code} - ${result.town}`;

        // Creazione regioni 
        if (!provincesByRegion[result.region]) {
            provincesByRegion[result.region] = {};
        }
        //preparazione json da ciclare sul socondo for 
        provincesByRegion[result.region][result.province] = result.city;

        // Creazioni province
        jsonProvinces[result.province] = result.city;
        
    }
    //if che serve per creare l'ultima provincia perchè il primo ciclo non può coprirla
    if (Object.keys(jsontosend).length > 0) {
        await s3Upload(JSON.stringify(jsontosend), currentProvince);
    }

    for (const regionName in provincesByRegion) {
        const region = {
            name: regionName,
            provinces: provincesByRegion[regionName]
        };
        arrayRegions.push(region);
    }
    await s3Upload(JSON.stringify(arrayRegions), "regions");
    await s3Upload(JSON.stringify(jsonProvinces), "provinces")
    ;
    
    if (process.env.STAGE !== 'dev') {
        const folderPath = 'data/buckets/zipcode-enabled';
        fs.readdir(folderPath, async (err, files) => {
            if (err) {
                console.error('Errore durante la lettura della cartella:', err);
                return;
            }
            // Filtra i file (ignorando le sottocartelle)
            var fileList = files.filter(file => fs.statSync(path.join(folderPath, file)).isFile());
            
            await cloudFrontInvalidation(fileList);
        });
       
    }
    
    

    return "Created files for provinces and regions";
};