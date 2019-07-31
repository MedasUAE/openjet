const patientModel = require('../data/model').dataModel.patientModel;
let patientInfo;

//compose methods
const pipe = (f,g) => (...args) => g(f(...args));
const pipeCreatePatientRequest = (...fns) => fns.reduce(pipe);

/**
 * preparing patient telecom details
 * @param {} patientModel 
 */
const setTelecom = (patientModel) => {
    return Object.assign({}, patientModel, {
        telecom: [{
            use: "home",
            rank: 1,
            system: "phone",
            value: patientInfo.mobile
        }]});
}

/**
 * 
 * @param {setting patient gender and dob} patientModel 
 */
const setGenderAndDOB = (patientModel) => {
    const gender = patientInfo.sex.toLowerCase();
    const birthDate = patientInfo.date_of_birth;
    return Object.assign({}, patientModel, {gender, birthDate});
}

/**
 * 
 * @param {setting patient emirates id or passport no} patientModel 
 */
const setIdentificationId = (patientModel) => {
    let identifier = { use: "official" };
    // if emirates_id else passport_no
    if(patientInfo.emirates_id) {
        identifier.system = "http://fhir.inhealth.ae/EmiratesId";
        identifier.value = patientInfo.emirates_id.split("-").join("");
    } else if(patientInfo.passport_no) {
        identifier.system = "http://fhir.inhealth.ae/InternationalIdAndCountry";
        identifier.value = patientInfo.passport_no;
    }
    return Object.assign({}, patientModel, {identifier:[identifier]});
}

/**
 * 
 * @param {setting patient givenName and familyName} patientModel 
 */
const setName = (patientModel) => {
    const nameArray = patientInfo.patient_name.split(" ");
    let nameArrayWithoutBlanck = [];
    nameArray.forEach(name=>{
        if(name) nameArrayWithoutBlanck.push(name)
    })
    
    const name = [{
        given: nameArrayWithoutBlanck,
        family: nameArray[nameArray.length-1]
    }];
    return Object.assign({}, patientModel, {name});
}

const patient = (pInfo) => {
    patientInfo = pInfo;
    return pipeCreatePatientRequest(setName, setGenderAndDOB, setIdentificationId, setTelecom)(patientModel);
}
exports.patient = patient;
