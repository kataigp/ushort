resource "aws_api_gateway_rest_api" "ushort_api" {
  name        = "UrlShortenerAPI"
  description = "API Endpoints to trigger Lambda URL Shortener lambda function"
}

resource "aws_api_gateway_resource" "short_endpoint" {
  parent_id   = aws_api_gateway_rest_api.ushort_api.root_resource_id
  path_part   = "short"
  rest_api_id = aws_api_gateway_rest_api.ushort_api.id
}

resource "aws_api_gateway_method" "method" {
  authorization = "NONE"
  http_method   = "POST"
  resource_id   = aws_api_gateway_resource.short_endpoint.id
  rest_api_id   = aws_api_gateway_rest_api.ushort_api.id
}

resource "aws_api_gateway_integration" "ushort_lambda_integration" {
  rest_api_id             = aws_api_gateway_rest_api.ushort_api.id
  resource_id             = aws_api_gateway_resource.short_endpoint.id
  http_method             = aws_api_gateway_method.method.http_method
  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.ushort_lambda.invoke_arn
}

resource "aws_api_gateway_deployment" "ushort_apigw_test_deployment" {
  rest_api_id = aws_api_gateway_rest_api.ushort_api.id

  triggers = {
    redeployment = sha1(jsonencode(aws_api_gateway_rest_api.ushort_api.body))
  }

  lifecycle {
    create_before_destroy = true
  }
  depends_on = [aws_api_gateway_method.method, aws_api_gateway_integration.ushort_lambda_integration]
}

resource "aws_api_gateway_stage" "development_test_stage" {
  deployment_id = aws_api_gateway_deployment.ushort_apigw_test_deployment.id
  rest_api_id   = aws_api_gateway_rest_api.ushort_api.id
  stage_name    = "development-test"
}