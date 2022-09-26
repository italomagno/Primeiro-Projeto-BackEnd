
const express = require("express")
const { v4: uuidv4 } = require("uuid")

const app = express()


app.use(express.json())


/*
* cpf - strng
* name - string
* id - uuid
* statement []
*/

const customers = [

]

app.post("/account", (request,response)=>{
  const {cpf , name} = request.body

const costumerAlreadyExists = customers.some((customer)=>customer.cpf === cpf)

if(costumerAlreadyExists){
  return response.status(400).json({error: "Customer Already Exists!"})
}

  customers.push({
    cpf,
    name,
    id: uuidv4(),
    statement:[]
  })
  return response.status(201).send()
})


app.listen(3333)
