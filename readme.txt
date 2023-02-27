This is construction services project,

where clients can submit construction request to the service admin,

then the admin would assign the request to a contractor, and set payment amount and start date and estimate end date,

to run the project first you need to clone the github repository,

then in package.json file directory run in a terminal "npm install" to install all the dependencies,

then you need to run the Json-Server by "npx json-server --watch  data/db.json --routes data/routes.json"

the server should start running on port 3000,

then on a new terminal run "npm run dev" to start the application on port 7000,

the default login page should be "http://localhost:7000/construction/login"

and to login you can use either an admin account:

{
    "username": "admin",
    "role": "Admin",
    "password": "LetAdminIn..2023",
}

or you can use one of the two predefined clients accounts:

{
      "username": "TestClient1",
      "role": "Client",
      "password": "LetClient1In..2023",
}

{
  "username": "TestClient2",
  "role": "Client",
  "password": "LetClient2In..2023",
}

the TestClient1 should have two created request already, however, TestClient2 did not create any request yet,

after the login you will be redirected to the requests list page,

where you can see all the requests if you're an admin,

but if you are a client you will be able to view the requests that you created only,

you will be able to create new requests only if you're a client, and you can edit some fields in the request after submission,

the admin can then edit his fields such as the payment amount and the estimation fields,

after that the client can click on the payment action to start the payment process,