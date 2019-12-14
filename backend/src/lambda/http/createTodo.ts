import 'source-map-support/register'
const uuid = require('uuid/v4')
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/createTodoRequest'
import {TodoItem} from '../../models/todoItem'
import { DynamoDB } from 'aws-sdk'
import { Jwt } from '../../auth/Jwt'
import {  decode } from 'jsonwebtoken'

const docClient = new DynamoDB.DocumentClient()
const todoTable = process.env.TODO_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
  const newTodo: CreateTodoRequest = JSON.parse(event.body)

  // TODO: Implement creating a new TODO item
  const newId = uuid()
  const authHeader = event.headers['Authorization']
  console.log('authHeader',authHeader)
  const token = getToken(authHeader)
  const jwt: Jwt = decode(token, { complete: true }) as Jwt
  console.log('jwt',jwt.payload)
  const item = new TodoItem()

  
  
    item.userId= jwt.payload.sub
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


function getToken(authHeader: string): string {
    if (!authHeader) throw new Error('No authentication header')
  
    if (!authHeader.toLowerCase().startsWith('bearer '))
      throw new Error('Invalid authentication header')
  
    const split = authHeader.split(' ')
    const token = split[1]
  
    return token
  }