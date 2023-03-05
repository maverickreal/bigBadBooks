FROM node
WORKDIR .
COPY . .
EXPOSE 3000
ENV JWTSECRETKEY=12345 \
DBNAME=bigbadbooksdb \
DBHOST=mongodb \
DBPORT=27017
CMD npm install ; npm run start