const s3Upload  = require('../services/helper/s3Upload');
const cloudFrontInvalidation = require('../services/helper/cloudFrontInvalidation');
const mysql = require('serverless-mysql')(process.env.MYSQL_DSN);

module.exports = async (event) => {
    let results = await mysql.query('SELECT zip_code,town,province,region,city FROM area order by province');
    await mysql.end();
    mysql.quit();
    var jsontosend = {}
    var jsonRegion = {}
    var jsonProvinceReg = {}
    var jsonProvince = {}
    var lastProv = ""
    var arrayRegions = []
    if (!results.length) {
        return 'No results were found in table';
    }
    for (var i=0;i<results.length;i++){
        //creazione province
        jsonProvince[results[i].province] = results[i].city
        //creazione regioni
        jsonRegion["name"] = results[i].region
        //ciclo di nuovo sui risultati della query perchè non sono in ordine di regione
        for (var j=0;j<results.length;j++){
            if(results[i].region == results[j].region){
                jsonProvinceReg[results[j].province] = results[j].city
            }

        }
        jsonRegion["provinces"] = jsonProvinceReg
        jsonProvinceReg = {}
        arrayRegions.push(jsonRegion)
        jsonRegion = {}
        //creazione tutti i file di tutte le province
        if (results[i+1] == undefined) {
           jsontosend[results[i].zip_code] = "" + results[i].zip_code + " - " + results[i].town + ""
           lastProv = results[i].province
       }
       else{
           if (results[i].province == results[i+1].province) {
               jsontosend[results[i].zip_code] = "" + results[i].zip_code + " - " + results[i].town + ""
           } else {
               await s3Upload(JSON.stringify(jsontosend), results[i].province);
               jsontosend = {}
           }
       }
    }

    if (process.env.STAGE !== 'dev') {
        await cloudFrontInvalidation();
    }
    //rende unico il file delle regioni
    const uniqueArrRegions = arrayRegions.filter((thing, index, self) =>
            index === self.findIndex((t) => t.name === thing.name)
    );
    // scrive i file nella cartella buckets
    await s3Upload(JSON.stringify(jsonProvince), "provinces")
    await s3Upload(JSON.stringify(uniqueArrRegions), "regions")
    await s3Upload(JSON.stringify(jsontosend), lastProv)

    return "Create a file of provinces, Create a file of regions, Create a file for each province"
};