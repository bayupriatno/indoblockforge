terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "Indoblockforge-VPC"
  }
}

resource "aws_db_instance" "postgres" {
  engine             = "postgres"
  engine_version     = "14.1"
  instance_class     = "db.t3.micro"
  allocated_storage  = 20
  storage_type       = "gp2"
  db_name            = "indoblockforge_db"
  username           = "admin"
  password           = "your_secure_password"
  vpc_security_group_ids = [aws_security_group.db.id]
  skip_final_snapshot = true
}

resource "aws_ecs_cluster" "main" {
  name = "indoblockforge-cluster"
}
