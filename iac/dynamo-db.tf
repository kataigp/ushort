resource "aws_dynamodb_table" "url_data_table" {
  name           = "ShortUrlData"
  billing_mode   = "PROVISIONED"
  read_capacity  = 20
  write_capacity = 20
  hash_key       = "ShortUrl"
  range_key      = "Visits"

  attribute {
    name = "ShortUrl"
    type = "S"
  }

  attribute {
    name = "Visits"
    type = "N"
  }
  
  global_secondary_index {
    name               = "ShortUrlIndex"
    hash_key           = "ShortUrl"
    range_key          = "Visits"
    write_capacity     = 10
    read_capacity      = 10
    projection_type    = "INCLUDE"
    non_key_attributes = ["UserId"]
  }
}