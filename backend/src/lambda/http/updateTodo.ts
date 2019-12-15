import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId} from '../../helpers/authHelper'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { TodosAccess } from '../../dataLayer/todosAccess'
import { ApiResponseHelper } from '../../helpers/apiResponseHelper'


const todosAccess = new TodosAccess()
const apiResponseHelper = new ApiResponseHelper()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    const authHeader = event.headers['Authorization']
    const userId = getUserId(authHeader)
  
    const item = await todosAccess.getTodoById(todoId)
  
    if(item.Count == 0){
        return apiResponseHelper.generateErrorResponse(400,'TODO not exists')
    }

    if(item.Items[0].userId !== userId){
        return apiResponseHelper.generateErrorResponse(400,'TODO does not belong to authorized user')
    }

    await new TodosAccess().updateTodo(updatedTodo,todoId)
    return apiResponseHelper.generateEmptySuccessResponse(204)
  
}
