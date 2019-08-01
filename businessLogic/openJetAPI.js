const request = require('request');
const logger = require('../lib/logger');
const openJetAPI = {};
openJetAPI.url = 'https://erxqa.inhealth.ae/blaze/'

/**
 * Get Ouath Token
 */
const oauthCall = () => {
    const authModel = require('../config/config').auth;
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
            logger.debug("getting auth for " + JSON.stringify(authModel))
            if (err) reject(err)
            const json = JSON.parse(res.body);
            resolve(json.access_token);
        });
    });
}

/**
 * common POST Call
 */
const POST = async function (postData, url) {
    logger.info("openJetAPI.POST URL:" + url);
    // logger.debug("openJetAPI.POST \npostData: " + JSON.stringify(postData))
    if (!openJetAPI.token) openJetAPI.token = await oauthCall();
    // const options = {
    //     url,
    //     auth: { 'bearer': openJetAPI.token },
    //     headers: { 'Content-Type': 'application/json' },
    //     method: 'POST',
    //     json: true,
    //     body: postData,
    // }
    // return request(options);
    return new Promise((resolve, reject) => {
        request({
            url,
            auth: { 'bearer': openJetAPI.token },
            headers: { 'Content-Type': 'application/json' },
            method: 'POST',
            json: true,
            body: postData,
        }, function (err, res) {
            if (err) reject(err);
            logger.info("openJetAPI.POST URL:" + url + " statusCode:" + res.statusCode)
            resolve(res);
        });
    });
}

const getTextInIssuesList = issues => {
    return issues.map(issue => {
        return issue.details.text;
    });
}

const getCodingInIssueist = issues => {
    try {
        if (!issues || !Array.isArray(issues)) return [];
        return issues.map(issue => {
            if (!issue.details.coding) return "";
            if (Array.isArray(issue.details.coding))
                return issue.details.coding.map(code => {
                    return code.code
                }).join(",");
            return "";
        });
    } catch (error) {
        logger.error("At getCodingInIssueist" + error.message, error.stack)
        return []
    }

}

function simplifyError(data) {
    logger.info("At simplifyError");
    return {
        message: getTextInIssuesList(data).join(","),
        code: getCodingInIssueist(data).join(","),
        statusCode: 400,
        data: data
    }
}

const simplifyResponse = function (response) {
    logger.info("AT simplifyResponse");
    if (!response) {
        logger.info("No response from API")
        return {
            message: "No response from API",
            statusCode: 200,
            code: "",
            data: []
        }
    }
    else if (!Array.isArray(response)) {
        logger.info("responce is not array")
        return {
            message: "responce is not array",
            statusCode: 200,
            code: "",
            data: []
        }
    }
    else {
        const finalResponse = {};
        response.forEach(res => {
            // if each response is null means success
            if (!res) {
                finalResponse.message = "Successfully medication submitted";
                finalResponse.statusCode = 200;
            }
            else {
                if (finalResponse.message) finalResponse.message = finalResponse.message + '\n' + res.message;
                else finalResponse.message = res.message;
                if (!finalResponse.statusCode || finalResponse.statusCode == 200)
                    finalResponse.statusCode = res.statusCode;
            }

        });
        return finalResponse;
    }
}

// openJetAPI.medicineListRequest = async postData => {
//     const medicine = require('./medicine').medicine;
//     const resArray = postData.medicineList.map(async singleMedicineObj => {
//         // each medicine logic
//         const medicineRequestPostData = medicine({
//             medicine: singleMedicineObj,
//             diagnosisList: postData.diagnosisList,
//             doctorInfo: postData.doctorInfo,
//             officeInfo: postData.officeInfo,
//             patientInfo: postData.patientInfo
//         });
//         //calling fist MedicationRequest
//         let response = await POST(medicineRequestPostData, openJetAPI.url + "MedicationRequest");
//         if(response.statusCode == 200 || response.statusCode == 201) return response.body; //pass successfully
//         //fail with 400 stausCode
//         else if(response.statusCode == 400) {
//             logger.error(getTextInIssuesList(response.body.issue).join(","))
//             //check the business-rule issue code
//             const patient = require('../businessLogic/patient').patient;
//             const patientRequestPostData = patient(postData.patientInfo);
//             response = await POST(patientRequestPostData, openJetAPI.url + "Patient");// patienr create api call
//             if(response.statusCode == 400) return returnError(getTextInIssuesList(response.body.issue).join(","));
//             else if(response.statusCode == 200) {
//                 response = await POST(medicineRequestPostData, openJetAPI.url + "MedicationRequest"); //second call for medication request
//                 if(response.statusCode == 200 || response.statusCode == 201) return response.body; //success logic
//                 else return response.body; //final failure logic
//             }
//         }
//         else return response.body; //fail with other status code; write userfreindly response
//     });
//     const results = await Promise.all(resArray)
//     return results
// }

const medicineRequest = async postData => {
    logger.info("At medicineRequest");
    const medicine = require('./medicine').medicine; //getting medicine class object
    //preparing promise array
    const resArray = postData.medicineList.map(async singleMedicineObj => {
        //getting medicine postData object
        const medicineRequestPostData = medicine({
            medicine: singleMedicineObj,
            diagnosisList: postData.diagnosisList,
            doctorInfo: postData.doctorInfo,
            officeInfo: postData.officeInfo,
            patientInfo: postData.patientInfo
        });
        //calling MedicationRequest API
        let response = await POST(medicineRequestPostData, openJetAPI.url + "MedicationRequest");
        if (response.statusCode == 200 || response.statusCode == 201) return response.body; //pass successfully
        else { //incase of aerror
            const errorMessage = simplifyError(response.body.issue);
            return errorMessage;
        }
    });
    const results = await Promise.all(resArray); //calling all API in parallel
    return results;
}

// we can remove
const successMessage = () => {
    return {
        message: "successfully added the medicine",
        statusCode: 200,
        code: "",
        data: []
    }
}


openJetAPI.medicineListRequest = async postData => {
    const patient = require('../businessLogic/patient').patient; //patient class 
    const patientRequestPostData = patient(postData.patientInfo); //preparing patient postData to create
    let response = await POST(patientRequestPostData, openJetAPI.url + "Patient");// patient create api call
    //success in patient create API
    if (response.statusCode == 200 || response.statusCode == 201) {
        logger.info("Patient created, calling medicine request");
        // call medicine request
        response = await medicineRequest(postData);
        response = simplifyResponse(response); //Array of response to Object response
        logger.info("Returning medicine API response, from Patient created bolck");
        // //success in medicine submission
        // if (response.statusCode == 200 || response.statusCode == 201){
        //     logger.info("Returning medicine API SUCCESS response, from Patient created bolck");
        //     return successMessage(); //ToDo work on response currently its array of response
        // }

        return response;
    }
    //error in patient create API
    else if (response.statusCode == 400) {
        const errorMessage = simplifyError(response.body.issue);
        //when patient already exist
        if (errorMessage.code == "BR340") {
            logger.info("Patient already exist, calling medicine request");
            response = await medicineRequest(postData); //calling medicine API
            response = simplifyResponse(response); //Array of response to Object response

            // if (response.statusCode == 200 || response.statusCode == 201){
            //     logger.info("Returning medicine API success response from Patient already exist block");
            //     return successMessage() //ToDo work on response currently its array of response
            // }

            return response;
        } else { //patient create API unknown error
            logger.error("Patient API unknown error", JSON.stringify(errorMessage));
            return errorMessage; //return response
        }
    }

    else return response;
}

exports.medicineAPICall = openJetAPI.medicineListRequest;