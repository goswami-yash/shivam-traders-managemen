buildId=$1
serviceName=$2
branch=$3

echo "=========================================="
echo "POSTBUILD.SH VARIABLES DEBUG INFO:"
echo "=========================================="
echo "buildId=$buildId"
echo "serviceName=$serviceName"
echo "branch=$branch"
echo "AWS_REGION=${AWS_REGION:-ap-south-1}"
echo "=========================================="

# creating dynamic tag's for docker image based on git branch
case "$branch" in
    */main)
        tagSuffix="_prod"
        env="production"
        ;;
    *)
        tagSuffix="_staging"
        env="staging"
        ;;
esac
tagName="$(cat /tmp/build_tag.out)$tagSuffix"

echo "=========================================="
echo "TAG DETERMINATION DEBUG INFO:"
echo "=========================================="
echo "Branch pattern matched: $branch"
echo "Tag suffix: $tagSuffix"
echo "Environment: $env"
echo "Final tagName: $tagName"
echo "=========================================="

echo "phase 4 running"
buildLog=/tmp/docker_build.log
docker build -f ./Dockerfile-pro --tag $tagName . >"$buildLog" 2>&1
buildStatus=$?
cat "$buildLog"