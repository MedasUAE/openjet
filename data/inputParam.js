exports.params = {
    medicineRequest1: {
        patientInfo: {
            patient_name: "PAUL JACQUES HARMIGNIE",
            sex: "Male",
            emirates_id: "784-1971-4718529-8",
            mobile: "971547910596",
            date_of_birth: "1971-05-30"
        },
        officeInfo: {
            facility_id: 'CL-MC-0048-11',
            office_Name: "TEST MEDICAL CENTER",
        },
        doctorInfo: {
            clinician_code: 'DHA-P-0164084',
            doctors_name: 'Test Dr. Willem Vrolijk'
        },
        diagnosisList: [{
            diagnosis_id: "F40.01",
            diagnosis_category: "P"
        }],
        medicine: {
            medicine_qty: 15,
            medicine_freq: 1,
            medicine_freqtype: 'Day',
            medicine_durantion: 15,
            remarks: "Take 1 Unit(s), 1 Time(s) per Day  For 15 Day(s).",
            medicine_roa: "ORAL",
            medcine_dosageunit: 'mg', // streangth Unit
            medicine_dosagevalue: 0.25, //Strength
            medicine_id: "1364-243502-1171",
            medicine_form: "TABLETS (30'S,  BLISTER PACK)"
        }
    }, "medicineRequest": {
        "medicineList": [
            {
                "medicine_form": "FILM COATED TABLETS (32'S, BLISTER)",
                "medicine_qty": 21,
                "medicine_id": "2027-560101-0391",
                "medicine_freq": 3,
                "medicine_dosage_value": 0.25,
                "medicine_dosage_unit": "mg",
                "medicine_freqtype": "Day",
                "medicine_durantion": 7,
                "medicine_roa": "ROA074",
                "remarks": "Take 1 Unit(s), 1-1-1 Time(s) per Day (After Meal) For 7 Day(s)."
            }
        ],
        "diagnosisList": [
            {
                "diagnosis_id": "J06.9",
                "diagnosis_category": "P"
            },
            {
                "diagnosis_id": "R05",
                "diagnosis_category": "S"
            },
            {
                "diagnosis_id": "R50.9",
                "diagnosis_category": "S"
            },
            {
                "diagnosis_id": "R53.81",
                "diagnosis_category": "S"
            }
        ],
        "doctorInfo": {
            "clinician_code": "DHA-P-0140797",
            "doctors_name": "Dr. Rogie Villarosa Belen"
        },
        "patientInfo": {
            "emirates_id": "784-1985-1919604-6",
            "date_of_birth": "26-05-1985",
            "sex": "Female",
            "patient_name": "RINTU  JOSE",
            "mobile": "+971504780074"
        },
        "officeInfo": {
            "office_Name": "Amber Clinics, Al Rigga",
            "facility_id": "DHA-F-0047994"
        }
    }
}