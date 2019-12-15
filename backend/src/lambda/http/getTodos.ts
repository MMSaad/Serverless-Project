import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { getUserId} from '../../helpers/authHelper'
import { TodosAccess } from '../../dataLayer/todosAccess'
import { S3Helper } from '../../helpers/s3Helper'
import { ApiResponseHelper } from '../../helpers/apiResponseHelper'


const s3Helper = new S3Helper()
const apiResponseHelper= new ApiResponseHelper()

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  
    const authHeader = event.headers['Authorization']
    const userId = getUserId(authHeader)
    const result = await new TodosAccess().getUserTodos(userId)
    
    for(const record of result){
        record.attachmentUrl = await s3Helper.getTodoAttachmentUrl(record.todoId)
    }

    return apiResponseHelper.generateDataSuccessResponse(200,'items',result)
}