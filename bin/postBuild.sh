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
echo "AWS_REGION=${AWS_REGION:-ap-south-1}"
echo "=========================================="

case "$branch" in
    */main|main)
        tagSuffix="_prod"
        env="production"
        ;;
    *)
        tagSuffix="_staging"
        env="staging"
        ;;
esac

baseTag="$(cat /tmp/build_tag.out)"

tagName="${baseTag}${tagSuffix}"

if [ -z "$tagName" ]; then
    echo "ERROR: Docker tag is empty."
    exit 1
fi

repoUri="${tagName%:*}"
imageTag="${tagName##*:}"

echo "=========================================="
echo "PUSH INFORMATION"
echo "=========================================="
echo "Environment: $env"
echo "Repository: $repoUri"
echo "Image Tag: $imageTag"
echo "Full Image: $tagName"
echo "=========================================="

echo "Pushing Docker image..."

docker push "$tagName"

echo "Docker image pushed successfully."

echo "$tagName" > /tmp/final_image_tag.out

echo "Deployment image:"
cat /tmp/final_image_tag.out