HOST: localhost:3000/api/v1

# Prescription API

Only doctors can get access to this API. Patients can only view their prescriptions, via the examine log.

[POST] /prescription/new
Create a new prescription. This endpoint will be called when the doctor wants to create a new prescription for a patient.

[PUT] /prescription/:id
Update an existing prescription. Only the doctor who created the prescription can update it, and only if the prescription is still in draft status!

[GET] /prescription/:id
Get the details of a specific prescription.

[DELETE] /prescription/:id
Delete a prescription. Only the doctor who created the prescription can delete it, and only if the prescription is still in draft status!
