exports.dataModel = {
  medicineModel: {
    resourceType: "MedicationRequest",
    intent: "order",
    status: "active",
    subject: {},
    authoredOn: "",
    requester: {
      agent: {},
      onBehalfOf: {}
    },
    reasonCode: [],
    dispenseRequest: {
      validityPeriod: {},
      expectedSupplyDuration: {},
      numberOfRepeatsAllowed: 1
    },
    dosageInstruction: [],
    medicationReference: {
      reference: ""
    },
    supportingInformation: []
  },
  patientModel: {
    resourceType: "Patient",
    active: true,
    name: [],
    gender: "", //male,female
    telecom: [],
    birthDate: "", //yyyy-mm-dd
    identifier: []
  }
}

/**
 * Example JSON for PatientModel
 * {
  "resourceType": "Patient",
  "name": [
    {
      "given": [
        "Abdul"
      ],
      "family": "Hussain"
    }
  ],
  "active": true,
  "gender": "male",
  "birthDate": "",
  "telecom": [
    {
      "use": "work",
      "rank": 1,
      "value": "00123456789",
      "system": "phone"
    },
    {
      "use": "work",
      "rank": 1,
      "value": "abdul.hussain@inhealth.test.ae",
      "system": "email"
    }
  ],
  "birthDate": "2000-02-02",
  "identifier": [
    {
      "use": "official",
      "value": "7840000000000",
      "system": "http://fhir.inhealth.ae/EmiratesId"
    },
    {
      "use": "official",
      "value": "1234AE",
      "system": "http://fhir.inhealth.ae/InternationalIdAndCountry"
    }
  ]
}

Example JSON for Medicine Request
{
  "resourceType": "MedicationRequest",
  "intent": "order",
  "status": "active",
  "subject": {
    "reference": "Patient?identifier=784197012345671",
    "display": "Mohammed Khan"
  },
  "authoredOn": "2018-10-04T14:54:07.41+04:00",
  "requester": {
    "agent": {
      "reference": "Practitioner?identifier=GN00000",
      "display": "Test ABDULAH"
    },
    "onBehalfOf": {
      "reference": "Organization?identifier=PF1147",
      "display": "TEST MEDICAL CENTER"
    }
  },
  "reasonCode": [
    {
      "coding": [
        {
          "code": "H02.234",
          "system": "http://hl7.org/fhir/sid/icd-10"
        },
        {
          "code": "principal",
          "system": "http://hl7.org/fhir/ex-diagnosistype"
        }
      ]
    },
    {
      "coding": [
        {
          "code": "I69.334",
          "system": "http://hl7.org/fhir/sid/icd-10"
        },
        {
          "code": "differential",
          "system": "http://hl7.org/fhir/ex-diagnosistype"
        }
      ]
    }
  ],
  "dispenseRequest": {
    quantity: {
        value: "10",
        unit: "Tablets"
    }
    "validityPeriod": {
      "end": "2018-10-06T14:54:07.41+04:00",
      "start": "2018-10-04T14:54:07.41+04:00"
    },
    "expectedSupplyDuration": {
      "unit": "days",
      "value": 5
    },
    "numberOfRepeatsAllowed": 1
  },
  "dosageInstruction": [
    {
      "patientInstruction": "One tablet every 4 hours",
      "route": {
        "text": "Oral Route"
      },
      "doseQuantity": {
        "unit": "mg",
        "value": 2
      },
      "timing": {
        "repeat": {
          "frequency": 2,
          "period": 1,
          "periodUnit": "d"
        }
      }
    }
  ],
  "medicationReference": {
    "reference": "Medication?code=A40-3594-00112-01"
  },
  "supportingInformation": [
    {
      "reference": "Media/8645"
    }
  ]
}
*/