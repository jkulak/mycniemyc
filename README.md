## Run

- Build the image: `docker build -t app-image .`
- Install node_modules locally: `docker run -ti --rm -v $(pwd):/app app-image yarn install`
- Run the container `docker run -ti --rm -v $(pwd):/app -p 3003:3003 -p 9856:9856 --name app app-image`. Port `9856` is needed for the reload functionality while developing the app.
- Go to: http://0.0.0.0:3003/

## Develop

- Check if the container is running: `docker ps -a` and check for `app-image`
- Login to a running container: `docker run -ti --rm -v $(pwd):/app app-image sh`
