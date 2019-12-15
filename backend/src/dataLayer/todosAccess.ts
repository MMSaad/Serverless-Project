import { TodoItem } from "../models/todoItem";
import { CreateTodoRequest } from "../requests/createTodoRequest";
import { UpdateTodoRequest } from "../requests/updateTodoRequest";
const uuid = require('uuid/v4')
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'



export class TodosAccess{
    constructor(
        private readonly XAWS = AWSXRay.captureAWS(AWS),
        private readonly docClient: AWS.DynamoDB.DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly todosTable = process.env.TODO_TABLE,
        private readonly userIdIndex = process.env.USER_ID_INDEX
    )
        {}

    async getUserTodos(userId: string): Promise<TodoItem[]>{
        const result = await this.docClient.query({
            TableName: this.todosTable,
            IndexName: this.userIdIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues:{
                ':userId':userId
            }
        }).promise()
        return result.Items as TodoItem[]
    }

    async createTodo(request: CreateTodoRequest,userId: string): Promise<TodoItem>{
        const newId = uuid()
        const item = new TodoItem()
        item.userId= userId
        item.todoId= newId
        item.createdAt= new Date().toISOString()
        item.name= request.name
        item.dueDate= request.dueDate
        item.done= false
  
        await this.docClient.put({
            TableName: this.todosTable,
            Item: item
        }).promise()

        return item
    }


    async getTodoById(id: string): Promise<AWS.DynamoDB.QueryOutput>{
        return await this.docClient.query({
            TableName: this.todosTable,
            KeyConditionExpression: 'todoId = :todoId',
            ExpressionAttributeValues:{
                ':todoId': id
            }
        }).promise()
    }

    async updateTodo(updatedTodo:UpdateTodoRequest,todoId:string){
        await this.docClient.update({
            TableName: this.todosTable,
            Key:{
                'todoId':todoId
            },
            UpdateExpression: 'set #namefield = :n, dueDate = :d, done = :done',
            ExpressionAttributeValues: {
                ':n' : updatedTodo.name,
                ':d' : updatedTodo.dueDate,
                ':done' : updatedTodo.done
            },
            ExpressionAttributeNames:{
                "#namefield": "name"
              }
          }).promise()
    }

    async deleteTodoById(todoId: string){
        const param = {
            TableName: this.todosTable,
            Key:{
                "todoId":todoId
            }
        }
      
         await this.docClient.delete(param).promise()
    }
    
}