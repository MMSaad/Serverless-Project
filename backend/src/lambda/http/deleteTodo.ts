import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId} from '../../helpers/authHelper'
import { TodosAccess } from '../../dataLayer/todosAccess'
import { ApiResponseHelper } from '../../helpers/apiResponseHelper'
import { createLogger } from '../../utils/logger'

const todosAccess = new TodosAccess()
const apiResponseHelper = new ApiResponseHelper()
const logger = createLogger('todos')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    if(!todoId){
        logger.error('invalid delete attempt without todo id')
        return apiResponseHelper.generateErrorResponse(400,'invalid parameters')
    }
 
    const authHeader = event.headers['Authorization']
    const userId = getUserId(authHeader)

    const item = await todosAccess.getTodoById(todoId)
    if(item.Count == 0){
        logger.error(`user ${userId} requesting delete for non exists todo with id ${todoId}`)
        return apiResponseHelper.generateErrorResponse(400,'TODO not exists')
    }

    if(item.Items[0].userId !== userId){
        logger.error(`user ${userId} requesting delete todo does not belong to his account with id ${todoId}`)
        return apiResponseHelper.generateErrorResponse(400,'TODO does not belong to authorized user')
    }

    logger.info(`User ${userId} deleting todo ${todoId}`)
    await todosAccess.deleteTodoById(todoId)
    return apiResponseHelper.generateEmptySuccessResponse(204)

  
}
