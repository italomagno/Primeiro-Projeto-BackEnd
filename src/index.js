
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

// Middleware
function verifyIfExistsAccountCPF(request,response,next)
{
  const { cpf } = request.headers;
  const customer = customers.find(customer => customer.cpf === cpf);
  if(!customer){
    return response.status(400).json({error: "Customer not found"})
  }

  request.customer = customer

  return next()

}

function getBalance(statement){
  const balance = statement.reduce((acc,operation)=>{
    if(operation.type === 'credit'){
      return acc + operation.amount
    }else{
      return acc - operation.amount
    }
  },0)

  return balance
}

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

//primeira forma de usar o middleware
 app.get("/statement",verifyIfExistsAccountCPF, (request,response)=>{
  
  const { customer } = request

  return response.json(customer.statement)
})


app.post("/deposit", verifyIfExistsAccountCPF, (request,response)=>{
  const { description, amount} = request.body;
  const {customer} = request;

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "credit"
  }

  customer.statement.push(statementOperation);

  response.status(201).send()
})


app.post("/withdraw", verifyIfExistsAccountCPF, (request,response)=>{
const { amount } = request.body
const { customer } = request;

const balance = getBalance(customer.statement)

if(balance < amount){
  return response.status(400).json({error: "Insufficient funds!"})
}


const statementOperation = {
  amount,
  created_at: new Date(),
  type: "debit",
}

customer.statement.push(statementOperation)

return response.status(201).send()


})




//segunda forma de usar o middleware
//utilizado quando todas as rotas passam pela mesma verificação
app.use(verifyIfExistsAccountCPF)




app.listen(3333)
