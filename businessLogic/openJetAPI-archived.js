const request = require('request');
const logger = require('../lib/logger');
const openJetAPI = {};

openJetAPI.url = 'https://erxqa.inhealth.ae/blaze/'
/**
 * Get Ouath Token
 */
openJetAPI.oauthCall = () => {
  const authModel = require('../data/model').dataModel.auth;
  return new Promise((resolve, reject) => {
    request.post({
      url: 'https://erxqa.inhealth.ae/cas/oidc/token',
      method: 'POST',
      auth: {
        user: authModel.user,
        pass: authModel.pass
      },
      form: { grant_type: 'client_credentials' }
    }, function (err, res) {
      if (err) reject(err)
      const json = JSON.parse(res.body);
      resolve(json.access_token);
    });
  });
}

/**
 * common POST Call
 */
openJetAPI.POST = async function (postData, url) {
  logger.info("openJetAPI.POST URL:" + url);
  logger.info("openJetAPI.POST \npostData: " + JSON.stringify(postData))
  if (!openJetAPI.token) openJetAPI.token = await openJetAPI.oauthCall();
  return new Promise((resolve, reject) => {
    request({
      url,
      auth: { 'bearer': openJetAPI.token },
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      json: true,
      body: postData,
    }, function (err, res) {
      logger.info("openJetAPI.POST URL:" + url + " statusCode:" + res.statusCode)
      if (err) reject(err);
      resolve(res);
    });
  })
}

/**
 * Create Patient call
 */
openJetAPI.createPatient = async (patientData) => {
  logger.info("At createPatient")
  try {
    if (!openJetAPI.token) openJetAPI.token = await openJetAPI.oauthCall();
    openJetAPI.url = openJetAPI.url + "Patient";
    const result = await openJetAPI.POST(patientData, openJetAPI.url);
    logger.info("createPatient ResponseCode: ", result.statusCode)
    return result;
  } catch (error) {
    logger.error("createPatient, Error: " + error);
    return error;
  }
}

/**
 * get FAIL code from API in case of valid JSON Request
 */
openJetAPI.getFailCode = (body) => {
  logger.info("At getFailCode");
  let fail = {};
  if (!body) {
    logger.info("No body in response");
    return {
      text: "No body in response."
    };
  };
  // if issue is array
  if (Array.isArray(body.issue)) {
    // if issue length is present
    if (body.issue.length && body.issue[0].details) {
      logger.info(body.issue[0].details.text);
      fail.text = body.issue[0].details.text;
      //if response coding is there
      if (Array.isArray(body.issue[0].details.coding)) {
        logger.info("OpenJet ResponseCode: " + body.issue[0].details.coding[0].code)
        fail.code = body.issue[0].details.coding[0].code;
      }
      // any error in values
      else {
        body.issue.forEach(i => {
          logger.error(JSON.stringify(i))
        });
      }
    }
  }
  return fail;
}

/**
 *  Medicine Request including Create Patient if Patient not exist
 */
openJetAPI.medicineRequest = (postData) => {
  logger.info("At medicineRequest");
  return new Promise(async (resolve, reject) => {
    try {
      let res = await openJetAPI.POST(postData.medicineRequestPostData, openJetAPI.url + "Medication");
      const statusCode = res.statusCode;
      if (statusCode == 200) {
        resolve("Medicine Saved");
      }
      else {
        const fail = openJetAPI.getFailCode(res.body);
        logger.info("Code: " + fail.code + ", Message:" + fail.text)
        reject(fail)
      }
    } catch (error) {
      reject(error)
    }
  })

}


/**
 * Only Medicine Request
 */
openJetAPI.medRequestCall = async (medicineData) => {
  openJetAPI.url = openJetAPI.url + "MedicationRequest";
  return openJetAPI.POST(medicineData, openJetAPI.url);
}

/**
 * medicine API call
 */
openJetAPI.medicineAPICall = async (medicineRequestObject) => {
  const logger = require('../lib/logger')
  if (!medicineRequestObject) return "No Request Data" // medicineRequestObject = require('../data/inputParam').params.medicineRequest;

  const patient = require('./patient').patient;
  const patientRequestPostData = patient(medicineRequestObject.patientInfo);

  const medicine = require('./medicine').medicine;

  try {
    const medicineRequestPostData = medicine({
      medicine: medicineRequestObject.medicineList[0],
      diagnosisList: medicineRequestObject.diagnosisList,
      doctorInfo: medicineRequestObject.doctorInfo,
      officeInfo: medicineRequestObject.officeInfo,
      patientInfo: medicineRequestObject.patientInfo
    });

    const a = await openJetAPI.medicineRequest({ medicineRequestPostData, patientRequestPostData });
    logger.info("status code" + a);
    // return a;
    // medicineRequestObject.medicineList.forEach(async medReqObj => {
    //   const medicineRequestPostData = medicine({
    //     medicine: medReqObj,
    //     diagnosisList: medicineRequestObject.diagnosisList,
    //     doctorInfo: medicineRequestObject.doctorInfo,
    //     officeInfo: medicineRequestObject.officeInfo,
    //     patientInfo: medicineRequestObject.patientInfo
    //   });
    //   await openJetAPI.medicineRequest({ medicineRequestPostData, patientRequestPostData });
    // });
  } catch (error) {
    logger.error(error.text);
    // return error.text;
  }

}
// exports.createPatient = openJetAPI.createPatient;
// exports.medicineRequest = openJetAPI.medicineRequest;

exports.medicineAPICall = openJetAPI.medicineAPICall;