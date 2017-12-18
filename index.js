var express = require('express');
var app = express();
var fs = require ('fs');
var base64 = require('base-64');
var utf8 = require('utf8');
var _ = require('lodash');
var mappings = require('./mappings');
var json2xls = require('json2xls');

function uniqConditions (conditionData) {
    var conditionList =[];
    _.map(conditionData, (conditionItem)=>{
         let conditionIndex = _.findIndex(conditionList, { 'MRCCC Condition #': conditionItem['MRCCC Condition #']});
       if(conditionIndex==-1){
          output = mappings(conditionItem, conditionItem['PGM_NM'], conditionItem['ALWS_APPL_IND']);
          output = _.omit(output, ['PGM_NM', 'ALWS_APPL_IND']);
          conditionList.push(output);
       }else{
        output = mappings(conditionList[conditionIndex], conditionItem['PGM_NM'], conditionItem['ALWS_APPL_IND']);
        output = _.omit(output, ['PGM_NM', 'ALWS_APPL_IND']);
        conditionList[conditionIndex] = output;
       }
  });
    return conditionList;
};

app.use(json2xls.middleware);

app.get('/', function (req, res) {
   
    var sql = require("mssql");

    var config = {
        user: 'origsvc_boss',
        password: 'n@ti0nstar123',
        server: '10.64.187.38', 
        database: 'ACES_BOSS_DEV',
		port: 1733,
    };

    // connect to your database
    sql.connect(config, function (err) {
    
        if (err) console.log(err);

        var request = new sql.Request();
        request.query(`select cm.SRC_SYS_ID as "MRCCC Condition #",
cm.CND_NM as "Internal Facing Condition Name",
cm.CND_FULL_TXT as "Internal Facing Condition Instructions",
'' as 'Conv. Std?',
'' as 'Manual HARP?',
'' as 'AUS HARP?',
'' as 'FHA Standard (AUS)',
'' as 'FHA Standard (Manual)',
'' as 'FHA Strmline (NCQ)?',
'' as 'FHA Strmline (CQ)?',
'' as 'VA Full Doc (AUS)',
'' as 'VA Manual',
'' as 'VA IRRRL (NCQ)?',
'' as 'VA IRRRL (CQ)?',
'' as 'Non Delegated Jumbo',
cm.CAT_TXT as "Category",
cm.PRI_TO_PROC as "Prior To",
cm.PTA_TO_PTD_ALOW_IND as "PTA/PTD Allowed",
cm.BRWR_FCNG_FLG as "Customer Action  required ?",
cm.BRWR_ASSOC_FLG as "Borrower Association",
cm.ANTN_FLG as "Annotation",
cm.PROC_OWNR_CD as "Owner",
'' as 'Conv Standard Always',
'' as 'Manual HARP Always',
'' as 'AUS HARP Always',
'' as 'FHA Standard (AUS) Always',
'' as 'FHA Manual Always',
'' as 'FHA Streamline (NCQ) Always',
'' as 'FHA Streamline (CQ) Always',
'' as 'VA Full Doc (AUS) Always',
'' as 'VA Full Doc (Manual) Always',
'' as 'VA IRRRL (NCQ) Always',
'' as 'VA IRRRL (CQ) Always',
'' as 'Non Delegated Jumbo Always',
cm.BORR_FCNG_CND_NM as "Customer Facing Headline (31 Characters)",cm.BORR_FCNG_CND_LONG_DESC as "Customer Facing Description - Main (220 Characters)",
cm.TIP as "Customer Facing Annotation",
pgm.PGM_NM,ptc.ALWS_APPL_IND from BOSS.CND_MSTR cm INNER JOIN BOSS.PGM_TO_CND ptc ON cm.CND_ID = ptc.CND_ID 
INNER JOIN BOSS.PGM_MSTR pgm ON ptc.PGM_ID = pgm.PGM_ID
where cm.SRC_SYS_ID BETWEEN 5292 AND 5328 order by ptc.CND_ID;`, function (err, recordset) {
            if (err) console.log(err)
            // send records as a response
            //res.send(uniqConditions(recordset.recordsets[0]));
            res.xls('krish.xlsx', uniqConditions(recordset.recordsets[0]));
            sql.close();
        });
    });
});


var server = app.listen(5000, function () {
    console.log('Server is running..');
});