#!/bin/bash

set -e

buildId="$1"
serviceName="$2"
branch="$3"

REGION="${AWS_DEFAULT_REGION:-ap-south-1}"

echo "=========================================="
echo "BUILD.SH VARIABLES"
echo "=========================================="
echo "buildId=$buildId"
echo "serviceName=$serviceName"
echo "branch=$branch"
echo "REGION=$REGION"
echo "=========================================="

if [ -z "$buildId" ]; then
    echo "ERROR: buildId is empty."
    exit 1
fi

if [ -z "$serviceName" ]; then
    echo "ERROR: serviceName is empty."
    exit 1
fi

AWS_ACCOUNT_ID=$(aws sts get-caller-identity \
    --query Account \
    --output text)

ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${REGION}.amazonaws.com"

ECR_IMAGE="${ECR_REGISTRY}/${serviceName}:${buildId}"

echo "=========================================="
echo "DOCKER BUILD"
echo "=========================================="
echo "AWS_ACCOUNT_ID=$AWS_ACCOUNT_ID"
echo "ECR_REGISTRY=$ECR_REGISTRY"
echo "ECR_IMAGE=$ECR_IMAGE"
echo "=========================================="

buildLog=/tmp/docker_build.log

docker build \
    -f ./Dockerfile-pro \
    --tag "$ECR_IMAGE" \
    . > "$buildLog" 2>&1

buildStatus=$?

cat "$buildLog"

if [ "$buildStatus" -ne 0 ]; then
    echo "ERROR: Docker build failed."
    exit "$buildStatus"
fi

echo "Docker build successful."

echo "$ECR_IMAGE" > /tmp/build_tag.out

echo "=========================================="
echo "IMAGE CREATED"
echo "=========================================="
cat /tmp/build_tag.out
echo "=========================================="