#!/bin/bash

set -e

buildId="$1"
serviceName="$2"
branch="$3"

echo "=========================================="
echo "POST BUILD VARIABLES"
echo "=========================================="
echo "buildId=$buildId"
echo "serviceName=$serviceName"
echo "branch=$branch"
echo "AWS_REGION=${AWS_DEFAULT_REGION:-ap-south-1}"
echo "=========================================="

if [ ! -f /tmp/build_tag.out ]; then
    echo "ERROR: /tmp/build_tag.out does not exist."
    exit 1
fi

tagName="$(cat /tmp/build_tag.out)"

if [ -z "$tagName" ]; then
    echo "ERROR: Docker image tag is empty."
    exit 1
fi

echo "=========================================="
echo "PUSH INFORMATION"
echo "=========================================="
echo "Full Image: $tagName"
echo "=========================================="

echo "Pushing Docker image..."

docker push "$tagName"

echo "Docker image pushed successfully."

echo "$tagName" > /tmp/final_image_tag.out

echo "=========================================="
echo "DEPLOYMENT IMAGE"
echo "=========================================="

cat /tmp/final_image_tag.out

echo "=========================================="