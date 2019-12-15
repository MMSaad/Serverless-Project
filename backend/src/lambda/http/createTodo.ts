import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateTodoRequest } from '../../requests/createTodoRequest'
import { getUserId} from '../../helpers/authHelper'
import { TodosAccess } from '../../dataLayer/todosAccess'
import { ApiResponseHelper } from '../../helpers/apiResponseHelper'


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
    const newTodo: CreateTodoRequest = JSON.parse(event.body)

    
    const authHeader = event.headers['Authorization']
    const userId = getUserId(authHeader)
    const item = await new TodosAccess().createTodo(newTodo,userId)
    
    return new ApiResponseHelper().generateDataSuccessResponse(201,'item',item)

}
