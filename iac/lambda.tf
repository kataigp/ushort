resource "aws_lambda_permission" "apigw_ushort_lambda" {
  statement_id  = "AllowExecutionFromUrlShortenerAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.ushort_lambda.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "arn:aws:execute-api:${var.aws_region}:${var.aws_account_id}:${aws_api_gateway_rest_api.ushort_api.id}/*/${aws_api_gateway_method.method.http_method}${aws_api_gateway_resource.short_endpoint.path}"
}

resource "aws_lambda_function" "ushort_lambda" {
  filename = "../dist/ushort_lambda.zip"
  function_name = "UrlShortener"
  role          = aws_iam_role.ushort_lambda_role.arn
  handler       = "index.handler"
  runtime       = "nodejs14.x"
  environment {
    variables = {
      "BASE_URL" = "${var.base_url_prefix}"
    }
  }
}

resource "aws_iam_role" "ushort_lambda_role" {
  name = "UrlShortenerLambdaRole"

  assume_role_policy = <<POLICY
{
    "Version": "2012-10-17",
    "Statement": [
        {
        "Action": "sts:AssumeRole",
        "Principal": {
            "Service": "lambda.amazonaws.com"
        },
        "Effect": "Allow",
        "Sid": ""
        }
    ]
    }
POLICY
}


resource "aws_iam_role_policy" "product_lambda_policy" {
  role = aws_iam_role.ushort_lambda_role.name
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        "Effect" : "Allow",
        "Action" : [
          "dynamodb:*",
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        "Resource" : "*"
      },
    ]
  })
}
