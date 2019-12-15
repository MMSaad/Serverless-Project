import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { S3Helper } from '../../helpers/s3Helper';
import { ApiResponseHelper } from '../../helpers/apiResponseHelper';

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const url = new S3Helper().getPresignedUrl(todoId)
    return new ApiResponseHelper()
            .generateDataSuccessResponse(200,"uploadUrl",url)
}
