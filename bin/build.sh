#!/bin/bash

set -e

buildId="$1"
serviceName="$2"
branch="$3"

echo "=========================================="
echo "BUILD VARIABLES"
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

echo "=========================================="
echo "TAG INFORMATION"
echo "=========================================="
echo "Environment: $env"
echo "Docker image: $tagName"
echo "=========================================="

buildLog="/tmp/docker_build.log"

echo "Building Docker image..."

docker build \
    --pull \
    --file ./Dockerfile-pro \
    --tag "$tagName" \
    . >"$buildLog" 2>&1

buildStatus=$?

cat "$buildLog"

if [ "$buildStatus" -ne 0 ]; then
    echo "ERROR: Docker build failed."
    exit 1
fi

docker image inspect "$tagName" >/dev/null

echo "Docker image verified successfully:"
echo "$tagName"