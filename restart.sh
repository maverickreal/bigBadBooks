docker container rm -f $(docker container ls -a)
docker container ls -a
docker rmi -f $(docker images -a | grep -v mongo | grep -v node)
docker image ls -a
clear
docker-compose up
