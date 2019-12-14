import 'source-map-support/register'
const uuid = require('uuid/v4')
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/createTodoRequest'
import {TodoItem} from '../../models/todoItem'
import { DynamoDB } from 'aws-sdk'


const docClient = new DynamoDB.DocumentClient()
const todoTable = process.env.TODO_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  // TODO: Implement creating a new TODO item
  const newId = uuid()
const item = new TodoItem()

  
  
    item.userId= 'DUMMY'
    item.todoId= newId
    item.createdAt= new Date().toString()
    item.name= newTodo.name,
    item.dueDate= newTodo.dueDate,
    item.done= false,
    item.attachmentUrl= null
  

  await docClient.put({
    TableName: todoTable,
    Item: item
}).promise()

  
  return {
        statusCode: 201,
        headers:{
            'Access-Control-Allow-Origin':'*'
        },
        body: JSON.stringify({
            item
        })
    }

}
