HOST: localhost:3000/api/v1

Get the enter ticket list, including the pending and completed tickets. The list can be filtered by date and status.

# Ticket Management API for Examination Department

[POST] /examine/ticket DONE
Create new tickets

[GET] /examine/ticket/find?date=&status=&page=&limit=&roomID= DONE
Doctors find the ticket list by date and status.

[GET] /examine/ticket/:id DONE
Get the details of a specific ticket by its ID. Will be used in further requests to update or complete the ticket.

[PATCH] /examine/ticket/:id DONE
Mark the ticket as one of the following status:
a. (status: skip), indicating that it is:
+still in progress and not yet completed, or
+on hold for a while. i.e supposed patient to appear but did not show up for a while
b. (status: in_check), indicating that the examination is currently in progress.
c. (status: done), indicating that the examination is completed.

[GET] /examine/ticket/next?roomID= DONE
Call the next ticket in the queue. Criterias:
-The current ticket is the first ticket, ordered by created_at, with the status of "pending".
-This endpoint will return the details of the supposed ticket.
This will update the next ticket to "in_check". This endpoint can be used to manage the flow of patients in the examination room.

[GET] /examine/ticket/current?roomID= DONE. PUBLIC API

- ONLY FIND the ticket that is currently being served, which has the status of "in_check".
- Get the patient that is supposed to show up. This can be used to display the current patient's information on a screen or to notify the staff about the ongoing examination.

### Problems:

1. handle the skipped ticket, which is still in progress but not yet completed. It should be marked as "skip" status and can be resumed later when the patient shows up.
2. if the skipped patient shows up later, but the doctor is serving another patient: wait until the current patient is completed, then resume the skipped ticket and update its status to "in_check". This ensures that the skipped patient is attended to as soon as possible while maintaining the flow of patients in the examination room.

# Examine log creation

- In default, when the patient is called

# Planning:

- Pagination strategy:
  - Use offset-based pagination
  - Use a table to store number of counting, preventing the performance issue of counting the number of records in the database. (implement later if time allows)
