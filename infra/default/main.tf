terraform {
  required_version = "~> 0.13.2"
}

variable aws_profile {
  description = "The name of AWS profile to use"
  default     = "default"
}

locals {
  region    = "ap-northeast-1"
  namespace = "sandbox-nestjs-s3"
  env       = "default"

  tags = {
    Name        = "${local.namespace}-${local.env}"
    Namespace   = local.namespace
    Environment = local.env
    Terraform   = true
  }
}

provider aws {
  version = "~> 3.0"
  profile = var.aws_profile
  region  = local.region
}

resource aws_s3_bucket storage {
  bucket = "sandbox-nestjs-s3-storage"
  acl    = "private"

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }

  tags = merge(local.tags, {
    Name = "${local.namespace}-s3-${local.env}"
  })
}

resource aws_s3_bucket_public_access_block default {
  bucket = aws_s3_bucket.storage.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
