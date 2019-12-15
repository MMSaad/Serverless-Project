import 'source-map-support/register'
const uuid = require('uuid/v4')
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/createTodoRequest'
import {TodoItem} from '../../models/todoItem'
import { DynamoDB } from 'aws-sdk'
import { getUserId} from '../../helpers/authHelper'


const docClient = new DynamoDB.DocumentClient()
const todoTable = process.env.TODO_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
    const newTodo: CreateTodoRequest = JSON.parse(event.body)

    const newId = uuid()
    const authHeader = event.headers['Authorization']
    const userId = getUserId(authHeader)
    const item = new TodoItem()

  
  
    item.userId= userId
    item.todoId= newId
    item.createdAt= new Date().toISOString()
    item.name= newTodo.name
    item.dueDate= newTodo.dueDate
    item.done= false
  

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
