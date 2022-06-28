provider "aws" {
  region = var.aws_region
}

terraform {
  backend "s3" {
    region  = "eu-west-1"
    encrypt = true
    bucket = "url-shortener-infra-states"
    key = "ushort-infra-state"
  }
}