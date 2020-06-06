
function UploadDockerImage {
    # Build
    ./run_docker.sh

    # Upload
    ./upload_docker.sh
}

FOLDERS=("front-end" "restapi-feed" "restapi-user")

for INDEX in 0 1 2
do
    cd $FOLDERS[$INDEX]
    UploadDockerImage()
    cd ..
done