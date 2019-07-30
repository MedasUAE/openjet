let medicineRequestObject;
const medicineModel = require('../data/model').dataModel.medicineModel;

//compose methods
const pipe = (f, g) => (...args) => g(f(...args));
const pipeMedicineRequest = (...fns) => fns.reduce(pipe);

const setSubject = (medicineModel) => {

    const { patientInfo } = medicineRequestObject;
    const identifier = (patientInfo.emirates_id) ? patientInfo.emirates_id.split("-").join("") : patientInfo.passport_no
    const subject = {
        reference: `Patient?identifier=${identifier}`,
        display: patientInfo.patient_name
    }

    return Object.assign({}, medicineModel, { subject });
}

const setAuthoredOn = (medicineModel) => {
    const authoredOn = "2018-10-04T14:54:07.41+04:00"
    return Object.assign({}, medicineModel, { authoredOn });
}

const setRequester = (medicineModel) => {
    const { doctorInfo, officeInfo } = medicineRequestObject;
    const requester = {
        agent: {
            reference: `Practitioner?identifier=${doctorInfo.clinician_code}`,
            display: doctorInfo.doctors_name
        },
        onBehalfOf: {
            reference: `Organization?identifier=${officeInfo.facility_id}`,
            display: officeInfo.office_Name
        }
    }

    return Object.assign({}, medicineModel, { requester });
}

const setReasonCode = (medicineModel) => {
    const reasonCode = medicineRequestObject.diagnosisList.map(diagnosis => {
        return {
            coding: [{
                code: diagnosis.diagnosis_id,
                system: "http://hl7.org/fhir/sid/icd-10"
            }, {
                code: (diagnosis.diagnosis_category === "P") ? "principal" : "differential",
                system: "http://hl7.org/fhir/ex-diagnosistype"
            }]
        }
    });

    return Object.assign({}, medicineModel, { reasonCode });
}

const setDispenseRequest = (medicineModel) => {
    const { medicine } = medicineRequestObject;
    const dispenseRequest = {
        quantity: {
            value: medicine.medicine_qty,
            unit: medicine.medicine_form
        },
        validityPeriod: {
            end: "2018-10-06T14:54:07.41+04:00",
            start: "2018-10-04T14:54:07.41+04:00"
        },
        expectedSupplyDuration: {
            unit: "days",
            value: 5
        },
        numberOfRepeatsAllowed: 0
    }

    return Object.assign({}, medicineModel, { dispenseRequest });
}

const setDosageInstruction = (medicineModel) => {
    const { medicine } = medicineRequestObject;
    const dosageInstruction = [{
        patientInstruction: medicine.remarks,
        route: { text: medicine.medicine_roa },
        doseQuantity: {
            unit: medicine.medicine_dosage_unit,
            value: medicine.medicine_dosage_value
        },
        timing: {
            repeat: {
                frequency: medicine.medicine_freq,
                period: medicine.medicine_durantion,
                periodUnit: "d"
            }
        }
    }];

    return Object.assign({}, medicineModel, { dosageInstruction });
}

const setReferences = (medicineModel) => {
    const { medicine } = medicineRequestObject;
    const medicationReference = {
        reference: `Medication?code=${medicine.medicine_id}`
    }

    return Object.assign({}, medicineModel, { medicationReference });
}

const medicine = (mRequest) => {
    medicineRequestObject = mRequest;
    return pipeMedicineRequest(
        setSubject,
        setAuthoredOn,
        setRequester,
        setReasonCode,
        setDispenseRequest,
        setDosageInstruction,
        setReferences
    )(medicineModel);
}

exports.medicine = medicine;