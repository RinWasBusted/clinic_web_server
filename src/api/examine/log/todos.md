HOST: localhost:3000/api/v1

# Examine Log API for Examination Department

[POST] /examine/new
Create a new examine log. This endpoint will be called when the doctor starts the examination for a patient. The request body should include the following information:

[PUT] /examine/:id
Update an existing examine log. Only the doctor who created the examine log can update it, and only if the log is still in draft status!

[GET] /examine/:id

[DELETE] /examine/:id

[GET] /examine/:id/print
Get the examine log in a printable format. This endpoint will be called when the doctor wants to print the examination report for a patient.
